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

async function migrate() {
    try {
        const pool = await sql.connect(config);
        console.log("Connected to DB");
        
        console.log("Updating team_members table...");
        await pool.request().query("IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'team_members' AND COLUMN_NAME = 'accent') ALTER TABLE team_members ADD accent NVARCHAR(50)");
        
        console.log("Updating sp_UpsertTeamMember stored procedure...");
        await pool.request().query(`
            ALTER PROCEDURE sp_UpsertTeamMember
                @id INT = NULL,
                @name NVARCHAR(255),
                @position NVARCHAR(255),
                @bio NVARCHAR(MAX),
                @image_url NVARCHAR(MAX),
                @linkedin_url NVARCHAR(MAX) = NULL,
                @twitter_url NVARCHAR(MAX) = NULL,
                @accent NVARCHAR(50) = '#38a3f5',
                @order_index INT = 0,
                @status NVARCHAR(50) = 'Active'
            AS
            BEGIN
                IF @id IS NOT NULL AND EXISTS (SELECT 1 FROM team_members WHERE id = @id)
                BEGIN
                    UPDATE team_members
                    SET name = @name,
                        position = @position,
                        bio = @bio,
                        image_url = @image_url,
                        linkedin_url = @linkedin_url,
                        twitter_url = @twitter_url,
                        accent = @accent,
                        order_index = @order_index,
                        status = @status
                    WHERE id = @id;
                END
                ELSE
                BEGIN
                    INSERT INTO team_members (name, position, bio, image_url, linkedin_url, twitter_url, accent, order_index, status)
                    VALUES (@name, @position, @bio, @image_url, @linkedin_url, @twitter_url, @accent, @order_index, @status);
                END
            END
        `);
        
        console.log("Migration successful!");
        await pool.close();
        process.exit(0);
    } catch (err) {
        console.error("MIGRATION ERROR:", err);
        process.exit(1);
    }
}

migrate();
