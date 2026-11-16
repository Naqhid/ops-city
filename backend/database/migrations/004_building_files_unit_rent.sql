-- Building images/documents, unit rent/lease rows, extra unit fields, organization currency.

ALTER TABLE `Organization` ADD COLUMN `Currency` VARCHAR(10) NULL DEFAULT 'QAR';

ALTER TABLE `Unit`
  ADD COLUMN `ElectricityNumber` VARCHAR(100) NULL,
  ADD COLUMN `WaterNumber` VARCHAR(100) NULL,
  ADD COLUMN `PrivParking` VARCHAR(100) NULL;

CREATE TABLE IF NOT EXISTS `BuildingFile` (
  `FileID` INT NOT NULL AUTO_INCREMENT,
  `OrganizationID` INT NULL,
  `BuildingID` INT NOT NULL,
  `Kind` VARCHAR(10) NOT NULL DEFAULT 'document',
  `DocType` VARCHAR(60) NULL,
  `Title` VARCHAR(200) NULL,
  `FileName` VARCHAR(255) NOT NULL,
  `MimeType` VARCHAR(100) NOT NULL,
  `FileSize` INT NOT NULL,
  `StoragePath` VARCHAR(300) NOT NULL,
  `CreatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` VARCHAR(254) NULL,
  `UpdatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `UpdatedBy` VARCHAR(254) NULL,
  PRIMARY KEY (`FileID`),
  KEY `idx_buildingfile_building` (`BuildingID`),
  KEY `idx_buildingfile_org` (`OrganizationID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- One row per rent period of a unit. The generated ActiveKey + unique index
-- guarantees a unit never has more than one 'Active' row, even under concurrent writes.
CREATE TABLE IF NOT EXISTS `UnitRent` (
  `RentID` INT NOT NULL AUTO_INCREMENT,
  `OrganizationID` INT NULL,
  `UnitID` INT NOT NULL,
  `Currency` VARCHAR(10) NULL,
  `LeaseAmount` DECIMAL(18,2) NULL,
  `BaseRent` DECIMAL(18,2) NULL,
  `MaintenanceCost` DECIMAL(18,2) NULL,
  `PrivParkingCost` DECIMAL(18,2) NULL,
  `MiscCost` DECIMAL(18,2) NULL,
  `Status` VARCHAR(10) NOT NULL DEFAULT 'Active',
  `RentDate` DATE NOT NULL,
  `CreatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ActiveKey` INT GENERATED ALWAYS AS (IF(`Status` = 'Active', `UnitID`, NULL)) STORED,
  PRIMARY KEY (`RentID`),
  UNIQUE KEY `uq_unitrent_active` (`ActiveKey`),
  KEY `idx_unitrent_unit` (`UnitID`),
  KEY `idx_unitrent_org` (`OrganizationID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
