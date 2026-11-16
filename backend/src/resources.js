// resource name -> [table, primaryKey, organizationColumn]
// Every resource here is tenant data: rows are filtered by the signed-in user's organization.
// Organizations, roles and users are managed through /api/master (see routes/master.js).
export const resources = {
  "investors": ["Invester", "InvesterID", "OrganizationID"],
  "buildings": ["Building", "BuildingID", "Organization_OrganizationID"],
  "owners": ["Owner", "OwnerID", "OrganizationID"],
  "floors": ["Floor", "FloorID", "OrganizationID"],
  "units": ["Unit", "UnitID", "OrganizationID"],
  "tenants": ["Tenant", "TenantID", "OrganizationID"],
  "rentals": ["TenantRental", "RentalID", "OrganizationID"],
  "investor-relations": ["InvestorRelation", "RelationID", "OrganizationID"],
  "building-portfolios": ["BuildingPortfolio", "OwnerID", "OrganizationID"],
  "costs": ["Costing", "CostID", "OrganizationID"],
  "unit-pricing": ["UnitPricing", "ID", "OrganizationID"],
  "sources": ["Source", "SourceID", "OrganizationID"],
  "agreements": ["AgreementTemplate", "AgreementID", "OrganizationID"],
  "investments": ["InvestorRelation", "RelationID", "OrganizationID"],
  "unit-rents": ["UnitRent", "RentID", "OrganizationID"]
};

// Foreign-key style body fields that must point at rows of the caller's own organization.
export const references = {
  BuildingID: "buildings",
  TenantID: "tenants",
  UnitID: "units",
  FloorID: "floors"
};
