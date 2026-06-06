require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function fix() {
  try {
    const newHash = await bcrypt.hash('password123', 10);
    const res = await pool.query('UPDATE "User" SET password = $1', [newHash]);
    console.log(`Updated ${res.rowCount} users with new password123 hash.`);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

fix();
