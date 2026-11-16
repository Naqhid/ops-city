import {Router} from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {pool} from '../db.js';
import {isPlatformAdmin, requireOrganization, requireWriteAccess} from '../middleware/auth.js';

// Building images/documents and safe floor removal. Everything is scoped to the caller's organization.
const router = Router();
router.use(requireOrganization);
const here = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.resolve(here, '../../uploads');
const IMAGE_TYPES = {'.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp'};
const DOC_TYPES = {...IMAGE_TYPES, '.pdf': 'application/pdf', '.doc': 'application/msword', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.xls': 'application/vnd.ms-excel', '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '.txt': 'text/plain', '.csv': 'text/csv'};
const MAX_BYTES = 15 * 1024 * 1024, MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const bad = (msg, status = 400, extra = {}) => Object.assign(new Error(msg), {status, extra});
const upload = multer({storage: multer.memoryStorage(), limits: {fileSize: MAX_BYTES, files: 1}});
const COLS = 'FileID,BuildingID,Kind,DocType,Title,FileName,MimeType,FileSize,CreatedAt,CreatedBy,UpdatedAt,UpdatedBy';

async function loadBuilding(req, id) {
  const [rows] = await pool.query('SELECT BuildingID, Organization_OrganizationID org FROM Building WHERE BuildingID = ?' + (isPlatformAdmin(req.user) ? '' : ' AND Organization_OrganizationID = ?'), isPlatformAdmin(req.user) ? [id] : [id, req.user.organizationId]);
  if (!rows.length) throw bad('Building not found', 404);
  return rows[0];
}
async function loadFile(req, id) {
  const [rows] = await pool.query('SELECT * FROM BuildingFile WHERE FileID = ?' + (isPlatformAdmin(req.user) ? '' : ' AND OrganizationID = ?'), isPlatformAdmin(req.user) ? [id] : [id, req.user.organizationId]);
  if (!rows.length) throw bad('File not found', 404);
  return rows[0];
}

router.get('/building-files', async (req, res, next) => { try {
  if (req.query.buildingId === undefined) { // first image per building, for list thumbnails
    const admin = isPlatformAdmin(req.user);
    const [covers] = await pool.query(`SELECT MIN(FileID) FileID, BuildingID FROM BuildingFile WHERE Kind = 'image'${admin ? '' : ' AND OrganizationID = ?'} GROUP BY BuildingID`, admin ? [] : [req.user.organizationId]);
    return res.json({data: covers});
  }
  const b = await loadBuilding(req, req.query.buildingId);
  const [rows] = await pool.query(`SELECT ${COLS} FROM BuildingFile WHERE BuildingID = ? ORDER BY FileID DESC`, [b.BuildingID]);
  res.json({data: rows});
} catch (e) { next(e); } });

