const sql = require('mssql');
require('dotenv').config({ path: '.env.local' });

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function checkSchema() {
  try {
    let pool = await sql.connect(config);
    
    console.log("--- Projects Columns ---");
    let res1 = await pool.request().query("SELECT TOP 0 * FROM Projects");
    console.log(Object.keys(res1.recordset.columns));

    console.log("--- Categories Columns ---");
    let res2 = await pool.request().query("SELECT TOP 0 * FROM categories");
    console.log(Object.keys(res2.recordset.columns));

    await pool.close();
  } catch (err) {
    console.error(err);
  }
}

checkSchema();
