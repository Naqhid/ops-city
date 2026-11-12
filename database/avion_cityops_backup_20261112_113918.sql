-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: avion_cityops
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `avion_cityops`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `avion_cityops` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `avion_cityops`;

--
-- Table structure for table `__migrationhistory`
--

DROP TABLE IF EXISTS `__migrationhistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `__migrationhistory` (
  `MigrationId` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ContextKey` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Model` longblob NOT NULL,
  `ProductVersion` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`MigrationId`,`ContextKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `__migrationhistory`
--

LOCK TABLES `__migrationhistory` WRITE;
/*!40000 ALTER TABLE `__migrationhistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `__migrationhistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `agreementtemplate`
--

DROP TABLE IF EXISTS `agreementtemplate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agreementtemplate` (
  `AgreementID` int NOT NULL AUTO_INCREMENT,
  `TemplateName` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TemplateContent` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`AgreementID`),
  UNIQUE KEY `uq_agreement_template_name` (`TemplateName`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agreementtemplate`
--

LOCK TABLES `agreementtemplate` WRITE;
/*!40000 ALTER TABLE `agreementtemplate` DISABLE KEYS */;
INSERT INTO `agreementtemplate` VALUES (1,'Building Agreement','AGREEMENT\n\nParty 1: [Naqhid]\nParty 2: [OwnerName]\n\nSubject: Agreement of tenancy contract between [OrganizationName] and [OwnerName] as per the details provided below.\n\nContract start date: [ContractStartDate]\nContract end date: [ContractEndDate]\n\nContract term:\nYear: [ContractYear]\nMonth: [ContractMonth]\nDays: [ContractDays]\n\nDeposit Type:\nMonthly Rent amount: [MonthlyRent]\nSecurity Deposit: [SecurityDeposit]\nW&E Deposit: [W&E_Deposit]\nMaintenance Deposit: [MaintenanceDeposit]\nMiscellaneous: [Miscellaneous]\nOthers: [Others]\n\nThis is a tenancy contract obliged by both the parties.\n\nName: [OrganizationName]                         Name: [OwnerName]\nDate: [CurrentDate]                              Date: [CurrentDate]\nSignature:                                      Signature:','2026-10-28 16:24:13','2026-11-05 16:36:20');
/*!40000 ALTER TABLE `agreementtemplate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `app_users`
--

DROP TABLE IF EXISTS `app_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `app_users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'admin',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_app_users_email` (`email`),
  UNIQUE KEY `uq_app_users_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_users`
--

LOCK TABLES `app_users` WRITE;
/*!40000 ALTER TABLE `app_users` DISABLE KEYS */;
INSERT INTO `app_users` VALUES (3,'admin@test.com','admin','$2a$12$Q3cO4xHG9bMtnCATx/0oce/grbOwjqAzv51aib7TW3ZTGqpeQvGhu','Admin','admin',1,'2026-10-28 16:16:00','2026-10-28 16:16:00');
/*!40000 ALTER TABLE `app_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aspnetroles`
--

DROP TABLE IF EXISTS `aspnetroles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aspnetroles` (
  `Id` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Name` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aspnetroles`
--

LOCK TABLES `aspnetroles` WRITE;
/*!40000 ALTER TABLE `aspnetroles` DISABLE KEYS */;
/*!40000 ALTER TABLE `aspnetroles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aspnetuserclaims`
--

DROP TABLE IF EXISTS `aspnetuserclaims`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aspnetuserclaims` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ClaimType` longtext COLLATE utf8mb4_unicode_ci,
  `ClaimValue` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aspnetuserclaims`
--

LOCK TABLES `aspnetuserclaims` WRITE;
/*!40000 ALTER TABLE `aspnetuserclaims` DISABLE KEYS */;
/*!40000 ALTER TABLE `aspnetuserclaims` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aspnetuserlogins`
--

DROP TABLE IF EXISTS `aspnetuserlogins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aspnetuserlogins` (
  `LoginProvider` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ProviderKey` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `UserId` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`LoginProvider`,`ProviderKey`,`UserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aspnetuserlogins`
--

LOCK TABLES `aspnetuserlogins` WRITE;
/*!40000 ALTER TABLE `aspnetuserlogins` DISABLE KEYS */;
/*!40000 ALTER TABLE `aspnetuserlogins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aspnetuserroles`
--

DROP TABLE IF EXISTS `aspnetuserroles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aspnetuserroles` (
  `UserId` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `RoleId` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`UserId`,`RoleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aspnetuserroles`
--

LOCK TABLES `aspnetuserroles` WRITE;
/*!40000 ALTER TABLE `aspnetuserroles` DISABLE KEYS */;
/*!40000 ALTER TABLE `aspnetuserroles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aspnetusers`
--

DROP TABLE IF EXISTS `aspnetusers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aspnetusers` (
  `Id` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `EmailConfirmed` tinyint(1) NOT NULL,
  `PasswordHash` longtext COLLATE utf8mb4_unicode_ci,
  `SecurityStamp` longtext COLLATE utf8mb4_unicode_ci,
  `PhoneNumber` longtext COLLATE utf8mb4_unicode_ci,
  `PhoneNumberConfirmed` tinyint(1) NOT NULL,
  `TwoFactorEnabled` tinyint(1) NOT NULL,
  `LockoutEndDateUtc` datetime DEFAULT NULL,
  `LockoutEnabled` tinyint(1) NOT NULL,
  `AccessFailedCount` int NOT NULL,
  `UserName` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ExpiryDate` datetime DEFAULT NULL,
  `OrganizationID` int DEFAULT NULL,
  `FirstName` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LastName` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aspnetusers`
--

LOCK TABLES `aspnetusers` WRITE;
/*!40000 ALTER TABLE `aspnetusers` DISABLE KEYS */;
/*!40000 ALTER TABLE `aspnetusers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignedrights`
--

DROP TABLE IF EXISTS `assignedrights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignedrights` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `RightName` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `RoleID` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignedrights`
--

LOCK TABLES `assignedrights` WRITE;
/*!40000 ALTER TABLE `assignedrights` DISABLE KEYS */;
/*!40000 ALTER TABLE `assignedrights` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bank`
--

DROP TABLE IF EXISTS `bank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bank` (
  `BankID` int NOT NULL AUTO_INCREMENT,
  `ItemCode` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ItemType` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Bank',
  `Description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `BankName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Organization` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `AccountNumber` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `AccountName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `AccountType` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `IBANCode` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SwiftCode` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Branch` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `BankCode` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `IFSCCode` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MICRCode` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Address` text COLLATE utf8mb4_unicode_ci,
  `Country` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ContactName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ContactNumber` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ContactEmail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`BankID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bank`
--

LOCK TABLES `bank` WRITE;
/*!40000 ALTER TABLE `bank` DISABLE KEYS */;
/*!40000 ALTER TABLE `bank` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brokerage`
--

DROP TABLE IF EXISTS `brokerage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brokerage` (
  `BrokerageID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Date` datetime DEFAULT NULL,
  `Amount` decimal(18,2) DEFAULT NULL,
  `PercentageOfValue` float DEFAULT NULL,
  `Comments` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`BrokerageID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brokerage`
--

LOCK TABLES `brokerage` WRITE;
/*!40000 ALTER TABLE `brokerage` DISABLE KEYS */;
/*!40000 ALTER TABLE `brokerage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `building`
--

DROP TABLE IF EXISTS `building`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `building` (
  `BuildingID` int NOT NULL AUTO_INCREMENT,
  `AddLine1` longtext COLLATE utf8mb4_unicode_ci,
  `AddLine2` longtext COLLATE utf8mb4_unicode_ci,
  `Zone` longtext COLLATE utf8mb4_unicode_ci,
  `Latitude` longtext COLLATE utf8mb4_unicode_ci,
  `Status` int DEFAULT NULL,
  `Longitude` longtext COLLATE utf8mb4_unicode_ci,
  `BlCode` longtext COLLATE utf8mb4_unicode_ci,
  `OrganizationCode` longtext COLLATE utf8mb4_unicode_ci,
  `OwnerCode` longtext COLLATE utf8mb4_unicode_ci,
  `OrganizationName` longtext COLLATE utf8mb4_unicode_ci,
  `OwnerName` longtext COLLATE utf8mb4_unicode_ci,
  `BuildingName` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `Organization_OrganizationID` int DEFAULT NULL,
  `HistoryOrganization_ID` int DEFAULT NULL,
  `TotalArea` longtext COLLATE utf8mb4_unicode_ci,
  `ConstructedArea` longtext COLLATE utf8mb4_unicode_ci,
  `BLType` int DEFAULT NULL,
  `OwnershipType` int DEFAULT NULL,
  `NoofFloors` int NOT NULL,
  `NoticePeriod` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `StartDate` datetime DEFAULT NULL,
  `NoticeDate` datetime DEFAULT NULL,
  `EndDate` datetime DEFAULT NULL,
  `RenewalDate` datetime DEFAULT NULL,
  `City` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Country` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NoticeType` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LeaseYears` int DEFAULT NULL,
  `ElectricityNumber` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `WaterNumber` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `IndoorGym` tinyint(1) NOT NULL,
  `OutdoorGym` tinyint(1) NOT NULL,
  `SwimmingPool` tinyint(1) NOT NULL,
  `PrivateParking` tinyint(1) NOT NULL,
  `GuestParking` tinyint(1) NOT NULL,
  `ParkCourtYard` tinyint(1) NOT NULL,
  `KidsPlayArea` tinyint(1) NOT NULL,
  `JoggingTrack` tinyint(1) NOT NULL,
  `TennisCourt` tinyint(1) NOT NULL,
  `BasketballCourt` tinyint(1) NOT NULL,
  `FreeWifi` tinyint(1) NOT NULL,
  `Elevators` tinyint(1) NOT NULL,
  `ConferenceRoom` tinyint(1) NOT NULL,
  `IndependentSuperMarket` tinyint(1) NOT NULL,
  `Comments` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Rent` decimal(18,2) DEFAULT NULL,
  `Advance` decimal(18,2) DEFAULT NULL,
  `RentStartDate` datetime DEFAULT NULL,
  `RentEndDate` datetime DEFAULT NULL,
  `Reference` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`BuildingID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `building`
--

LOCK TABLES `building` WRITE;
/*!40000 ALTER TABLE `building` DISABLE KEYS */;
INSERT INTO `building` VALUES (1,'test','test','test','test',1,'test','BLD789505',NULL,NULL,'Axiom',NULL,'Test',NULL,NULL,'','',1,NULL,2,NULL,'Gated Community',NULL,NULL,NULL,NULL,'test','Qatar',NULL,NULL,NULL,'test','12345',1,0,0,1,0,0,0,0,0,0,0,0,0,0,'test',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `building` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buildingattachment`
--

DROP TABLE IF EXISTS `buildingattachment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buildingattachment` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` longtext COLLATE utf8mb4_unicode_ci,
  `BuildingID` longtext COLLATE utf8mb4_unicode_ci,
  `ContentType` longtext COLLATE utf8mb4_unicode_ci,
  `Data` longblob,
  `Building_BuildingID` int DEFAULT NULL,
  `Title` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TypeID` int DEFAULT NULL,
  `UpdatedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buildingattachment`
--

LOCK TABLES `buildingattachment` WRITE;
/*!40000 ALTER TABLE `buildingattachment` DISABLE KEYS */;
/*!40000 ALTER TABLE `buildingattachment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buildingportfolio`
--

DROP TABLE IF EXISTS `buildingportfolio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buildingportfolio` (
  `OwnerID` int NOT NULL AUTO_INCREMENT,
  `OwnerCode` longtext COLLATE utf8mb4_unicode_ci,
  `Name` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `BlCode` longtext COLLATE utf8mb4_unicode_ci,
  `OwnershipType` int DEFAULT NULL,
  `AgrmntStart` datetime DEFAULT NULL,
  `AgrmntEnd` datetime DEFAULT NULL,
  `LeaseCost` float DEFAULT NULL,
  `payFreq` int DEFAULT NULL,
  `Comments` longtext COLLATE utf8mb4_unicode_ci,
  `building_BuildingID` int DEFAULT NULL,
  `DateCreated` datetime DEFAULT NULL,
  `Createdby` longtext COLLATE utf8mb4_unicode_ci,
  `DateModified` datetime DEFAULT NULL,
  `Modifiedby` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`OwnerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buildingportfolio`
--

LOCK TABLES `buildingportfolio` WRITE;
/*!40000 ALTER TABLE `buildingportfolio` DISABLE KEYS */;
/*!40000 ALTER TABLE `buildingportfolio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `costing`
--

DROP TABLE IF EXISTS `costing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `costing` (
  `CostID` int NOT NULL AUTO_INCREMENT,
  `BuildingID` int NOT NULL,
  `Type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Date` datetime NOT NULL,
  `Amount` float NOT NULL,
  `Comments` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`CostID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `costing`
--

LOCK TABLES `costing` WRITE;
/*!40000 ALTER TABLE `costing` DISABLE KEYS */;
/*!40000 ALTER TABLE `costing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `costingattachment`
--

DROP TABLE IF EXISTS `costingattachment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `costingattachment` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Name` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `BuildingID` int NOT NULL,
  `ContentType` longtext COLLATE utf8mb4_unicode_ci,
  `Data` longblob,
  `TypeID` int DEFAULT NULL,
  `Title` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `UpdatedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `costingattachment`
--

LOCK TABLES `costingattachment` WRITE;
/*!40000 ALTER TABLE `costingattachment` DISABLE KEYS */;
/*!40000 ALTER TABLE `costingattachment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `countries` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Iso` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Name` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Iso3` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NumCode` int DEFAULT NULL,
  `PhoneCode` int NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `uq_countries_iso` (`Iso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documenttype`
--

DROP TABLE IF EXISTS `documenttype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documenttype` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `TypeName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documenttype`
--

LOCK TABLES `documenttype` WRITE;
/*!40000 ALTER TABLE `documenttype` DISABLE KEYS */;
/*!40000 ALTER TABLE `documenttype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `floor`
--

DROP TABLE IF EXISTS `floor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `floor` (
  `FloorID` int NOT NULL AUTO_INCREMENT,
  `FlCode` longtext COLLATE utf8mb4_unicode_ci,
  `Description` longtext COLLATE utf8mb4_unicode_ci,
  `OrganizationCode` longtext COLLATE utf8mb4_unicode_ci,
  `BuildingCode` longtext COLLATE utf8mb4_unicode_ci,
  `OrganizationName` longtext COLLATE utf8mb4_unicode_ci,
  `BuildingName` longtext COLLATE utf8mb4_unicode_ci,
  `FloorName` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `Building_BuildingID` int DEFAULT NULL,
  `FloorArea` longtext COLLATE utf8mb4_unicode_ci,
  `ConstructedArea` longtext COLLATE utf8mb4_unicode_ci,
  `CommonArea` longtext COLLATE utf8mb4_unicode_ci,
  `FloorType` int DEFAULT NULL,
  `Comments` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`FloorID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `floor`
--

LOCK TABLES `floor` WRITE;
/*!40000 ALTER TABLE `floor` DISABLE KEYS */;
INSERT INTO `floor` VALUES (1,NULL,NULL,NULL,'BLD789505','Axiom','Test','Ground Floor',1,'23','342','424',NULL,NULL),(2,NULL,NULL,NULL,'BLD789505','Axiom','Test','1st Floor',1,'12','12','12',NULL,NULL);
/*!40000 ALTER TABLE `floor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historybuilding`
--

DROP TABLE IF EXISTS `historybuilding`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historybuilding` (
  `HistoryID` int NOT NULL AUTO_INCREMENT,
  `BuildingID` int NOT NULL,
  `AddLine1` longtext COLLATE utf8mb4_unicode_ci,
  `AddLine2` longtext COLLATE utf8mb4_unicode_ci,
  `Zone` longtext COLLATE utf8mb4_unicode_ci,
  `Latitude` longtext COLLATE utf8mb4_unicode_ci,
  `Status` int DEFAULT NULL,
  `Longitude` longtext COLLATE utf8mb4_unicode_ci,
  `BlCode` longtext COLLATE utf8mb4_unicode_ci,
  `OrganizationCode` longtext COLLATE utf8mb4_unicode_ci,
  `OwnerCode` longtext COLLATE utf8mb4_unicode_ci,
  `OrganizationName` longtext COLLATE utf8mb4_unicode_ci,
  `OwnerName` longtext COLLATE utf8mb4_unicode_ci,
  `BuildingName` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `Organization_OrganizationID` int DEFAULT NULL,
  `HistoryOrganization_ID` int DEFAULT NULL,
  `TotalArea` longtext COLLATE utf8mb4_unicode_ci,
  `ConstructedArea` longtext COLLATE utf8mb4_unicode_ci,
  `BLType` int DEFAULT NULL,
  `OwnershipType` int DEFAULT NULL,
  `NoofFloors` int NOT NULL,
  `NoticePeriod` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `StartDate` datetime DEFAULT NULL,
  `NoticeDate` datetime DEFAULT NULL,
  `EndDate` datetime DEFAULT NULL,
  `RenewalDate` datetime DEFAULT NULL,
  `City` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NoticeType` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LeaseYears` int DEFAULT NULL,
  `Version` int NOT NULL,
  PRIMARY KEY (`HistoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historybuilding`
--

LOCK TABLES `historybuilding` WRITE;
/*!40000 ALTER TABLE `historybuilding` DISABLE KEYS */;
/*!40000 ALTER TABLE `historybuilding` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historybuildingportfolio`
--

DROP TABLE IF EXISTS `historybuildingportfolio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historybuildingportfolio` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `OwnerID` int NOT NULL,
  `Version` int NOT NULL,
  `OwnerCode` longtext COLLATE utf8mb4_unicode_ci,
  `Name` longtext COLLATE utf8mb4_unicode_ci,
  `BlCode` longtext COLLATE utf8mb4_unicode_ci,
  `OwnershipType` int DEFAULT NULL,
  `AgrmntStart` datetime DEFAULT NULL,
  `AgrmntEnd` datetime DEFAULT NULL,
  `LeaseCost` float DEFAULT NULL,
  `payFreq` int DEFAULT NULL,
  `Comments` longtext COLLATE utf8mb4_unicode_ci,
  `DateCreated` datetime DEFAULT NULL,
  `Createdby` longtext COLLATE utf8mb4_unicode_ci,
  `DateModified` datetime DEFAULT NULL,
  `Modifiedby` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historybuildingportfolio`
--

LOCK TABLES `historybuildingportfolio` WRITE;
/*!40000 ALTER TABLE `historybuildingportfolio` DISABLE KEYS */;
/*!40000 ALTER TABLE `historybuildingportfolio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historyinvestor`
--

DROP TABLE IF EXISTS `historyinvestor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historyinvestor` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `InvestorID` int DEFAULT NULL,
  `Name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `InvestmentAmount` decimal(18,2) DEFAULT NULL,
  `PLPercentage` float DEFAULT NULL,
  `Comments` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Version` int DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historyinvestor`
--

LOCK TABLES `historyinvestor` WRITE;
/*!40000 ALTER TABLE `historyinvestor` DISABLE KEYS */;
/*!40000 ALTER TABLE `historyinvestor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historyinvestorrelation`
--

DROP TABLE IF EXISTS `historyinvestorrelation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historyinvestorrelation` (
  `HistoryID` int NOT NULL AUTO_INCREMENT,
  `RelationID` int NOT NULL,
  `BuildingID` int NOT NULL,
  `InvesterID` int NOT NULL,
  `Status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Date` datetime NOT NULL,
  `InvestmentAmount` float NOT NULL,
  `PLPercentage` float NOT NULL,
  `Sattlement` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Comments` longtext COLLATE utf8mb4_unicode_ci,
  `Version` int NOT NULL,
  PRIMARY KEY (`HistoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historyinvestorrelation`
--

LOCK TABLES `historyinvestorrelation` WRITE;
/*!40000 ALTER TABLE `historyinvestorrelation` DISABLE KEYS */;
/*!40000 ALTER TABLE `historyinvestorrelation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historyorganization`
--

DROP TABLE IF EXISTS `historyorganization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historyorganization` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `OrganizationID` int NOT NULL,
  `OrgCode` longtext COLLATE utf8mb4_unicode_ci,
  `Name` longtext COLLATE utf8mb4_unicode_ci,
  `StartDateSubsc` datetime DEFAULT NULL,
  `EndDateSubsc` datetime DEFAULT NULL,
  `AddLine1` longtext COLLATE utf8mb4_unicode_ci,
  `AddLine2` longtext COLLATE utf8mb4_unicode_ci,
  `City` longtext COLLATE utf8mb4_unicode_ci,
  `Country` longtext COLLATE utf8mb4_unicode_ci,
  `Pin` int DEFAULT NULL,
  `PayFreq` longtext COLLATE utf8mb4_unicode_ci,
  `Phone` longtext COLLATE utf8mb4_unicode_ci,
  `Email` longtext COLLATE utf8mb4_unicode_ci,
  `Website` longtext COLLATE utf8mb4_unicode_ci,
  `pContactName` longtext COLLATE utf8mb4_unicode_ci,
  `pContactEmail` longtext COLLATE utf8mb4_unicode_ci,
  `pContactPhone` longtext COLLATE utf8mb4_unicode_ci,
  `sContactName` longtext COLLATE utf8mb4_unicode_ci,
  `sContactEmail` longtext COLLATE utf8mb4_unicode_ci,
  `sContactPhone` longtext COLLATE utf8mb4_unicode_ci,
  `NoOfSubsYears` int DEFAULT NULL,
  `SubAmount` float DEFAULT NULL,
  `SubscRenewDate` datetime DEFAULT NULL,
  `Status` int DEFAULT NULL,
  `Comments` longtext COLLATE utf8mb4_unicode_ci,
  `DateCreated` datetime NOT NULL,
  `Createdby` longtext COLLATE utf8mb4_unicode_ci,
  `DateModified` datetime NOT NULL,
  `Modifiedby` longtext COLLATE utf8mb4_unicode_ci,
  `Version` int NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historyorganization`
--

LOCK TABLES `historyorganization` WRITE;
/*!40000 ALTER TABLE `historyorganization` DISABLE KEYS */;
/*!40000 ALTER TABLE `historyorganization` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historytenant`
--

DROP TABLE IF EXISTS `historytenant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historytenant` (
  `HistoryID` int NOT NULL AUTO_INCREMENT,
  `TenantID` int NOT NULL,
  `BuildingID` int NOT NULL,
  `FloorID` int DEFAULT NULL,
  `UnitID` int DEFAULT NULL,
  `Type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ID` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `IDType` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `IDRegistration` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ExpiryDate` datetime NOT NULL,
  `ContactNo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ContactEmail` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NatureOfEmployement` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `EmployementOrganization` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TenantType` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LDNoOfYear` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LDStartDate` datetime DEFAULT NULL,
  `LDEndDate` datetime DEFAULT NULL,
  `LDNoticePeriod` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LDNoticeDate` datetime DEFAULT NULL,
  `LDRenewalDate` datetime DEFAULT NULL,
  `LDLeaseAmount` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LDPayMethod` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LDReference` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RDContactTerm` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RDStartDate` datetime DEFAULT NULL,
  `RDEndDate` datetime DEFAULT NULL,
  `RDNoticePeriod` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RDNoticeDate` datetime DEFAULT NULL,
  `RDRenewalDate` datetime DEFAULT NULL,
  `RDRentAmont` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RDPayMethod` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RDSecurityDeposit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RDReference` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SettlementAmount` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SattlementDate` datetime DEFAULT NULL,
  `SattlementReference` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SettlementPayMethod` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SettlementComments` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `IsRent` tinyint(1) DEFAULT NULL,
  `IsLease` tinyint(1) DEFAULT NULL,
  `BrokerName` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `BrokerID` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `BrokerCost` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `BrokerPayMethod` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `BrokerDate` datetime DEFAULT NULL,
  `BrokerReference` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ContractTermYears` int DEFAULT NULL,
  `ContractTermMonths` int DEFAULT NULL,
  `ContractTermDays` int DEFAULT NULL,
  `RentNoticeType` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Comments` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RDSecurityAmount` decimal(18,2) DEFAULT NULL,
  `SecurityPayMethod` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SecurityReference` tinyint(1) DEFAULT NULL,
  `RefereeName` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RefereeAddress` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RefereeID` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RefereePhone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RefereeCompany` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RefereeEmail` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RefereeComments` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Version` int NOT NULL,
  PRIMARY KEY (`HistoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historytenant`
--

LOCK TABLES `historytenant` WRITE;
/*!40000 ALTER TABLE `historytenant` DISABLE KEYS */;
/*!40000 ALTER TABLE `historytenant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invester`
--

DROP TABLE IF EXISTS `invester`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invester` (
  `InvesterID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `InvestmentAmount` decimal(18,2) DEFAULT NULL,
  `PLPercentage` float DEFAULT NULL,
  `Comments` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `OrganizationID` int DEFAULT NULL,
  `Type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TypeID` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TypeName` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `IDNumber` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RegistrationNo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ExpiryDate` datetime DEFAULT NULL,
  `AddressLine1` longtext COLLATE utf8mb4_unicode_ci,
  `AddressLine2` longtext COLLATE utf8mb4_unicode_ci,
  `ContactNo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ContactEmail` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Website` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `City` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Country` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Zip` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `IsOwner` tinyint(1) NOT NULL,
  `IsInvestor` tinyint(1) NOT NULL,
  PRIMARY KEY (`InvesterID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invester`
--

LOCK TABLES `invester` WRITE;
/*!40000 ALTER TABLE `invester` DISABLE KEYS */;
INSERT INTO `invester` VALUES (1,'Naqhid',NULL,NULL,NULL,NULL,'Owner',NULL,'Owner',NULL,NULL,NULL,'','','6654',NULL,NULL,'',NULL,NULL,1,0);
/*!40000 ALTER TABLE `invester` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `investerattachment`
--

DROP TABLE IF EXISTS `investerattachment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `investerattachment` (
  `AttachmentID` int NOT NULL AUTO_INCREMENT,
  `Data` longblob,
  `Name` longtext COLLATE utf8mb4_unicode_ci,
  `InvesterID` int DEFAULT NULL,
  `ContentType` longtext COLLATE utf8mb4_unicode_ci,
  `TypeID` int DEFAULT NULL,
  `Title` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `UpdatedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`AttachmentID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `investerattachment`
--

LOCK TABLES `investerattachment` WRITE;
/*!40000 ALTER TABLE `investerattachment` DISABLE KEYS */;
/*!40000 ALTER TABLE `investerattachment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `investorrelation`
--

DROP TABLE IF EXISTS `investorrelation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `investorrelation` (
  `RelationID` int NOT NULL AUTO_INCREMENT,
  `BuildingID` int NOT NULL,
  `InvesterID` int NOT NULL,
  `Status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Date` datetime NOT NULL,
  `InvestmentAmount` float NOT NULL,
  `PLPercentage` float NOT NULL,
  `Sattlement` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Comments` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`RelationID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `investorrelation`
--

LOCK TABLES `investorrelation` WRITE;
/*!40000 ALTER TABLE `investorrelation` DISABLE KEYS */;
/*!40000 ALTER TABLE `investorrelation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `investorrelationattachment`
--

DROP TABLE IF EXISTS `investorrelationattachment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `investorrelationattachment` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `BuildingID` int NOT NULL,
  `Name` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `ContentType` longtext COLLATE utf8mb4_unicode_ci,
  `Data` longblob,
  `TypeID` int DEFAULT NULL,
  `Title` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `UpdatedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `investorrelationattachment`
--

LOCK TABLES `investorrelationattachment` WRITE;
/*!40000 ALTER TABLE `investorrelationattachment` DISABLE KEYS */;
/*!40000 ALTER TABLE `investorrelationattachment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migration_history`
--

DROP TABLE IF EXISTS `migration_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migration_history` (
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applied_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migration_history`
--

LOCK TABLES `migration_history` WRITE;
/*!40000 ALTER TABLE `migration_history` DISABLE KEYS */;
INSERT INTO `migration_history` VALUES ('001_create_agreement_templates.sql','2026-10-28 16:12:04'),('002_create_source.sql','2026-11-05 12:24:12');
/*!40000 ALTER TABLE `migration_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organization`
--

DROP TABLE IF EXISTS `organization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organization` (
  `OrganizationID` int NOT NULL AUTO_INCREMENT,
  `Name` longtext COLLATE utf8mb4_unicode_ci,
  `DateCreated` datetime NOT NULL,
  `AddLine1` longtext COLLATE utf8mb4_unicode_ci,
  `AddLine2` longtext COLLATE utf8mb4_unicode_ci,
  `City` longtext COLLATE utf8mb4_unicode_ci,
  `Country` longtext COLLATE utf8mb4_unicode_ci,
  `Pin` int DEFAULT NULL,
  `PayFreq` longtext COLLATE utf8mb4_unicode_ci,
  `OrgCode` longtext COLLATE utf8mb4_unicode_ci,
  `StartDateSubsc` datetime DEFAULT NULL,
  `Phone` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `Website` longtext COLLATE utf8mb4_unicode_ci,
  `pContactName` longtext COLLATE utf8mb4_unicode_ci,
  `pContactEmail` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `pContactPhone` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `sContactName` longtext COLLATE utf8mb4_unicode_ci,
  `sContactEmail` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `sContactPhone` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `NoOfSubsYears` int DEFAULT NULL,
  `SubscRenewDate` datetime DEFAULT NULL,
  `Status` int DEFAULT NULL,
  `Comments` longtext COLLATE utf8mb4_unicode_ci,
  `EndDateSubsc` datetime DEFAULT NULL,
  `Createdby` longtext COLLATE utf8mb4_unicode_ci,
  `Modifiedby` longtext COLLATE utf8mb4_unicode_ci,
  `DateModified` datetime NOT NULL,
  `SubAmount` float DEFAULT NULL,
  PRIMARY KEY (`OrganizationID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organization`
--

LOCK TABLES `organization` WRITE;
/*!40000 ALTER TABLE `organization` DISABLE KEYS */;
/*!40000 ALTER TABLE `organization` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `owner`
--

DROP TABLE IF EXISTS `owner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `owner` (
  `OwnerID` int NOT NULL AUTO_INCREMENT,
  `OwnerCode` longtext COLLATE utf8mb4_unicode_ci,
  `Name` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `AddLine1` longtext COLLATE utf8mb4_unicode_ci,
  `AddLine2` longtext COLLATE utf8mb4_unicode_ci,
  `City` longtext COLLATE utf8mb4_unicode_ci,
  `Country` longtext COLLATE utf8mb4_unicode_ci,
  `Pin` int NOT NULL,
  `Contact` longtext COLLATE utf8mb4_unicode_ci,
  `Email` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`OwnerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `owner`
--

LOCK TABLES `owner` WRITE;
/*!40000 ALTER TABLE `owner` DISABLE KEYS */;
/*!40000 ALTER TABLE `owner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sliderimage`
--

DROP TABLE IF EXISTS `sliderimage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sliderimage` (
  `SldImgID` int NOT NULL AUTO_INCREMENT,
  `Status` int NOT NULL,
  `ContentType` longtext COLLATE utf8mb4_unicode_ci,
  `Name` longtext COLLATE utf8mb4_unicode_ci,
  `Image` longblob,
  `Caption` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`SldImgID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sliderimage`
--

LOCK TABLES `sliderimage` WRITE;
/*!40000 ALTER TABLE `sliderimage` DISABLE KEYS */;
/*!40000 ALTER TABLE `sliderimage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `source`
--

DROP TABLE IF EXISTS `source`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `source` (
  `SourceID` int NOT NULL AUTO_INCREMENT,
  `SourceCode` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Description` longtext COLLATE utf8mb4_unicode_ci,
  `Status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Active',
  `CreatedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`SourceID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `source`
--

LOCK TABLES `source` WRITE;
/*!40000 ALTER TABLE `source` DISABLE KEYS */;
INSERT INTO `source` VALUES (1,'CR000001','test','Active','2026-11-05 13:13:52'),(2,'CR000002','new','Active','2026-11-05 13:15:54'),(3,'DR000001','property','Active','2026-11-05 13:16:09');
/*!40000 ALTER TABLE `source` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tenant`
--

DROP TABLE IF EXISTS `tenant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tenant` (
  `TenantID` int NOT NULL AUTO_INCREMENT,
  `BuildingID` int NOT NULL,
  `FloorID` int DEFAULT NULL,
  `UnitID` int DEFAULT NULL,
  `Type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ID` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `IDType` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `IDRegistration` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ExpiryDate` datetime NOT NULL,
  `ContactNo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ContactEmail` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NatureOfEmployement` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `EmployementOrganization` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TenantType` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LDNoOfYear` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LDStartDate` datetime DEFAULT NULL,
  `LDEndDate` datetime DEFAULT NULL,
  `LDNoticePeriod` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LDNoticeDate` datetime DEFAULT NULL,
  `LDRenewalDate` datetime DEFAULT NULL,
  `LDLeaseAmount` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LDPayMethod` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LDReference` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RDContactTerm` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RDStartDate` datetime DEFAULT NULL,
  `RDEndDate` datetime DEFAULT NULL,
  `RDNoticePeriod` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RDNoticeDate` datetime DEFAULT NULL,
  `RDRenewalDate` datetime DEFAULT NULL,
  `RDRentAmont` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RDPayMethod` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RDSecurityDeposit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RDReference` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SettlementAmount` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SattlementDate` datetime DEFAULT NULL,
  `SattlementReference` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SettlementPayMethod` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SettlementComments` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `IsRent` tinyint(1) DEFAULT NULL,
  `IsLease` tinyint(1) DEFAULT NULL,
  `BrokerName` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `BrokerID` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `BrokerCost` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `BrokerPayMethod` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `BrokerDate` datetime DEFAULT NULL,
  `BrokerReference` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ContractTermYears` int DEFAULT NULL,
  `ContractTermMonths` int DEFAULT NULL,
  `ContractTermDays` int DEFAULT NULL,
  `RentNoticeType` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Comments` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RDSecurityAmount` decimal(18,2) DEFAULT NULL,
  `SecurityPayMethod` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SecurityReference` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RefereeName` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RefereeAddress` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RefereeID` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RefereePhone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RefereeCompany` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RefereeEmail` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RefereeComments` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`TenantID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tenant`
--

LOCK TABLES `tenant` WRITE;
/*!40000 ALTER TABLE `tenant` DISABLE KEYS */;
/*!40000 ALTER TABLE `tenant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tenantattachment`
--

DROP TABLE IF EXISTS `tenantattachment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tenantattachment` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Name` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `TenantID` int NOT NULL,
  `ContentType` longtext COLLATE utf8mb4_unicode_ci,
  `Data` longblob,
  `TypeID` int DEFAULT NULL,
  `Title` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `UpdatedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tenantattachment`
--

LOCK TABLES `tenantattachment` WRITE;
/*!40000 ALTER TABLE `tenantattachment` DISABLE KEYS */;
/*!40000 ALTER TABLE `tenantattachment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tenantrental`
--

DROP TABLE IF EXISTS `tenantrental`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tenantrental` (
  `RentalID` int NOT NULL AUTO_INCREMENT,
  `TenantID` int NOT NULL,
  `PayingAmount` float NOT NULL,
  `Balance` float NOT NULL,
  `Status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Year` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Month` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Date` datetime DEFAULT NULL,
  `RentalAmount` float NOT NULL,
  `BillType` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Comments` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`RentalID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tenantrental`
--

LOCK TABLES `tenantrental` WRITE;
/*!40000 ALTER TABLE `tenantrental` DISABLE KEYS */;
/*!40000 ALTER TABLE `tenantrental` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unit`
--

DROP TABLE IF EXISTS `unit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unit` (
  `UnitID` int NOT NULL AUTO_INCREMENT,
  `UnitName` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `UnitCode` longtext COLLATE utf8mb4_unicode_ci,
  `OrganizationName` longtext COLLATE utf8mb4_unicode_ci,
  `OrganizationCode` longtext COLLATE utf8mb4_unicode_ci,
  `BuildingCode` longtext COLLATE utf8mb4_unicode_ci,
  `BuildingName` longtext COLLATE utf8mb4_unicode_ci,
  `FloorCode` longtext COLLATE utf8mb4_unicode_ci,
  `FloorName` longtext COLLATE utf8mb4_unicode_ci,
  `Floor_FloorID` int DEFAULT NULL,
  `UnitType` longtext COLLATE utf8mb4_unicode_ci,
  `Bedroom` longtext COLLATE utf8mb4_unicode_ci,
  `BedroomSize` longtext COLLATE utf8mb4_unicode_ci,
  `Bathroom` longtext COLLATE utf8mb4_unicode_ci,
  `BathroomSize` longtext COLLATE utf8mb4_unicode_ci,
  `Hall` longtext COLLATE utf8mb4_unicode_ci,
  `HallSize` longtext COLLATE utf8mb4_unicode_ci,
  `Kitchen` longtext COLLATE utf8mb4_unicode_ci,
  `Balcony` longtext COLLATE utf8mb4_unicode_ci,
  `Comments` longtext COLLATE utf8mb4_unicode_ci,
  `Area` float DEFAULT NULL,
  `FurnishDetails` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`UnitID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unit`
--

LOCK TABLES `unit` WRITE;
/*!40000 ALTER TABLE `unit` DISABLE KEYS */;
INSERT INTO `unit` VALUES (1,'G1',NULL,'Axiom',NULL,'BLD789505','Test',NULL,'Ground Floor',1,NULL,'3',NULL,'2',NULL,'1',NULL,'1','',NULL,NULL,'Fully Furnished'),(2,'G2',NULL,'Axiom',NULL,'BLD789505','Test',NULL,'Ground Floor',1,NULL,'3',NULL,'2',NULL,'1',NULL,'1','',NULL,NULL,'Fully Furnished'),(3,'F1',NULL,'Axiom',NULL,'BLD789505','Test',NULL,'1st Floor',2,NULL,'3',NULL,'2',NULL,'1',NULL,'1','1',NULL,NULL,'Fully Furnished'),(4,'F2',NULL,'Axiom',NULL,'BLD789505','Test',NULL,'1st Floor',2,NULL,'3',NULL,'2',NULL,'1',NULL,'1','1',NULL,NULL,'Fully Furnished');
/*!40000 ALTER TABLE `unit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unitpricing`
--

DROP TABLE IF EXISTS `unitpricing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unitpricing` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `UnitID` int DEFAULT NULL,
  `MonthlyPrice` decimal(18,2) DEFAULT NULL,
  `YearlyPrice` decimal(18,2) DEFAULT NULL,
  `Discount` int DEFAULT NULL,
  `FromDate` datetime DEFAULT NULL,
  `ToDate` datetime DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unitpricing`
--

LOCK TABLES `unitpricing` WRITE;
/*!40000 ALTER TABLE `unitpricing` DISABLE KEYS */;
/*!40000 ALTER TABLE `unitpricing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'avion_cityops'
--

--
-- Dumping routines for database 'avion_cityops'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-12 11:39:22
