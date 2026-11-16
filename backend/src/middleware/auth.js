import jwt from 'jsonwebtoken';
import {query} from '../db.js';

export const ADMIN_ROLE = 'admin';
export const isPlatformAdmin = user => user?.role === ADMIN_ROLE;

// Verifies the token, then reloads the user so deactivation and role/org changes apply immediately.
export async function requireAuth(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({error: 'Authentication required'});
  let decoded;
  try { decoded = jwt.verify(token, process.env.JWT_SECRET); }
  catch { return res.status(401).json({error: 'Invalid or expired token'}); }
  try {
    const rows = await query('SELECT id,email,username,display_name,role,organization_id,is_active FROM app_users WHERE id=? LIMIT 1', [decoded.sub]);
    const u = rows[0];
    if (!u || !u.is_active) return res.status(401).json({error: 'User not found or inactive'});
    req.user = {id: u.id, email: u.email, username: u.username, name: u.display_name, role: u.role, organizationId: u.organization_id};
    next();
  } catch (e) { next(e); }
}

export const requireRole = (...roles) => (req, res, next) =>
  roles.includes(req.user?.role) ? next() : res.status(403).json({error: 'You do not have permission to perform this action'});

// Non-admin users must belong to an organization to touch tenant data.
export function requireOrganization(req, res, next) {
  if (isPlatformAdmin(req.user) || req.user?.organizationId) return next();
  res.status(403).json({error: 'Your account is not assigned to an organization'});
}

// Read-only roles cannot modify data.
export function requireWriteAccess(req, res, next) {
  if (req.user?.role === 'viewer') return res.status(403).json({error: 'Your role is read-only'});
  next();
}
