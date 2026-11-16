-- Master setup (organizations, roles, users) and organization-level data isolation.
-- Back up the database before running. Existing rows keep OrganizationID = NULL;
-- only platform admins (role 'admin') can see them until they are assigned to an organization.

CREATE TABLE IF NOT EXISTS `app_roles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(40) NOT NULL,
  `description` VARCHAR(255) NULL,
  `is_system` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_app_roles_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `app_roles` (`name`,`description`,`is_system`) VALUES
  ('admin','Platform administrator. Manages organizations, roles and all users. Sees all organizations.',1),
  ('org_admin','Organization administrator. Manages users and data of one organization.',1),
  ('manager','Reads and writes data of one organization.',1),
  ('viewer','Read-only access to data of one organization.',1);

ALTER TABLE `app_users` ADD COLUMN `organization_id` INT NULL AFTER `role`, ADD INDEX `idx_app_users_org` (`organization_id`);

ALTER TABLE `Owner` ADD COLUMN `OrganizationID` INT NULL, ADD INDEX `idx_owner_org` (`OrganizationID`);
ALTER TABLE `Floor` ADD COLUMN `OrganizationID` INT NULL, ADD INDEX `idx_floor_org` (`OrganizationID`);
ALTER TABLE `Unit` ADD COLUMN `OrganizationID` INT NULL, ADD INDEX `idx_unit_org` (`OrganizationID`);
ALTER TABLE `Tenant` ADD COLUMN `OrganizationID` INT NULL, ADD INDEX `idx_tenant_org` (`OrganizationID`);
ALTER TABLE `TenantRental` ADD COLUMN `OrganizationID` INT NULL, ADD INDEX `idx_tenantrental_org` (`OrganizationID`);
ALTER TABLE `InvestorRelation` ADD COLUMN `OrganizationID` INT NULL, ADD INDEX `idx_investorrelation_org` (`OrganizationID`);
ALTER TABLE `BuildingPortfolio` ADD COLUMN `OrganizationID` INT NULL, ADD INDEX `idx_buildingportfolio_org` (`OrganizationID`);
ALTER TABLE `Costing` ADD COLUMN `OrganizationID` INT NULL, ADD INDEX `idx_costing_org` (`OrganizationID`);
ALTER TABLE `UnitPricing` ADD COLUMN `OrganizationID` INT NULL, ADD INDEX `idx_unitpricing_org` (`OrganizationID`);
ALTER TABLE `Source` ADD COLUMN `OrganizationID` INT NULL, ADD INDEX `idx_source_org` (`OrganizationID`);
ALTER TABLE `AgreementTemplate` ADD COLUMN `OrganizationID` INT NULL, ADD INDEX `idx_agreementtemplate_org` (`OrganizationID`);
-- Invester.OrganizationID and Building.Organization_OrganizationID already exist; index them.
ALTER TABLE `Invester` ADD INDEX `idx_invester_org` (`OrganizationID`);
ALTER TABLE `Building` ADD INDEX `idx_building_org` (`Organization_OrganizationID`);
