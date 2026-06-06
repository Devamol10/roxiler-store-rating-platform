require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function debug() {
  try {
    // Get hashes for the 3 bypass users
    const emails = ['amol.budhwant@roxiler.com', 'manager@cafegoodluck.in', 'rahul.deshmukh@gmail.com'];
    
    for (const email of emails) {
      const res = await pool.query('SELECT password FROM "User" WHERE email = $1', [email]);
      if (res.rows.length > 0) {
        const hash = res.rows[0].password;
        const match = await bcrypt.compare('password123', hash);
        console.log(`${email}: hash_length=${hash.length}, match=${match}, hash=${hash.substring(0, 30)}...`);
      } else {
        console.log(`${email}: NOT FOUND`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

debug();
