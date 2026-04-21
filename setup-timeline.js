const sql = require('mssql');
const fs = require('fs');
const path = require('path');

const envLocalPath = path.join(__dirname, '.env.local');
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
  options: { encrypt: true, trustServerCertificate: true },
};

async function execIfNoExistsOrAlter(pool, queryObj, createQuery) {
    try {
        await pool.request().query(createQuery);
    } catch (e) {
        if (e.message.includes('already an object named')) {
           console.log('SP already exists or cannot create. Altering instead...');
           const alterStr = createQuery.replace(/CREATE\s+PROCEDURE/i, 'ALTER PROCEDURE');
           await pool.request().query(alterStr);
        } else {
           throw e;
        }
    }
}

async function setupTimeline() {
    try {
        const pool = await sql.connect(config);
        console.log("Connected to DB.");

        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='CompanyTimeline' and xtype='U')
            CREATE TABLE CompanyTimeline (
                TimelineId INT IDENTITY(1,1) PRIMARY KEY,
                Year NVARCHAR(50) NOT NULL,
                Text NVARCHAR(MAX) NOT NULL,
                OrderIndex INT DEFAULT 0,
                IsActive BIT DEFAULT 1,
                CreatedAt DATETIME DEFAULT GETDATE()
            )
        `);
        console.log("CompanyTimeline table checked/created.");

        await execIfNoExistsOrAlter(pool,{}, `
            CREATE PROCEDURE sp_GetAllTimeline
            AS
            BEGIN
                SELECT * FROM CompanyTimeline WHERE IsActive = 1 ORDER BY OrderIndex ASC, CreatedAt ASC;
            END
        `);
        console.log("sp_GetAllTimeline SP checked/created.");

        await execIfNoExistsOrAlter(pool,{}, `
            CREATE PROCEDURE sp_GetAllTimelineAdmin
            AS
            BEGIN
                SELECT * FROM CompanyTimeline ORDER BY OrderIndex ASC, CreatedAt ASC;
            END
        `);

        await execIfNoExistsOrAlter(pool,{}, `
            CREATE PROCEDURE sp_CreateTimeline
                @Year NVARCHAR(50),
                @Text NVARCHAR(MAX),
                @OrderIndex INT,
                @IsActive BIT
            AS
            BEGIN
                INSERT INTO CompanyTimeline (Year, Text, OrderIndex, IsActive)
                VALUES (@Year, @Text, @OrderIndex, @IsActive);
                SELECT SCOPE_IDENTITY() AS TimelineId;
            END
        `);
        console.log("sp_CreateTimeline SP checked/created.");

        await execIfNoExistsOrAlter(pool,{}, `
            CREATE PROCEDURE sp_UpdateTimeline
                @TimelineId INT,
                @Year NVARCHAR(50),
                @Text NVARCHAR(MAX),
                @OrderIndex INT,
                @IsActive BIT
            AS
            BEGIN
                UPDATE CompanyTimeline
                SET Year = @Year, Text = @Text, OrderIndex = @OrderIndex, IsActive = @IsActive
                WHERE TimelineId = @TimelineId;
            END
        `);
        console.log("sp_UpdateTimeline SP checked/created.");

        await execIfNoExistsOrAlter(pool,{}, `
            CREATE PROCEDURE sp_DeleteTimeline
                @TimelineId INT
            AS
            BEGIN
                DELETE FROM CompanyTimeline WHERE TimelineId = @TimelineId;
            END
        `);
        console.log("sp_DeleteTimeline SP checked/created.");

        console.log("Timeline Database setup successfully completed.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
setupTimeline();
