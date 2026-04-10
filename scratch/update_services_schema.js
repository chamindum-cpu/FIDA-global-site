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

async function updateSchema() {
    try {
        const pool = await sql.connect(config);
        console.log("Connected to DB");
        
        console.log("Updating services table...");
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'services' AND COLUMN_NAME = 'label')
            BEGIN
                ALTER TABLE services ADD label NVARCHAR(100)
            END
            
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'services' AND COLUMN_NAME = 'features')
            BEGIN
                ALTER TABLE services ADD features NVARCHAR(MAX)
            END
        `);

        console.log("Updating sp_UpsertService...");
        try { await pool.request().query("DROP PROCEDURE sp_UpsertService"); } catch(e){}
        await pool.request().query(`
            CREATE PROCEDURE sp_UpsertService
                @id INT = NULL,
                @title NVARCHAR(255),
                @description NVARCHAR(MAX),
                @image_url NVARCHAR(MAX),
                @icon_name NVARCHAR(100) = NULL,
                @label NVARCHAR(100) = NULL,
                @features NVARCHAR(MAX) = NULL,
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
                        label = @label,
                        features = @features,
                        order_index = @order_index,
                        status = @status
                    WHERE id = @id;
                END
                ELSE
                BEGIN
                    INSERT INTO services (title, description, image_url, icon_name, label, features, order_index, status)
                    VALUES (@title, @description, @image_url, @icon_name, @label, @features, @order_index, @status);
                END
            END
        `);
        
        console.log("Schema update complete!");
        await pool.close();
        process.exit(0);
    } catch (err) {
        console.error("UPDATE ERROR:", err);
        process.exit(1);
    }
}

updateSchema();
