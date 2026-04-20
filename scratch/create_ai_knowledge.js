const sql = require('mssql');

const config = {
  user: "MobAppTUser",
  password: "Mgjd%7856(#3",
  server: "34.63.59.161",
  database: "FIDAGLOBAL_COMPANYWEB",
  port: 35566,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function createAiKnowledgeTable() {
    try {
        const pool = await sql.connect(config);
        
        console.log("Creating ai_knowledge_base table...");
        
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ai_knowledge_base' and xtype='U')
            BEGIN
                CREATE TABLE ai_knowledge_base (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    category NVARCHAR(100) NOT NULL, -- e.g., 'Product' or 'Solution' or 'General'
                    title NVARCHAR(255) NOT NULL,
                    content NVARCHAR(MAX) NOT NULL,
                    created_at DATETIME DEFAULT GETDATE(),
                    is_active BIT DEFAULT 1
                );
                PRINT 'Table created successfully.';
            END
            ELSE
            BEGIN
                PRINT 'Table already exists.';
            END
        `);
        
    } catch (err) {
        console.error("Error creating table:", err.message);
    } finally {
        process.exit();
    }
}

createAiKnowledgeTable();
