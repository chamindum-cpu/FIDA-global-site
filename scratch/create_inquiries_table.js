const sql = require('mssql');

const config = {
  user: "MobAppTUser",
  password: "Mgjd%7856(#3",
  server: "34.63.59.161",
  database: "FIDAGLOBAL_COMPANYWEB",
  port: 35566,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function checkInquiriesTable() {
    try {
        const pool = await sql.connect(config);
        const res = await pool.request().query("SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'inquiries'");
        if (res.recordset[0].count === 0) {
            console.log("Table 'inquiries' does not exist. Creating it...");
            await pool.request().query(`
                CREATE TABLE inquiries (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    name NVARCHAR(255),
                    email NVARCHAR(255),
                    company NVARCHAR(255),
                    service NVARCHAR(100),
                    message NVARCHAR(MAX),
                    status NVARCHAR(50) DEFAULT 'New',
                    created_at DATETIME DEFAULT GETDATE()
                )
            `);
            console.log("Table 'inquiries' created successfully!");
        } else {
            console.log("Table 'inquiries' already exists.");
        }
    } catch (err) {
        console.error("Error:", err);
    } finally {
        process.exit();
    }
}

checkInquiriesTable();
