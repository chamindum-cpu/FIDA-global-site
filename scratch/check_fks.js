const sql = require('mssql');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envLocalPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let key = match[1];
      let value = match[2] || '';
      if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
        value = value.replace(/\\n/gm, '\n');
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
}

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || '',
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function checkFks() {
  try {
    const pool = await sql.connect(config);
    console.log("Connected to DB.");

    const result = await pool.request().query(`
      SELECT 
          f.name AS foreign_key_name,
          OBJECT_NAME(f.parent_object_id) AS table_name,
          COL_NAME(fc.parent_object_id, fc.parent_column_id) AS column_name,
          OBJECT_NAME (f.referenced_object_id) AS referenced_table_name,
          COL_NAME(fc.referenced_object_id, fc.referenced_column_id) AS referenced_column_name
      FROM sys.foreign_keys AS f
      INNER JOIN sys.foreign_key_columns AS fc 
          ON f.object_id = fc.constraint_object_id
      WHERE OBJECT_NAME(f.parent_object_id) = 'projects'
    `);
    console.table(result.recordset);

    process.exit(0);
  } catch (err) {
    console.error("Failed: ", err);
    process.exit(1);
  }
}

checkFks();
