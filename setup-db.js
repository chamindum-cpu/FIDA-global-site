const sql = require('mssql');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
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
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
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

async function setupDb() {
  try {
    const pool = await sql.connect(config);
    console.log("Connected to DB.");

    // Create Applications table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='JobApplications' and xtype='U')
      CREATE TABLE JobApplications (
          ApplicationId INT IDENTITY(1,1) PRIMARY KEY,
          FullName NVARCHAR(255) NOT NULL,
          Email NVARCHAR(255) NOT NULL,
          Phone NVARCHAR(50),
          Position NVARCHAR(255) NOT NULL,
          ResumeUrl NVARCHAR(MAX),
          Message NVARCHAR(MAX),
          Status NVARCHAR(50) DEFAULT 'Pending',
          AppliedDate DATETIME DEFAULT GETDATE(),
          IsDeleted BIT DEFAULT 0
      )
    `);
    console.log("JobApplications table checked/created.");


    await execIfNoExistsOrAlter(pool,{}, `
      CREATE PROCEDURE sp_CreateJobApplication
          @FullName NVARCHAR(255),
          @Email NVARCHAR(255),
          @Phone NVARCHAR(50),
          @Position NVARCHAR(255),
          @ResumeUrl NVARCHAR(MAX),
          @Message NVARCHAR(MAX)
      AS
      BEGIN
          INSERT INTO JobApplications (FullName, Email, Phone, Position, ResumeUrl, Message, Status, AppliedDate, IsDeleted)
          VALUES (@FullName, @Email, @Phone, @Position, @ResumeUrl, @Message, 'Pending', GETDATE(), 0);
          SELECT SCOPE_IDENTITY() AS ApplicationId;
      END
    `);
    console.log("sp_CreateJobApplication SP checked/created.");


    await execIfNoExistsOrAlter(pool,{},`
      CREATE PROCEDURE sp_GetAllJobApplications
      AS
      BEGIN
          SELECT * FROM JobApplications
          WHERE IsDeleted = 0
          ORDER BY AppliedDate DESC;
      END
    `);
    console.log("sp_GetAllJobApplications SP checked/created.");

    await execIfNoExistsOrAlter(pool,{},`
      CREATE PROCEDURE sp_UpdateJobApplicationStatus
          @ApplicationId INT,
          @Status NVARCHAR(50)
      AS
      BEGIN
          UPDATE JobApplications
          SET Status = @Status
          WHERE ApplicationId = @ApplicationId AND IsDeleted = 0;
      END
    `);
    console.log("sp_UpdateJobApplicationStatus SP checked/created.");


    await execIfNoExistsOrAlter(pool,{},`
      CREATE PROCEDURE sp_DeleteJobApplication
          @ApplicationId INT
      AS
      BEGIN
          UPDATE JobApplications
          SET IsDeleted = 1
          WHERE ApplicationId = @ApplicationId;
      END
    `);
    console.log("sp_DeleteJobApplication SP checked/created.");

    console.log("Database setup successfully completed.");
    process.exit(0);

  } catch (err) {
    console.error("Database setup failed: ", err);
    process.exit(1);
  }
}

setupDb();
