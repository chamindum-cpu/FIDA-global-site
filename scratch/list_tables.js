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

async function check() {
    try {
        const pool = await sql.connect(config);
        const res = await pool.request().query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES");
        console.log("Tables:", res.recordset.map(r => r.TABLE_NAME));
        await pool.close();
    } catch (err) {
        console.error(err);
    }
}

check();
