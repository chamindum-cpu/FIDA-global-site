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

async function checkOtherProjects() {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query("SELECT id, title, image_url FROM projects WHERE title NOT IN ('Kelani Cables', 'Abans Environmental Services (Pvt) Ltd.', 'LRDC Services', 'ACL Cables', 'Sinha', 'SkyNet Worldwide Express', 'Lanka Mineral Sands Ltd', 'Sipway Campus', 'SAS Travels & Tours', 'Ruhunu', 'Uva Wellassa University', 'KDDI India', 'EMG Logistics (Pvt) Ltd', 'Magi Lanka (Manufactures of Kookai)', 'Trendy', 'Kablr — Lasting Connections', 'Cable Solutions', 'Rotax Limited', 'Commercial Insurance Brokers', 'Agro Momentum', 'Monaro')");
    console.log(JSON.stringify(result.recordset, null, 2));
    await pool.close();
  } catch (err) {
    console.error(err);
  }
}

checkOtherProjects();
