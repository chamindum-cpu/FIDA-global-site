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
  requestTimeout: 60000,
};

const updates = [
  { title: "Cable Solutions", count: "390" },
  { title: "Trendy", count: "134" },
  { title: "Magi Lanka (Manufactures of Kookai)", count: "1174" },
  { title: "Ruhunu", count: "301" },
  { title: "Lanka Mineral Sands Ltd", count: "536" },
  { title: "ACL Cables", count: "814" },
  { title: "LRDC Services", count: "8890" },
  { title: "Kelani Cables", count: "526" }
];

async function updateCounts() {
  try {
    let pool = await sql.connect(config);
    
    for (const u of updates) {
      let res = await pool.request()
        .input('title', sql.NVarChar, u.title)
        .query("SELECT id, description FROM projects WHERE title = @title");
      
      if (res.recordset.length > 0) {
        let desc = res.recordset[0].description;
        // Regex to find the number before "employees"
        // It could be like "1,500" or "420"
        let newDesc = desc.replace(/(\d{1,3}(,\d{3})*|\d+)\s+employees/, `${u.count.toLocaleString()} employees`);
        
        await pool.request()
          .input('id', sql.Int, res.recordset[0].id)
          .input('desc', sql.NVarChar, newDesc)
          .query("UPDATE projects SET description = @desc WHERE id = @id");
        
        console.log(`Updated ${u.title} to ${u.count} employees`);
      } else {
        console.log(`Project not found: ${u.title}`);
      }
    }

    await pool.close();
  } catch (err) {
    console.error(err);
  }
}

updateCounts();
