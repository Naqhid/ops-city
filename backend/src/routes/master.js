import {Router} from 'express';
import bcrypt from 'bcryptjs';
import {pool} from '../db.js';
import {requireAuth, requireRole, isPlatformAdmin} from '../middleware/auth.js';

// Master setup: organizations, roles and users. These drive row-level data isolation.
// Platform admin ('admin'): everything. Organization admin ('org_admin'): users of own organization only.
const router = Router();
router.use(requireAuth);
const bad = (msg, status = 400) => Object.assign(new Error(msg), {status});
const str = (v, max) => (v === undefined || v === null ? '' : String(v).trim().slice(0, max));
const ORG_TEXT = ['Name', 'OrgCode', 'AddLine1', 'AddLine2', 'City', 'Country', 'PayFreq', 'Phone', 'Email', 'Website', 'pContactName', 'pContactEmail', 'pContactPhone', 'sContactName', 'sContactEmail', 'sContactPhone', 'Comments', 'Currency'];
const ORG_DATES = ['StartDateSubsc', 'EndDateSubsc', 'SubscRenewDate'];
const ORG_NUMS = ['Pin', 'NoOfSubsYears', 'Status', 'SubAmount'];

/* ---------- Organizations ---------- */
router.get('/organizations', async (req, res, next) => { try {
  const admin = isPlatformAdmin(req.user);
  if (!admin && !req.user.organizationId) return res.json({data: []});
  const [rows] = await pool.query(`SELECT * FROM Organization${admin ? '' : ' WHERE OrganizationID = ?'} ORDER BY OrganizationID DESC`, admin ? [] : [req.user.organizationId]);
  res.json({data: rows});
} catch (e) { next(e); } });

function orgFields(body, isNew) {
  const out = {};
  for (const k of ORG_TEXT) if (body[k] !== undefined || isNew) out[k] = str(body[k], 500);
  for (const k of ORG_DATES) if (body[k]) { const d = new Date(body[k]); if (Number.isNaN(d.getTime())) throw bad(`${k} is not a valid date`); out[k] = d; } else if (body[k] === '' || body[k] === null) out[k] = null;
  for (const k of ORG_NUMS) if (body[k] !== undefined) { if (body[k] === '' || body[k] === null) out[k] = null; else if (Number.isFinite(Number(body[k]))) out[k] = Number(body[k]); else throw bad(`${k} must be a number`); }
  if (isNew && !out.Currency) out.Currency = 'QAR';
  if (isNew || body.Name !== undefined) if (!out.Name) throw bad('Organization name is required');
  return out;
}
router.post('/organizations', requireRole('admin'), async (req, res, next) => { try {
  const f = orgFields(req.body || {}, true); f.DateCreated = new Date(); f.DateModified = new Date(); f.Createdby = req.user.email; f.Modifiedby = req.user.email;
  if (f.Status === undefined) f.Status = 1;
  const keys = Object.keys(f);
  const [r] = await pool.query(`INSERT INTO Organization (${keys.map(k => '`' + k + '`').join(',')}) VALUES (${keys.map(() => '?').join(',')})`, keys.map(k => f[k]));
  const [rows] = await pool.query('SELECT * FROM Organization WHERE OrganizationID = ?', [r.insertId]);
  res.status(201).json({data: rows[0]});
} catch (e) { next(e); } });
router.put('/organizations/:id', requireRole('admin'), async (req, res, next) => { try {
  const f = orgFields(req.body || {}, false); f.DateModified = new Date(); f.Modifiedby = req.user.email;
  const keys = Object.keys(f);
  await pool.query(`UPDATE Organization SET ${keys.map(k => '`' + k + '` = ?').join(',')} WHERE OrganizationID = ?`, [...keys.map(k => f[k]), req.params.id]);
  const [rows] = await pool.query('SELECT * FROM Organization WHERE OrganizationID = ?', [req.params.id]);
  if (!rows.length) throw bad('Organization not found', 404);
  res.json({data: rows[0]});
} catch (e) { next(e); } });
router.delete('/organizations/:id', requireRole('admin'), async (req, res, next) => { try {
  const [u] = await pool.query('SELECT COUNT(*) n FROM app_users WHERE organization_id = ?', [req.params.id]);
  if (u[0].n) throw bad('Organization still has users. Remove or reassign them first.', 409);
  const [r] = await pool.query('DELETE FROM Organization WHERE OrganizationID = ?', [req.params.id]);
  if (!r.affectedRows) throw bad('Organization not found', 404);
  res.json({success: true});
} catch (e) { next(e); } });

