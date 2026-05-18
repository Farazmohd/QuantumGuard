const express = require('express');
const cors = require('cors');
const { connectDB, sql } = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Root Route (Fixes the "Cannot GET /" issue)
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #10b981;">QSafe Backend is Active</h1>
            <p>The API is running successfully on port ${PORT}.</p>
            <div style="background: #f1f5f9; display: inline-block; padding: 10px 20px; border-radius: 8px; margin-top: 20px;">
                <strong>API Status:</strong> ✅ Online
            </div>
        </div>
    `);
});

// Auth Routes
// 1. User Registration
app.post('/api/register', async (req, res) => {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const pool = await connectDB();
        const request = pool.request();

        await request
            .input('FullName', sql.NVarChar, fullName)
            .input('Email', sql.NVarChar, email)
            .input('PasswordHash', sql.NVarChar, password) // Stored plain text in existing PasswordHash column
            .input('UserRole', sql.NVarChar, role)
            .query(`
                INSERT INTO Users (FullName, Email, PasswordHash, UserRole) 
                VALUES (@FullName, @Email, @PasswordHash, @UserRole)
            `);

        res.status(201).json({ message: 'Registration successful.' });
    } catch (err) {
        console.error('Registration Error:', err.message);
        if (err.message.includes('Violation of UNIQUE KEY constraint')) {
            return res.status(400).json({ error: 'Email already registered.' });
        }
        res.status(500).json({ error: 'Database error.' });
    }
});

// 2. User Login
app.post('/api/login', async (req, res) => {
    const { email, password, role } = req.body;

    // ─── ADMIN PORTAL: Hardcoded exclusive access ───────────────────────────
    if (role === 'admin') {
        if (email === 'admin@postquantum.com' && password === '123456') {
            return res.json({
                user: {
                    id: 0,
                    name: 'System Admin',
                    email: 'admin@postquantum.com',
                    role: 'admin'
                }
            });
        } else {
            return res.status(403).json({
                error: '🔒 RESTRICTED ACCESS. Admin credentials invalid. This incident has been logged.'
            });
        }
    }

    // ─── ORG / RESEARCHER: Validate against database ────────────────────────
    try {
        const pool = await connectDB();
        const request = pool.request();

        const result = await request
            .input('Email', sql.NVarChar, email)
            .query('SELECT * FROM Users WHERE Email = @Email');

        if (result.recordset.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const user = result.recordset[0];

        // Direct comparison - password stored as plain text in PasswordHash column
        if (user.PasswordHash !== password) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        if (user.UserRole !== role) {
            return res.status(403).json({ error: `Access denied. You are registered as ${user.UserRole}.` });
        }

        res.json({
            user: {
                id: user.UID,
                name: user.FullName,
                email: user.Email,
                role: user.UserRole
            }
        });
    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ error: 'Server error.' });
    }
});

// Stores a scan result and all identified vulnerabilities
app.post('/api/scans', async (req, res) => {
    const { sourceType, sourceName, codeContent, riskScore, readinessScore, vulnerabilities } = req.body;

    console.log(`📝 Incoming Scan: ${sourceName} (${sourceType})`);
    console.log(`🔍 Detected Vulnerabilities: ${vulnerabilities ? vulnerabilities.length : 0}`);

    if (!sourceName || !codeContent) {
        return res.status(400).json({ error: 'Source name and code content are required.' });
    }

    try {
        const pool = await connectDB();
        const request = pool.request();

        // 1. Insert the main Scan record and get the ID
        const status = riskScore > 50 ? 'CRITICAL' : 'SECURE';
        const scanResult = await request
            .input('SourceType', sql.NVarChar, sourceType)
            .input('SourceName', sql.NVarChar, sourceName)
            .input('CodeContent', sql.NVarChar, codeContent)
            .input('RiskScore', sql.Int, riskScore || 0)
            .input('ReadinessScore', sql.Int, readinessScore || 0)
            .input('Status', sql.NVarChar, status)
            .query(`
                INSERT INTO Scans (SourceType, SourceName, CodeContent, RiskScore, ReadinessScore, Status, ScanDate) 
                OUTPUT INSERTED.ID
                VALUES (@SourceType, @SourceName, @CodeContent, @RiskScore, @ReadinessScore, @Status, GETDATE())
            `);

        const scanID = scanResult.recordset[0].ID;
        console.log(`✅ Scan Summary Stored (ID: ${scanID})`);

        // 2. Insert all associated vulnerabilities if they exist
        if (vulnerabilities && vulnerabilities.length > 0) {
            for (const vuln of vulnerabilities) {
                const vulnRequest = pool.request(); // Re-using pool for new request
                await vulnRequest
                    .input('ScanID', sql.Int, scanID)
                    .input('AlgorithmName', sql.NVarChar, vuln.name)
                    .input('RiskScore', sql.Int, vuln.risk || riskScore)
                    .input('LineNumber', sql.Int, vuln.line)
                    .input('CodeSnippet', sql.NVarChar, vuln.snippet)
                    .input('PQCSuggestion', sql.NVarChar, vuln.pqcAlt)
                    .query(`
                        INSERT INTO ScanVulnerabilities (ScanID, AlgorithmName, RiskScore, LineNumber, CodeSnippet, PQCSuggestion)
                        VALUES (@ScanID, @AlgorithmName, @RiskScore, @LineNumber, @CodeSnippet, @PQCSuggestion)
                    `);
            }
            console.log(`🛡️  ${vulnerabilities.length} Vulnerabilities Stored.`);
        }

        res.status(201).json({ message: 'Audit results successfully stored in database.', id: scanID });
    } catch (err) {
        console.error('❌ Database Persist Error:', err.message);
        res.status(500).json({ error: 'Failed to save results to SQL Server.' });
    }
});

// ADMIN: Get Platform Analytics
app.get('/api/admin/analytics', async (req, res) => {
    try {
        const pool = await connectDB();

        const totalScans = await pool.request().query('SELECT COUNT(*) AS total FROM Scans');
        const totalUsers = await pool.request().query("SELECT COUNT(*) AS total FROM Users WHERE UserRole != 'admin'");
        const criticalScans = await pool.request().query("SELECT COUNT(*) AS total FROM Scans WHERE Status = 'CRITICAL'");
        const topAlgos = await pool.request().query(`
            SELECT TOP 5 AlgorithmName, COUNT(*) AS occurrences 
            FROM ScanVulnerabilities 
            GROUP BY AlgorithmName 
            ORDER BY occurrences DESC
        `);

        res.json({
            totalScans: totalScans.recordset[0].total,
            totalUsers: totalUsers.recordset[0].total,
            criticalScans: criticalScans.recordset[0].total,
            topAlgorithms: topAlgos.recordset
        });
    } catch (err) {
        console.error('Admin Analytics Error:', err.message);
        res.status(500).json({ error: 'Failed to load analytics.' });
    }
});

// ADMIN: Get All Users
app.get('/api/admin/users', async (req, res) => {
    try {
        const pool = await connectDB();
        // Only select columns that exist in the original Users table
        // (CreatedAt may not exist if table was created before schema update)
        const result = await pool.request().query(
            'SELECT UID, FullName, Email, UserRole FROM Users ORDER BY UID DESC'
        );
        console.log(`👥 Admin Users Fetched: ${result.recordset.length} users`);
        res.json(result.recordset);
    } catch (err) {
        console.error('❌ Admin Users Error:', err.message);
        res.status(500).json({ error: 'Failed to load users: ' + err.message });
    }
});

// ADMIN: Approve / Deactivate User
app.patch('/api/admin/users/:id', async (req, res) => {
    const { status } = req.body;
    try {
        const pool = await connectDB();
        const request = pool.request();
        await request
            .input('UID', sql.Int, parseInt(req.params.id))
            .input('Status', sql.NVarChar, status)
            .query('UPDATE Users SET UserRole = @Status WHERE UID = @UID');
        res.json({ message: 'User updated.' });
    } catch (err) {
        res.status(500).json({ error: 'Update failed.' });
    }
});

// ADMIN: Get Recent Activity Logs (latest scans)
app.get('/api/admin/logs', async (req, res) => {
    try {
        const pool = await connectDB();
        const result = await pool.request().query(`
            SELECT TOP 20 s.ID, s.SourceName, s.Status, s.RiskScore, s.ScanDate
            FROM Scans s
            ORDER BY s.ScanDate DESC
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: 'Failed to load logs.' });
    }
});

