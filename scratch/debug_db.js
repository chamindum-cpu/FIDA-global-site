const { getDbConnection, sql } = require('../src/lib/db');

async function debug() {
    try {
        const pool = await getDbConnection();
        console.log("Connected to DB");
        
        console.log("\n--- TABLE SCHEMA ---");
        const schema = await pool.request().query("SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'team_members'");
        console.log(schema.recordset);
        
        console.log("\n--- STORED PROCEDURE PARAMS ---");
        const params = await pool.request().query("SELECT PARAMETER_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.PARAMETERS WHERE SPECIFIC_NAME = 'sp_UpsertTeamMember'");
        console.log(params.recordset);
        
        process.exit(0);
    } catch (err) {
        console.error("DEBUG ERROR:", err);
        process.exit(1);
    }
}

debug();
