import {Router} from 'express';
import {pool} from '../db.js';
import {resources, references} from '../resources.js';
import {isPlatformAdmin, requireOrganization, requireWriteAccess} from '../middleware/auth.js';
const router = Router();
const ident = s => '`' + String(s).replace(/`/g, '``') + '`';
async function schema(table) {
  const [rows] = await pool.query(`SHOW COLUMNS FROM ${ident(table)}`);
  return {cols: new Set(rows.map(r => r.Field)), primary: rows.find(r => r.Key === 'PRI')?.Field};
}
const bodyOf = req => (req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {});
// Platform admins are unscoped. Everyone else is limited to their own organization.
const orgScope = (req, orgCol) => isPlatformAdmin(req.user) ? {sql: '', params: []} : {sql: ` AND ${ident(orgCol)} = ?`, params: [req.user.organizationId]};

router.use(requireOrganization);

// Rejects writes that point a BuildingID/TenantID/UnitID/FloorID at another organization's row.
async function checkReferences(req, data) {
  if (isPlatformAdmin(req.user)) return;
  for (const [field, resource] of Object.entries(references)) {
    const value = data[field];
    if (value === undefined || value === null || value === '') continue;
    const [table, pk, orgCol] = resources[resource];
    const [rows] = await pool.query(`SELECT 1 FROM ${ident(table)} WHERE ${ident(pk)} = ? AND ${ident(orgCol)} = ? LIMIT 1`, [value, req.user.organizationId]);
    if (!rows.length) { const err = new Error(`${field} does not belong to your organization`); err.status = 400; throw err; }
  }
}

router.get('/', async (req, res) => res.json({resources: Object.keys(resources)}));

const conflict = msg => Object.assign(new Error(msg), {status: 409});
const INACTIVE_TENANT = ['Inactive', 'Vacated', 'Terminated', 'Closed'];
// Number of units on the floor and how many have a tenant. Returns null when the floor is not visible to the caller.
async function floorUsage(req, floorId) {
  const scope = orgScope(req, 'OrganizationID');
  const [f] = await pool.query(`SELECT FloorID FROM Floor WHERE FloorID = ?${scope.sql} LIMIT 1`, [floorId, ...scope.params]);
  if (!f.length) return null;
  const [u] = await pool.query('SELECT COUNT(*) n FROM Unit WHERE Floor_FloorID = ?', [floorId]);
  const [t] = await pool.query(`SELECT COUNT(*) n FROM Tenant WHERE (FloorID = ? OR UnitID IN (SELECT UnitID FROM Unit WHERE Floor_FloorID = ?)) AND Status NOT IN (${INACTIVE_TENANT.map(() => '?').join(',')})`, [floorId, floorId, ...INACTIVE_TENANT]);
  return {units: u[0].n, occupied: t[0].n > 0};
}
router.get('/floors/:id/delete-check', async (req, res, next) => { try {
  const usage = await floorUsage(req, req.params.id);
  if (!usage) return res.status(404).json({error: 'Record not found'});
  res.json({data: usage});
} catch (e) { next(e); } });

// Business rules that apply on top of generic CRUD.
async function validateWrite(req, name, data, id) {
  if (name !== 'unit-rents') return;
  let status = data.Status, unitId = data.UnitID;
  if (id && (status === undefined || unitId === undefined)) {
    const [cur] = await pool.query('SELECT Status, UnitID FROM UnitRent WHERE ID = ?', [id]);
    status = status ?? cur[0]?.Status; unitId = unitId ?? cur[0]?.UnitID;
  }
  if (!['Active', 'Inactive'].includes(status)) throw Object.assign(new Error('Status must be Active or Inactive'), {status: 400});
  if (status === 'Active') {
    const [dup] = await pool.query('SELECT 1 FROM UnitRent WHERE UnitID = ? AND Status = \'Active\' AND ID <> ? LIMIT 1', [unitId, id || 0]);
    if (dup.length) throw conflict('This unit already has an Active rent. Set the other rent to Inactive first.');
  }
}
async function beforeDelete(req, name, id) {
  if (name === 'floors') {
    const usage = await floorUsage(req, id);
    if (!usage) return;
    if (usage.occupied) throw conflict('Floor cannot be deleted because tenants are occupied in the floor units');
    await pool.query('DELETE FROM UnitRent WHERE UnitID IN (SELECT UnitID FROM Unit WHERE Floor_FloorID = ?)', [id]);
    await pool.query('DELETE FROM Unit WHERE Floor_FloorID = ?', [id]);
  }
  if (name === 'units') {
    const scope = orgScope(req, 'OrganizationID');
    const [own] = await pool.query(`SELECT 1 FROM Unit WHERE UnitID = ?${scope.sql} LIMIT 1`, [id, ...scope.params]);
    if (!own.length) return; // the delete below answers 404
    const [t] = await pool.query(`SELECT COUNT(*) n FROM Tenant WHERE UnitID = ? AND Status NOT IN (${INACTIVE_TENANT.map(() => '?').join(',')})`, [id, ...INACTIVE_TENANT]);
    if (t[0].n) throw conflict('Unit cannot be deleted because a tenant is occupying it');
    await pool.query('DELETE FROM UnitRent WHERE UnitID = ?', [id]);
  }
}

router.get('/:resource', async (req, res, next) => { try {
  const cfg = resources[req.params.resource]; if (!cfg) return res.status(404).json({error: 'Unknown resource'});
  const [table, pk, orgCol] = cfg, {cols} = await schema(table);
  const where = [], params = [];
  const scope = orgScope(req, orgCol); if (scope.sql) { where.push(`${ident(orgCol)} = ?`); params.push(...scope.params); }
  if (req.query.q) { const searchable = [...cols].filter(c => !['Data', 'PasswordHash'].includes(c)).slice(0, 30); if (searchable.length) { where.push('(' + searchable.map(c => `${ident(c)} LIKE ?`).join(' OR ') + ')'); params.push(...searchable.map(() => `%${String(req.query.q).slice(0, 100)}%`)); } }
  for (const [key, val] of Object.entries(req.query)) { if (['q', 'page', 'limit', 'sort', 'order'].includes(key) || !cols.has(key)) continue; where.push(`${ident(key)} = ?`); params.push(val); }
  const page = Math.max(1, Number.parseInt(req.query.page) || 1), limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit) || 25));
  const sort = cols.has(req.query.sort) ? req.query.sort : pk, order = String(req.query.order).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  const w = where.length ? ' WHERE ' + where.join(' AND ') : '';
  const [countRows] = await pool.query(`SELECT COUNT(*) total FROM ${ident(table)}${w}`, params);
  const [rows] = await pool.query(`SELECT * FROM ${ident(table)}${w} ORDER BY ${ident(sort)} ${order} LIMIT ? OFFSET ?`, [...params, limit, (page - 1) * limit]);
  res.json({data: rows, pagination: {page, limit, total: countRows[0].total, totalPages: Math.ceil(countRows[0].total / limit)}});
} catch (e) { next(e); } });

