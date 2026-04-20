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

async function createCareersTable() {
    try {
        const pool = await sql.connect(config);
        
        console.log("Creating careers table...");
        
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='careers' and xtype='U')
            BEGIN
                CREATE TABLE careers (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    title NVARCHAR(255) NOT NULL,
                    dept NVARCHAR(100) NOT NULL,
                    type NVARCHAR(50) NOT NULL,
                    location NVARCHAR(100) NOT NULL,
                    color NVARCHAR(50) DEFAULT 'var(--green)',
                    created_at DATETIME DEFAULT GETDATE(),
                    is_active BIT DEFAULT 1
                );
                PRINT 'Table created successfully.';
            END
            ELSE
            BEGIN
                PRINT 'Table already exists.';
            END
        `);
        
    } catch (err) {
        console.error("Error creating table:", err.message);
    } finally {
        process.exit();
    }
}

createCareersTable();
