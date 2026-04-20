const { getDbConnection, sql } = require('../src/lib/db');

async function checkUsersTable() {
    try {
        const pool = await getDbConnection();
        const result = await pool.request().query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users'");
        console.log("Columns in 'users' table:");
        result.recordset.forEach(row => console.log(`- ${row.COLUMN_NAME}`));
    } catch (err) {
        console.error("Error:", err);
    } finally {
        process.exit();
    }
}

checkUsersTable();
