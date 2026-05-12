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

async function checkIndices(tableName) {
  try {
    const pool = await sql.connect(config);
    console.log("Connected to DB.");

    const result = await pool.request()
      .input('tableName', sql.NVarChar, tableName)
      .query(`
        SELECT 
            i.name AS IndexName,
            i.is_unique,
            i.is_primary_key,
            COL_NAME(ic.object_id, ic.column_id) AS ColumnName
        FROM sys.indexes AS i
        INNER JOIN sys.index_columns AS ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
        WHERE i.object_id = OBJECT_ID(@tableName)
      `);

    console.table(result.recordset);

    process.exit(0);
  } catch (err) {
    console.error("Failed: ", err);
    process.exit(1);
  }
}

checkIndices('projects');
