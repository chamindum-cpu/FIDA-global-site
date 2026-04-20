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

async function fixUsersTable() {
    try {
        console.log("Connecting to SQL Server...");
        const pool = await sql.connect(config);
        
        // Check columns
        const result = await pool.request().query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users'");
        const columns = result.recordset.map(row => row.COLUMN_NAME);
        console.log("Current columns:", columns);

        const needed = [
            { name: "email", type: "NVarChar(255)" },
            { name: "role", type: "NVarChar(50)" },
            { name: "status", type: "NVarChar(50)" }
        ];

        for (const col of needed) {
            if (!columns.includes(col.name)) {
                console.log(`Adding column ${col.name}...`);
                await pool.request().query(`ALTER TABLE users ADD ${col.name} ${col.type}`);
            }
        }

        console.log("Table successfully updated!");
    } catch (err) {
        console.error("Error:", err);
    } finally {
        process.exit();
    }
}

fixUsersTable();
