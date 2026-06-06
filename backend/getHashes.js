require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function getHashes() {
  try {
    const res = await pool.query('SELECT email, password FROM "User"');
    res.rows.forEach(r => console.log(`${r.email}: ${r.password}`));
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

getHashes();