router.get('/:resource/:id', async (req, res, next) => { try {
  const cfg = resources[req.params.resource]; if (!cfg) return res.status(404).json({error: 'Unknown resource'});
  const [table, pk, orgCol] = cfg, scope = orgScope(req, orgCol);
  const [rows] = await pool.query(`SELECT * FROM ${ident(table)} WHERE ${ident(pk)} = ?${scope.sql} LIMIT 1`, [req.params.id, ...scope.params]);
  if (!rows.length) return res.status(404).json({error: 'Record not found'});
  res.json({data: rows[0]});
} catch (e) { next(e); } });

router.post('/:resource', requireWriteAccess, async (req, res, next) => { try {
  const cfg = resources[req.params.resource]; if (!cfg) return res.status(404).json({error: 'Unknown resource'});
  const [table, pk, orgCol] = cfg, {cols} = await schema(table), data = {...bodyOf(req)};
  if (!isPlatformAdmin(req.user)) data[orgCol] = req.user.organizationId; // never trust a client-supplied organization
  await checkReferences(req, data);
  await validateWrite(req, req.params.resource, data, null);
  const fields = Object.keys(data).filter(k => cols.has(k) && k !== pk);
  if (!fields.length) return res.status(400).json({error: 'No valid fields supplied. Use the exact column names from the database schema.'});
  const [result] = await pool.query(`INSERT INTO ${ident(table)} (${fields.map(ident).join(',')}) VALUES (${fields.map(() => '?').join(',')})`, fields.map(k => data[k] === undefined ? '' : data[k]));
  const [rows] = await pool.query(`SELECT * FROM ${ident(table)} WHERE ${ident(pk)} = ? LIMIT 1`, [result.insertId]);
  res.status(201).json({data: rows[0] || {[pk]: result.insertId, ...data}});
} catch (e) { next(e); } });

router.put('/:resource/:id', requireWriteAccess, async (req, res, next) => { try {
  const cfg = resources[req.params.resource]; if (!cfg) return res.status(404).json({error: 'Unknown resource'});
  const [table, pk, orgCol] = cfg, {cols} = await schema(table), data = {...bodyOf(req)}, scope = orgScope(req, orgCol);
  if (!isPlatformAdmin(req.user)) delete data[orgCol]; // records cannot be moved between organizations
  await checkReferences(req, data);
  await validateWrite(req, req.params.resource, data, req.params.id);
  const fields = Object.keys(data).filter(k => cols.has(k) && k !== pk);
  if (!fields.length) return res.status(400).json({error: 'No valid fields supplied'});
  const [result] = await pool.query(`UPDATE ${ident(table)} SET ${fields.map(k => ident(k) + ' = ?').join(',')} WHERE ${ident(pk)} = ?${scope.sql}`, [...fields.map(k => data[k]), req.params.id, ...scope.params]);
  const [rows] = await pool.query(`SELECT * FROM ${ident(table)} WHERE ${ident(pk)} = ?${scope.sql} LIMIT 1`, [req.params.id, ...scope.params]);
  if (!rows.length) return res.status(404).json({error: 'Record not found'});
  res.json({data: rows[0], changed: result.affectedRows > 0});
} catch (e) { next(e); } });

router.delete('/:resource/:id', requireWriteAccess, async (req, res, next) => { try {
  const cfg = resources[req.params.resource]; if (!cfg) return res.status(404).json({error: 'Unknown resource'});
  const [table, pk, orgCol] = cfg, scope = orgScope(req, orgCol);
  await beforeDelete(req, req.params.resource, req.params.id);
  const [result] = await pool.query(`DELETE FROM ${ident(table)} WHERE ${ident(pk)} = ?${scope.sql}`, [req.params.id, ...scope.params]);
  if (!result.affectedRows) return res.status(404).json({error: 'Record not found'});
  res.json({success: true});
} catch (e) { next(e); } });
export default router;