router.post('/building-files', requireWriteAccess, upload.single('file'), async (req, res, next) => { try {
  if (!req.file) throw bad('A file is required');
  const b = await loadBuilding(req, req.body.buildingId);
  const kind = req.body.kind === 'image' ? 'image' : 'document';
  const ext = path.extname(req.file.originalname).toLowerCase();
  const allowed = kind === 'image' ? IMAGE_TYPES : DOC_TYPES;
  if (!allowed[ext]) throw bad(kind === 'image' ? 'Images must be JPG, PNG or WebP' : 'File type is not allowed');
  if (kind === 'image' && req.file.size > MAX_IMAGE_BYTES) throw bad('Images must be 5 MB or smaller');
  const dir = path.join(UPLOAD_DIR, String(b.org ?? 'none'));
  await fs.mkdir(dir, {recursive: true});
  const stored = `${crypto.randomUUID()}${ext}`;
  await fs.writeFile(path.join(dir, stored), req.file.buffer);
  const original = path.basename(req.file.originalname).slice(0, 255);
  try {
    const [r] = await pool.query('INSERT INTO BuildingFile (OrganizationID,BuildingID,Kind,DocType,Title,FileName,MimeType,FileSize,StoragePath,CreatedBy,UpdatedBy) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      [b.org, b.BuildingID, kind, String(req.body.docType || '').slice(0, 60) || null, String(req.body.title || '').slice(0, 200) || null, original, allowed[ext], req.file.size, `${b.org ?? 'none'}/${stored}`, req.user.email, req.user.email]);
    const [rows] = await pool.query(`SELECT ${COLS} FROM BuildingFile WHERE FileID = ?`, [r.insertId]);
    res.status(201).json({data: rows[0]});
  } catch (e) { await fs.unlink(path.join(dir, stored)).catch(() => {}); throw e; }
} catch (e) { next(e); } });

router.get('/building-files/:id/download', async (req, res, next) => { try {
  const f = await loadFile(req, req.params.id);
  const full = path.resolve(UPLOAD_DIR, f.StoragePath);
  if (!full.startsWith(path.resolve(UPLOAD_DIR) + path.sep)) throw bad('File not found', 404);
  res.setHeader('Content-Type', f.MimeType);
  res.setHeader('Cache-Control', 'private, max-age=300');
  res.setHeader('Content-Disposition', `${f.Kind === 'image' ? 'inline' : 'attachment'}; filename*=UTF-8''${encodeURIComponent(f.FileName)}`);
  res.sendFile(full, err => { if (err && !res.headersSent) next(bad('File not found', 404)); });
} catch (e) { next(e); } });

router.delete('/building-files/:id', requireWriteAccess, async (req, res, next) => { try {
  const f = await loadFile(req, req.params.id);
  await pool.query('DELETE FROM BuildingFile WHERE FileID = ?', [f.FileID]);
  await fs.unlink(path.resolve(UPLOAD_DIR, f.StoragePath)).catch(() => {});
  res.json({success: true});
} catch (e) { next(e); } });

// Floor removal rules:
//  - no units: delete
//  - units, any tenant in them: refuse (409 TENANTS_OCCUPIED)
//  - units, no tenants: require ?confirm=1, then delete the units too (409 CONFIRM_REQUIRED otherwise)
const VACATED = ['inactive', 'vacated', 'terminated', 'closed', 'settled', 'left'];
router.delete('/floors/:id/safe', requireWriteAccess, async (req, res, next) => { const conn = await pool.getConnection(); try {
  const admin = isPlatformAdmin(req.user), scope = admin ? '' : ' AND OrganizationID = ?', sp = admin ? [] : [req.user.organizationId];
  const [fl] = await conn.query('SELECT FloorID FROM Floor WHERE FloorID = ?' + scope, [req.params.id, ...sp]);
  if (!fl.length) throw bad('Floor not found', 404);
  const [units] = await conn.query('SELECT UnitID FROM Unit WHERE Floor_FloorID = ?', [req.params.id]);
  const ids = units.map(u => u.UnitID);
  if (ids.length) {
    const [t] = await conn.query(`SELECT COUNT(*) n FROM Tenant WHERE UnitID IN (?) AND LOWER(COALESCE(Status,'')) NOT IN (?)`, [ids, VACATED]);
    if (t[0].n) throw bad('Floor cannot be deleted because tenants are occupied in the floor units', 409, {code: 'TENANTS_OCCUPIED'});
    if (req.query.confirm !== '1') throw bad('All the units under this floor will also be deleted permanently. Confirm to continue with the deletion.', 409, {code: 'CONFIRM_REQUIRED', unitCount: ids.length});
  }
  await conn.beginTransaction();
  if (ids.length) { await conn.query('DELETE FROM UnitRent WHERE UnitID IN (?)', [ids]); await conn.query('DELETE FROM Unit WHERE Floor_FloorID = ?', [req.params.id]); }
  await conn.query('DELETE FROM Floor WHERE FloorID = ?', [req.params.id]);
  await conn.commit();
  res.json({success: true});
} catch (e) { await conn.rollback().catch(() => {}); if (e.extra) return res.status(e.status).json({error: e.message, ...e.extra}); next(e); } finally { conn.release(); } });

export default router;
