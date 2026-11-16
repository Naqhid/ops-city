import {Router} from 'express';
import {pool} from '../db.js';
import {isPlatformAdmin, requireOrganization} from '../middleware/auth.js';
const router = Router();
router.use(requireOrganization);

// Counts/sums only rows of the caller's organization (platform admins see everything).
async function agg(req, table, orgCol, expr) {
  try {
    const admin = isPlatformAdmin(req.user);
    const [r] = await pool.query(`SELECT ${expr} total FROM \`${table}\`${admin ? '' : ` WHERE \`${orgCol}\` = ?`}`, admin ? [] : [req.user.organizationId]);
    return Number(r[0].total);
  } catch { return 0; }
}
router.get('/summary', async (req, res, next) => { try {
  const [investors, buildings, tenants, investorRelations, costEntries, rentalEntries, totalInvestment, totalRent, totalCost] = await Promise.all([
    agg(req, 'Invester', 'OrganizationID', 'COUNT(*)'),
    agg(req, 'Building', 'Organization_OrganizationID', 'COUNT(*)'),
    agg(req, 'Tenant', 'OrganizationID', 'COUNT(*)'),
    agg(req, 'InvestorRelation', 'OrganizationID', 'COUNT(*)'),
    agg(req, 'Costing', 'OrganizationID', 'COUNT(*)'),
    agg(req, 'TenantRental', 'OrganizationID', 'COUNT(*)'),
    agg(req, 'InvestorRelation', 'OrganizationID', 'COALESCE(SUM(InvestmentAmount),0)'),
    agg(req, 'TenantRental', 'OrganizationID', 'COALESCE(SUM(RentalAmount),0)'),
    agg(req, 'Costing', 'OrganizationID', 'COALESCE(SUM(Amount),0)')
  ]);
  res.json({data: {investors, buildings, tenants, investorRelations, costEntries, rentalEntries, totalInvestment, totalRent, totalCost}});
} catch (e) { next(e); } });
export default router;
