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

async function getDescriptions() {
  try {
    let pool = await sql.connect(config);
    const titles = [
      'Cable Solutions',
      'Trendy',
      'Magi Lanka (Manufactures of Kookai)',
      'Ruhunu',
      'Lanka Mineral Sands Ltd',
      'ACL Cables',
      'LRDC Services',
      'Kelani Cables'
    ];
    
    let result = await pool.request().query(`SELECT id, title, description FROM projects WHERE title IN (${titles.map(t => `'${t.replace(/'/g, "''")}'`).join(',')})`);
    console.log(JSON.stringify(result.recordset, null, 2));
    await pool.close();
  } catch (err) {
    console.error(err);
  }
}

getDescriptions();
