-- Building images/documents with audit info, unit type/parking, and unit rent/lease history.
ALTER TABLE `BuildingAttachment`
  ADD COLUMN `OrganizationID` INT NULL,
  ADD COLUMN `DocType` VARCHAR(50) NULL,
  ADD COLUMN `IsImage` TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN `CreatedDate` DATETIME NULL,
  ADD COLUMN `CreatedBy` VARCHAR(160) NULL,
  ADD COLUMN `UpdatedBy` VARCHAR(160) NULL,
  ADD INDEX `idx_buildingattachment_building` (`Building_BuildingID`),
  ADD INDEX `idx_buildingattachment_org` (`OrganizationID`);

ALTER TABLE `Unit` ADD COLUMN `PrivParking` VARCHAR(50) NULL;

CREATE TABLE IF NOT EXISTS `UnitRent` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `OrganizationID` INT NULL,
  `BuildingID` INT NULL,
  `UnitID` INT NOT NULL,
  `Currency` VARCHAR(10) NULL,
  `LeaseAmount` DECIMAL(18,2) NULL,
  `BaseRent` DECIMAL(18,2) NULL,
  `MonthlyMaintenance` DECIMAL(18,2) NULL,
  `PrivParkingCost` DECIMAL(18,2) NULL,
  `MiscCost` DECIMAL(18,2) NULL,
  `Status` VARCHAR(10) NOT NULL DEFAULT 'Active',
  `EntryDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  KEY `idx_unitrent_unit` (`UnitID`),
  KEY `idx_unitrent_building` (`BuildingID`),
  KEY `idx_unitrent_org` (`OrganizationID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
