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

async function updateInquiriesTable() {
    try {
        const pool = await sql.connect(config);
        
        const needed = [
            { name: "employee_count", type: "NVarChar(100)" },
            { name: "carder_count", type: "NVarChar(100)" },
            { name: "company_count", type: "NVarChar(100)" }
        ];

        const result = await pool.request().query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'inquiries'");
        const columns = result.recordset.map(row => row.COLUMN_NAME);

        for (const col of needed) {
            if (!columns.includes(col.name)) {
                console.log(`Adding ${col.name}...`);
                await pool.request().query(`ALTER TABLE inquiries ADD ${col.name} ${col.type}`);
            }
        }
        console.log("Inquiries table updated!");
    } catch (err) {
        console.error("Error:", err);
    } finally {
        process.exit();
    }
}

updateInquiriesTable();