// Retrieves the 50 most recent scans for the history view
app.get('/api/scans', async (req, res) => {
    try {
        const pool = await connectDB();
        const result = await pool.request().query(
            'SELECT TOP 50 ID, SourceType, SourceName AS [file], RiskScore AS [risk], ReadinessScore, Status, ScanDate AS [date] FROM Scans ORDER BY ScanDate DESC'
        );

        // Format the risk as percentages for the frontend
        const history = result.recordset.map(row => ({
            id: row.ID,
            file: row.file,
            risk: `${row.risk}%`,
            readiness: row.ReadinessScore,
            status: row.Status,
            date: new Date(row.date).toLocaleString()
        }));

        res.json(history);
    } catch (err) {
        console.error('❌ History Fetch Error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ADMIN: Broadcast a notification to all org users
app.post('/api/notifications', async (req, res) => {
    const { message, sentBy } = req.body;
    if (!message || !message.trim()) {
        return res.status(400).json({ error: 'Message cannot be empty.' });
    }
    try {
        const pool = await connectDB();
        await pool.request()
            .input('Message', sql.NVarChar, message.trim())
            .input('SentBy', sql.NVarChar, sentBy || 'System Admin')
            .query(`
                INSERT INTO Notifications (Message, SentBy, SentAt, IsRead)
                VALUES (@Message, @SentBy, GETDATE(), 0)
            `);
        console.log(`📣 Notification broadcast: "${message.substring(0, 60)}..."`);
        res.status(201).json({ message: 'Notification broadcast successfully.' });
    } catch (err) {
        console.error('Notification Error:', err.message);
        res.status(500).json({ error: 'Failed to send notification.' });
    }
});

// ORG: Get all notifications (newest first)
app.get('/api/notifications', async (req, res) => {
    try {
        const pool = await connectDB();
        const result = await pool.request().query(`
            SELECT TOP 50 NID, Message, SentBy, SentAt
            FROM Notifications
            ORDER BY SentAt DESC
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Fetch Notifications Error:', err.message);
        res.status(500).json({ error: 'Failed to fetch notifications.' });
    }
});

// Initialize Server & Database Connection
app.listen(PORT, async () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    try {
        await connectDB();
    } catch (err) {
        console.error('⚠️ Server started but Database connection failed.');
    }
});
