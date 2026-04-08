const sql = require('mssql');

const config = {
  user: 'MobAppTUser',
  password: 'Mgjd%7856(#3',
  server: '34.63.59.161',
  database: 'FIDAGLOBAL_COMPANYWEB',
  port: 35566,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
};

async function createProjectAndExpertiseTables() {
  try {
    console.log('Connecting to database...');
    const pool = await sql.connect(config);
    
    console.log('Creating Projects and Expertise Tables...');
    
    await pool.request().query(`
      -- 1. Create Projects Table
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'projects')
      BEGIN
        CREATE TABLE projects (
            id INT IDENTITY(1,1) PRIMARY KEY,
            title NVARCHAR(255) NOT NULL,
            client_name NVARCHAR(100),
            category_id INT NOT NULL,                -- Links to categories table
            description NVARCHAR(MAX),               -- Full project details
            image_url NVARCHAR(MAX),
            status NVARCHAR(20) DEFAULT 'Published', -- 'Published' or 'Draft'
            created_at DATETIME DEFAULT GETDATE(),
            updated_at DATETIME DEFAULT GETDATE(),
            CONSTRAINT FK_ProjectCategory FOREIGN KEY (category_id) REFERENCES categories(id)
        );
      END

      -- 2. Create Expertise Table
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'expertise')
      BEGIN
        CREATE TABLE expertise (
            id INT IDENTITY(1,1) PRIMARY KEY,
            title NVARCHAR(255) NOT NULL,
            description NVARCHAR(MAX) NOT NULL,
            icon NVARCHAR(50),                       -- Lucide icon name
            order_index INT DEFAULT 0,
            status NVARCHAR(20) DEFAULT 'Published',
            created_at DATETIME DEFAULT GETDATE()
        );
      END

      -- 3. Stored Procedure for Creating Project
      IF NOT EXISTS (SELECT * FROM sys.procedures WHERE name = 'sp_CreateProject')
      BEGIN
        EXEC('
        CREATE PROCEDURE sp_CreateProject
            @Title NVARCHAR(255),
            @ClientName NVARCHAR(100),
            @CategoryId INT,
            @Description NVARCHAR(MAX),
            @ImageUrl NVARCHAR(MAX),
            @Status NVARCHAR(20)
        AS
        BEGIN
            INSERT INTO projects (title, client_name, category_id, description, image_url, status)
            VALUES (@Title, @ClientName, @CategoryId, @Description, @ImageUrl, @Status);
            SELECT SCOPE_IDENTITY() AS ProjectId;
        END')
      END

      -- 4. Stored Procedure for Getting All Projects
      IF NOT EXISTS (SELECT * FROM sys.procedures WHERE name = 'sp_GetAllProjects')
      BEGIN
        EXEC('
        CREATE PROCEDURE sp_GetAllProjects
        AS
        BEGIN
            SELECT p.*, c.name AS category_name
            FROM projects p
            JOIN categories c ON p.category_id = c.id
            ORDER BY p.created_at DESC;
        END')
      END

      -- 5. Stored Procedure for Creating Expertise
      IF NOT EXISTS (SELECT * FROM sys.procedures WHERE name = 'sp_CreateExpertise')
      BEGIN
        EXEC('
        CREATE PROCEDURE sp_CreateExpertise
            @Title NVARCHAR(255),
            @Description NVARCHAR(MAX),
            @Icon NVARCHAR(50),
            @OrderIndex INT,
            @Status NVARCHAR(20)
        AS
        BEGIN
            INSERT INTO expertise (title, description, icon, order_index, status)
            VALUES (@Title, @Description, @Icon, @OrderIndex, @Status);
            SELECT SCOPE_IDENTITY() AS ExpertiseId;
        END')
      END

      -- 6. Stored Procedure for Getting All Expertise
      IF NOT EXISTS (SELECT * FROM sys.procedures WHERE name = 'sp_GetAllExpertise')
      BEGIN
        EXEC('
        CREATE PROCEDURE sp_GetAllExpertise
        AS
        BEGIN
            SELECT * FROM expertise ORDER BY order_index ASC;
        END')
      END
    `);

    console.log('Projects and Expertise system deployed successfully!');
    await pool.close();
  } catch (err) {
    console.error('Migration error:', err);
  }
}

createProjectAndExpertiseTables();
