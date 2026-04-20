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

async function checkTables() {
    try {
        console.log("Connecting...");
        const pool = await sql.connect(config);
        
        const tables = ['blogs', 'projects', 'expertise', 'users', 'customers'];
        for (const table of tables) {
            const res = await pool.request().query(`SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '${table}'`);
            if (res.recordset[0].count === 0) {
                console.log(`⚠️ Table '${table}' DOES NOT EXIST!`);
            } else {
                console.log(`✅ Table '${table}' exists.`);
            }
        }
    } catch (err) {
        console.error("Error:", err);
    } finally {
        process.exit();
    }
}

checkTables();