/* ---------- Roles ---------- */
router.get('/roles', requireRole('admin', 'org_admin'), async (req, res, next) => { try {
  const [rows] = await pool.query('SELECT id,name,description,is_system FROM app_roles ORDER BY id');
  res.json({data: rows});
} catch (e) { next(e); } });
const roleName = v => { const n = str(v, 40).toLowerCase(); if (!/^[a-z][a-z0-9_]{1,39}$/.test(n)) throw bad('Role name must be 2-40 characters: lowercase letters, digits and underscores, starting with a letter'); return n; };
router.post('/roles', requireRole('admin'), async (req, res, next) => { try {
  const [r] = await pool.query('INSERT INTO app_roles (name,description,is_system) VALUES (?,?,0)', [roleName(req.body?.name), str(req.body?.description, 255) || null]);
  const [rows] = await pool.query('SELECT id,name,description,is_system FROM app_roles WHERE id = ?', [r.insertId]);
  res.status(201).json({data: rows[0]});
} catch (e) { next(e); } });
router.put('/roles/:id', requireRole('admin'), async (req, res, next) => { try {
  const [cur] = await pool.query('SELECT * FROM app_roles WHERE id = ?', [req.params.id]);
  if (!cur.length) throw bad('Role not found', 404);
  if (cur[0].is_system) throw bad('System roles cannot be edited', 409);
  const name = req.body?.name !== undefined ? roleName(req.body.name) : cur[0].name;
  await pool.query('UPDATE app_roles SET name = ?, description = ? WHERE id = ?', [name, req.body?.description !== undefined ? str(req.body.description, 255) || null : cur[0].description, req.params.id]);
  if (name !== cur[0].name) await pool.query('UPDATE app_users SET role = ? WHERE role = ?', [name, cur[0].name]);
  const [rows] = await pool.query('SELECT id,name,description,is_system FROM app_roles WHERE id = ?', [req.params.id]);
  res.json({data: rows[0]});
} catch (e) { next(e); } });
router.delete('/roles/:id', requireRole('admin'), async (req, res, next) => { try {
  const [cur] = await pool.query('SELECT * FROM app_roles WHERE id = ?', [req.params.id]);
  if (!cur.length) throw bad('Role not found', 404);
  if (cur[0].is_system) throw bad('System roles cannot be deleted', 409);
  const [u] = await pool.query('SELECT COUNT(*) n FROM app_users WHERE role = ?', [cur[0].name]);
  if (u[0].n) throw bad('Role is assigned to users. Reassign them first.', 409);
  await pool.query('DELETE FROM app_roles WHERE id = ?', [req.params.id]);
  res.json({success: true});
} catch (e) { next(e); } });

/* ---------- Users ---------- */
const USER_COLS = 'id,email,username,display_name,role,organization_id,is_active,created_at';
router.use('/users', requireRole('admin', 'org_admin'));
router.get('/users', async (req, res, next) => { try {
  const admin = isPlatformAdmin(req.user);
  const [rows] = await pool.query(`SELECT ${USER_COLS} FROM app_users${admin ? '' : ' WHERE organization_id = ?'} ORDER BY id DESC`, admin ? [] : [req.user.organizationId]);
  res.json({data: rows});
} catch (e) { next(e); } });

