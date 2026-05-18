const { connectDB } = require('./db');

async function run() {
    try {
        const pool = await connectDB();
        await pool.request().query(`
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
        `);
        console.log("Table Notifications created or already exists");
        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}
run();
