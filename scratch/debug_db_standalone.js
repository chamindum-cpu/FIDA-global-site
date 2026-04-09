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

async function debug() {
    try {
        const pool = await sql.connect(config);
        console.log("Connected to DB");
        
        console.log("\n--- TEAM_MEMBERS COLUMNS ---");
        const schema = await pool.request().query("SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'team_members'");
        console.log(schema.recordset);
        
        console.log("\n--- sp_UpsertTeamMember PARAMS ---");
        const params = await pool.request().query("SELECT PARAMETER_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.PARAMETERS WHERE SPECIFIC_NAME = 'sp_UpsertTeamMember'");
        console.log(params.recordset);
        
        await pool.close();
        process.exit(0);
    } catch (err) {
        console.error("DEBUG ERROR:", err);
        process.exit(1);
    }
}

debug();
