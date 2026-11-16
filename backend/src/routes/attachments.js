import {Router} from 'express';
import express from 'express';
import {pool} from '../db.js';
import {isPlatformAdmin, requireOrganization, requireWriteAccess} from '../middleware/auth.js';

// Building images and documents. Files are stored in BuildingAttachment.Data and scoped by organization.
const router = Router();
router.use(requireOrganization);
const IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);
const DOC_TYPES = new Set([...IMAGE_TYPES, 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']);
const bad = (msg, status = 400) => Object.assign(new Error(msg), {status});
const scope = req => isPlatformAdmin(req.user) ? {sql: '', params: []} : {sql: ' AND OrganizationID = ?', params: [req.user.organizationId]};
const who = req => req.user.name || req.user.email;
const COLS = 'Id,Name,ContentType,Title,DocType,IsImage,Building_BuildingID,CreatedDate,CreatedBy,UpdatedDate,UpdatedBy';

router.get('/', async (req, res, next) => { try {
  const buildingId = Number(req.query.buildingId); if (!buildingId) throw bad('buildingId is required');
  const s = scope(req);
  const [rows] = await pool.query(`SELECT ${COLS} FROM BuildingAttachment WHERE Building_BuildingID = ?${s.sql} ORDER BY Id`, [buildingId, ...s.params]);
  res.json({data: rows});
} catch (e) { next(e); } });

router.get('/:id/file', async (req, res, next) => { try {
  const s = scope(req);
  const [rows] = await pool.query(`SELECT Name,ContentType,IsImage,Data FROM BuildingAttachment WHERE Id = ?${s.sql} LIMIT 1`, [req.params.id, ...s.params]);
  if (!rows.length) throw bad('File not found', 404);
  const f = rows[0];
  res.set('Content-Type', f.ContentType || 'application/octet-stream');
  res.set('Content-Disposition', `${f.IsImage ? 'inline' : 'attachment'}; filename*=UTF-8''${encodeURIComponent(f.Name || 'file')}`);
  res.set('Cache-Control', 'private, max-age=300');
  res.send(f.Data);
} catch (e) { next(e); } });

router.post('/', requireWriteAccess, express.raw({type: () => true, limit: '10mb'}), async (req, res, next) => { try {
  const buildingId = Number(req.query.buildingId); if (!buildingId) throw bad('buildingId is required');
  const isImage = req.query.isImage === '1';
  const contentType = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
  if (!Buffer.isBuffer(req.body) || !req.body.length) throw bad('File is empty');
  if (!(isImage ? IMAGE_TYPES : DOC_TYPES).has(contentType)) throw bad(isImage ? 'Image must be PNG, JPEG, WebP or GIF' : 'This file type is not allowed');
  const [b] = await pool.query('SELECT Organization_OrganizationID org FROM Building WHERE BuildingID = ? LIMIT 1', [buildingId]);
  if (!b.length || (!isPlatformAdmin(req.user) && b[0].org !== req.user.organizationId)) throw bad('Building not found', 404);
  const name = String(req.query.name || 'file').slice(0, 200), title = String(req.query.title || name).slice(0, 150), docType = String(req.query.type || '').slice(0, 50) || null;
  if (isImage) await pool.query('DELETE FROM BuildingAttachment WHERE Building_BuildingID = ? AND IsImage = 1', [buildingId]); // one main image per building
  const [r] = await pool.query('INSERT INTO BuildingAttachment (Name,ContentType,Data,Building_BuildingID,BuildingID,Title,DocType,IsImage,OrganizationID,CreatedDate,CreatedBy,UpdatedDate,UpdatedBy) VALUES (?,?,?,?,?,?,?,?,?,NOW(),?,NOW(),?)',
    [name, contentType, req.body, buildingId, String(buildingId), title, docType, isImage ? 1 : 0, b[0].org, who(req), who(req)]);
  const [rows] = await pool.query(`SELECT ${COLS} FROM BuildingAttachment WHERE Id = ?`, [r.insertId]);
  res.status(201).json({data: rows[0]});
} catch (e) { next(e); } });

router.delete('/:id', requireWriteAccess, async (req, res, next) => { try {
  const s = scope(req);
  const [r] = await pool.query(`DELETE FROM BuildingAttachment WHERE Id = ?${s.sql}`, [req.params.id, ...s.params]);
  if (!r.affectedRows) throw bad('File not found', 404);
  res.json({success: true});
} catch (e) { next(e); } });
export default router;
