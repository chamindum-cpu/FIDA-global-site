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

async function setupSettings() {
    try {
        const pool = await sql.connect(config);
        console.log("Connected to DB");
        
        console.log("Creating site_settings table...");
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'site_settings')
            BEGIN
                CREATE TABLE site_settings (
                    setting_key NVARCHAR(100) PRIMARY KEY,
                    setting_value NVARCHAR(MAX),
                    updated_at DATETIME DEFAULT GETDATE()
                )
                
                -- Insert default season
                INSERT INTO site_settings (setting_key, setting_value) VALUES ('active_season', 'None')
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

setupSettings();
