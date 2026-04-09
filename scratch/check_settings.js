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
        const res = await pool.request().query("SELECT * FROM site_settings");
        console.log("Settings in DB:", res.recordset);
        await pool.close();
    } catch (err) {
        console.error(err);
    }
}

check();
