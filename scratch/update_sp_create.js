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

async function updateSp() {
  try {
    const pool = await sql.connect(config);
    console.log("Connected to DB.");

    await pool.request().query(`
      CREATE OR ALTER PROCEDURE sp_CreateProject
          @Title NVARCHAR(255),
          @ClientName NVARCHAR(100),
          @CategoryId INT,
          @Description NVARCHAR(MAX),
          @ImageUrl NVARCHAR(MAX),
          @Status NVARCHAR(20)
      AS
      BEGIN
          SET NOCOUNT ON;
          
          INSERT INTO projects (title, client_name, category_id, description, image_url, status, created_at, updated_at)
          VALUES (@Title, @ClientName, @CategoryId, @Description, @ImageUrl, @Status, GETDATE(), GETDATE());
          
          SELECT SCOPE_IDENTITY() AS ProjectId;
      END
    `);
    console.log("sp_CreateProject updated successfully.");

    process.exit(0);
  } catch (err) {
    console.error("Failed: ", err);
    process.exit(1);
  }
}

updateSp();