// Validates role/organization against the caller's authority and returns the values to store.
async function resolveRoleOrg(req, role, organizationId) {
  const admin = isPlatformAdmin(req.user);
  const [r] = await pool.query('SELECT 1 FROM app_roles WHERE name = ?', [role]);
  if (!r.length) throw bad('Unknown role');
  if (!admin && role === 'admin') throw bad('Only a platform admin can assign the admin role', 403);
  let org = admin ? (organizationId === '' || organizationId === undefined ? null : Number(organizationId)) : req.user.organizationId;
  if (role === 'admin') org = null;
  else {
    if (!org) throw bad('Organization is required for this role');
    const [o] = await pool.query('SELECT 1 FROM Organization WHERE OrganizationID = ?', [org]);
    if (!o.length) throw bad('Organization not found');
  }
  return org;
}
function checkPassword(p) { if (typeof p !== 'string' || p.length < 8 || p.length > 128) throw bad('Password must be 8-128 characters'); }
async function loadManageable(req, id) {
  const [rows] = await pool.query(`SELECT ${USER_COLS} FROM app_users WHERE id = ?`, [id]);
  const u = rows[0];
  // Out-of-scope users look like they do not exist.
  if (!u || (!isPlatformAdmin(req.user) && (u.organization_id !== req.user.organizationId || u.role === 'admin'))) throw bad('User not found', 404);
  return u;
}
router.post('/users', async (req, res, next) => { try {
  const b = req.body || {}, email = str(b.email, 254).toLowerCase(), username = str(b.username, 80).toLowerCase() || email;
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw bad('A valid email is required');
  checkPassword(b.password);
  const role = str(b.role, 40).toLowerCase(), org = await resolveRoleOrg(req, role, b.organization_id);
  const hash = await bcrypt.hash(b.password, 12);
  const [r] = await pool.query('INSERT INTO app_users (email,username,password_hash,display_name,role,organization_id,is_active) VALUES (?,?,?,?,?,?,?)', [email, username, hash, str(b.display_name, 160) || null, role, org, b.is_active === false || b.is_active === 0 ? 0 : 1]);
  res.status(201).json({data: await loadManageable(req, r.insertId)});
} catch (e) { next(e); } });
router.put('/users/:id', async (req, res, next) => { try {
  const cur = await loadManageable(req, req.params.id), b = req.body || {};
  const isSelf = String(cur.id) === String(req.user.id);
  const role = b.role !== undefined ? str(b.role, 40).toLowerCase() : cur.role;
  if (isSelf && role !== cur.role) throw bad('You cannot change your own role', 409);
  if (isSelf && (b.is_active === false || b.is_active === 0)) throw bad('You cannot deactivate your own account', 409);
  const org = await resolveRoleOrg(req, role, b.organization_id !== undefined ? b.organization_id : cur.organization_id);
  if (isSelf && org !== cur.organization_id) throw bad('You cannot change your own organization', 409);
  const sets = ['role = ?', 'organization_id = ?'], params = [role, org];
  if (b.display_name !== undefined) { sets.push('display_name = ?'); params.push(str(b.display_name, 160) || null); }
  if (b.email !== undefined) { const email = str(b.email, 254).toLowerCase(); if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw bad('A valid email is required'); sets.push('email = ?'); params.push(email); }
  if (b.username !== undefined) { sets.push('username = ?'); params.push(str(b.username, 80).toLowerCase()); }
  if (b.is_active !== undefined) { sets.push('is_active = ?'); params.push(b.is_active === false || b.is_active === 0 ? 0 : 1); }
  if (b.password) { checkPassword(b.password); sets.push('password_hash = ?'); params.push(await bcrypt.hash(b.password, 12)); }
  await pool.query(`UPDATE app_users SET ${sets.join(', ')} WHERE id = ?`, [...params, cur.id]);
  res.json({data: await loadManageable(req, cur.id)});
} catch (e) { next(e); } });
router.delete('/users/:id', async (req, res, next) => { try {
  const cur = await loadManageable(req, req.params.id);
  if (String(cur.id) === String(req.user.id)) throw bad('You cannot delete your own account', 409);
  await pool.query('DELETE FROM app_users WHERE id = ?', [cur.id]);
  res.json({success: true});
} catch (e) { next(e); } });

export default router;
