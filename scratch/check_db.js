const sql = require('mssql');
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^#][^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^"(.*)"$/, '$1');
  }
});

const config = {
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  server: env.DB_SERVER,
  database: env.DB_NAME,
  port: parseInt(env.DB_PORT),
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function checkSchema() {
  try {
    let pool = await sql.connect(config);
    
    console.log('--- Categories ---');
    let cats = await pool.request().query('SELECT * FROM categories');
    console.log(JSON.stringify(cats.recordset, null, 2));

    console.log('\n--- Projects Columns ---');
    let columns = await pool.request().query("SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'projects'");
    console.log(JSON.stringify(columns.recordset, null, 2));

    await pool.close();
  } catch (err) {
    console.error(err);
  }
}

checkSchema();
