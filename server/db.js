const sql = require('mssql');
require('dotenv').config();

const config = {
    user: 'sa',
    password: 'Ims#8073',
    server: 'localhost\\SQLEXPRESS', // Double backslash needed to escape the slash
    database: 'PostQuantumDB',
    options: {
        encrypt: false, // Set to false for local SQLEXPRESS
        trustServerCertificate: true // Always true for local dev
    }
};

const connectDB = async () => {
    try {
        const pool = await sql.connect(config);
        console.log('✅ Connected to MSSQL Database');
        return pool;
    } catch (err) {
        console.error('❌ Database Connection Failed:', err.message);
        throw err;
    }
};

module.exports = {
    connectDB,
    sql
};
