-- RUN THIS SCRIPT IN MSSQL SERVER MANAGEMENT STUDIO (SSMS)
-- 1. Create the Database if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'PostQuantumDB')
BEGIN
    CREATE DATABASE PostQuantumDB;
END
GO

USE PostQuantumDB;
GO

-- 2. Create the Users Table (For Registration/Login)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        UID INT PRIMARY KEY IDENTITY(1,1),
        FullName NVARCHAR(100),
        Email NVARCHAR(100) UNIQUE,
        PasswordHash NVARCHAR(MAX),
        UserRole NVARCHAR(20),  -- 'admin', 'org', 'researcher'
        CreatedAt DATETIME DEFAULT GETDATE()
    );
END
GO

-- 3. Create the Scans Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Scans')
BEGIN
    CREATE TABLE Scans (
        ID INT PRIMARY KEY IDENTITY(1,1),
        UserID INT NULL,              -- Link to Users table
        SourceType NVARCHAR(50),      -- 'upload', 'github', or 'snippet'
        SourceName NVARCHAR(500),     -- Filename or Repo URL
        CodeContent NVARCHAR(MAX),    -- The actual code scanned
        RiskScore INT,                -- e.g., 85 (High)
        ReadinessScore INT,           -- e.g., 62 (%)
        Status NVARCHAR(20),          -- 'CRITICAL' or 'SECURE'
        ScanDate DATETIME DEFAULT GETDATE()
    );
END
GO

-- 4. Create ScanVulnerabilities Table (Technical Analysis)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ScanVulnerabilities')
BEGIN
    CREATE TABLE ScanVulnerabilities (
        Vid INT PRIMARY KEY IDENTITY(1,1),
        ScanID INT NOT NULL,
        AlgorithmName NVARCHAR(100), -- 'RSA-2048', 'MD5', etc.
        RiskScore INT,
        LineNumber INT,
        CodeSnippet NVARCHAR(MAX),
        PQCSuggestion NVARCHAR(100), -- 'CRYSTALS-Kyber', 'SHA-3'
        CONSTRAINT FK_Scans_Vulnerabilities FOREIGN KEY (ScanID) REFERENCES Scans(ID) ON DELETE CASCADE
    );
END
GO

-- 5. Optional: Create a view for easy reporting
IF EXISTS (SELECT * FROM sys.views WHERE name = 'vw_ScanSummary')
    DROP VIEW vw_ScanSummary;
GO

CREATE VIEW vw_ScanSummary AS
SELECT 
    s.ID, 
    s.SourceType, 
    s.SourceName, 
    s.Status as RiskLevel,
    s.ReadinessScore,
    s.ScanDate,
    u.FullName as ScannedBy
FROM Scans s
LEFT JOIN Users u ON s.UserID = u.UID;
GO
-- 6. Create Notifications Table (For Admin Broadcast)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Notifications')
BEGIN
    CREATE TABLE Notifications (
        NID INT PRIMARY KEY IDENTITY(1,1),
        Message NVARCHAR(MAX) NOT NULL,
        SentBy NVARCHAR(100) DEFAULT 'System Admin',
        SentAt DATETIME DEFAULT GETDATE(),
        IsRead BIT DEFAULT 0
    );
END
GO


-- 7. Seed Data (Optional)
-- Add the default system admin
-- IF NOT EXISTS (SELECT * FROM Users WHERE Email = 'admin@postquantum.com')
-- BEGIN
--     INSERT INTO Users (FullName, Email, PasswordHash, UserRole)
--     VALUES ('System Admin', 'admin@postquantum.com', '123456', 'admin');
-- END
-- GO

SELECT*FROM ScanVulnerabilities;
SELECT*FROM Users;
SELECT*FROM Notifications;
SELECT*FROM Scans;