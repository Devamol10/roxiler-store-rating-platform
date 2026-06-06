require('dotenv').config();
const authService = require('./src/services/auth.service');

async function testLogin() {
  try {
    const res = await authService.login('rahul.deshmukh@gmail.com', 'password123');
    console.log("Success!", res.user);
  } catch (err) {
    console.error("Failed:", err.message);
  }
}

testLogin();
