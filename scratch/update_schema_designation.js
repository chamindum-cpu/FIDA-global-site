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

async function updateInquiriesSchema() {
    try {
        const pool = await sql.connect(config);
        
        console.log("Updating schema...");
        
        // Add new column
        await pool.request().query("ALTER TABLE inquiries ADD division_status NVARCHAR(255)");
        
        console.log("Schema updated successfully!");
    } catch (err) {
        console.warn("Schema might already be updated or error occurred:", err.message);
    } finally {
        process.exit();
    }
}

updateInquiriesSchema();
