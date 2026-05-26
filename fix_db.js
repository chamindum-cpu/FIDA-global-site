const sql = require('mssql'); 
const config = { 
  user: 'MobAppTUser', 
  password: 'Mgjd%7856(#3', 
  server: '34.63.59.161', 
  database: 'FIDAGLOBAL_COMPANYWEB', 
  port: 35566, 
  options: { encrypt: true, trustServerCertificate: true }, 
  requestTimeout: 30000 
}; 

sql.connect(config)
  .then(pool => pool.request().query("UPDATE services SET image_url = NULL WHERE image_url LIKE 'data:image%'"))
  .then(r => { 
    console.log('Rows affected:', r.rowsAffected); 
    process.exit(0); 
  })
  .catch(e => { 
    console.error('Error', e); 
    process.exit(1); 
  });
