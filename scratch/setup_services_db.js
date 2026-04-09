const sql = require('mssql');

const config = {
    user: "MobAppTUser",
    password: "Mgjd%7856(#3",
    server: "34.63.59.161",
    database: "FIDAGLOBAL_COMPANYWEB",
    port: 35566,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

async function setupServices() {
    try {
        const pool = await sql.connect(config);
        console.log("Connected to DB");
        
        console.log("Creating services table...");
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'services')
            BEGIN
                CREATE TABLE services (
                    id INT PRIMARY KEY IDENTITY(1,1),
                    title NVARCHAR(255) NOT NULL,
                    description NVARCHAR(MAX) NOT NULL,
                    image_url NVARCHAR(MAX),
                    icon_name NVARCHAR(100),
                    order_index INT DEFAULT 0,
                    status NVARCHAR(50) DEFAULT 'Published',
                    created_at DATETIME DEFAULT GETDATE()
                )
            END
        `);
        
        console.log("Cleaning up old procedures...");
        try { await pool.request().query("DROP PROCEDURE sp_GetServices"); } catch(e){}
        try { await pool.request().query("DROP PROCEDURE sp_UpsertService"); } catch(e){}
        
        console.log("Creating sp_GetServices...");
        await pool.request().query(`
            CREATE PROCEDURE sp_GetServices
            AS
            BEGIN
                SELECT * FROM services WHERE status != 'Deleted' ORDER BY order_index ASC
            END
        `);
        
        console.log("Creating sp_UpsertService...");
        await pool.request().query(`
            CREATE PROCEDURE sp_UpsertService
                @id INT = NULL,
                @title NVARCHAR(255),
                @description NVARCHAR(MAX),
                @image_url NVARCHAR(MAX),
                @icon_name NVARCHAR(100) = NULL,
                @order_index INT = 0,
                @status NVARCHAR(50) = 'Published'
            AS
            BEGIN
                IF @id IS NOT NULL AND EXISTS (SELECT 1 FROM services WHERE id = @id)
                BEGIN
                    UPDATE services
                    SET title = @title,
                        description = @description,
                        image_url = @image_url,
                        icon_name = @icon_name,
                        order_index = @order_index,
                        status = @status
                    WHERE id = @id;
                END
                ELSE
                BEGIN
                    INSERT INTO services (title, description, image_url, icon_name, order_index, status)
                    VALUES (@title, @description, @image_url, @icon_name, @order_index, @status);
                END
            END
        `);
        
        console.log("Setup complete!");
        await pool.close();
        process.exit(0);
    } catch (err) {
        console.error("SETUP ERROR:", err);
        process.exit(1);
    }
}

setupServices();
