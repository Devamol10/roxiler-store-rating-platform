require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function checkUsers() {
  try {
    const res = await pool.query('SELECT email FROM "User" WHERE role = \'USER\'');
    console.log(res.rows.map(r => r.email));
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

checkUsers();
