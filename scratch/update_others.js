const sql = require('mssql');
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^#][^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^"(.*)"$/, '$1');
  }
});

const config = {
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  server: env.DB_SERVER,
  database: env.DB_NAME,
  port: parseInt(env.DB_PORT),
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  requestTimeout: 60000,
};

const getBase64 = (img) => {
  const filePath = path.join('C:\\Users\\pcadmin\\.gemini\\antigravity\\brain\\f474e0b1-db41-47df-b9b1-8d9131458684', img);
  const base64 = fs.readFileSync(filePath, { encoding: 'base64' });
  return `data:image/png;base64,${base64}`;
};

const biometricImg = getBase64('biometric_access_1_1778487861216.png');
const hrisImg = getBase64('hris_implementation_5_1778487879676.png');

async function updateOthers() {
  try {
    let pool = await sql.connect(config);
    
    // IDs for original projects
    const updates = [
      { id: 1002, img: hrisImg },
      { id: 1005, img: biometricImg },
      { id: 1007, img: biometricImg },
      { id: 1008, img: biometricImg },
      { id: 1009, img: biometricImg },
      { id: 1011, img: hrisImg }
    ];

    for (const u of updates) {
      await pool.request()
        .input('id', sql.Int, u.id)
        .input('img', sql.NVarChar, u.img)
        .query('UPDATE projects SET image_url = @img WHERE id = @id');
      console.log(`Updated project ID: ${u.id}`);
    }

    await pool.close();
  } catch (err) {
    console.error(err);
  }
}

updateOthers();
