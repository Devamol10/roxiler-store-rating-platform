const email = 'rahul.deshmukh@gmail.com';
const password = 'password123';
const baseUrl = 'https://roxiler-store-rating-platform.onrender.com/api';

async function test() {
  try {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    console.log("Status:", res.status);
    console.log("Headers:", Object.fromEntries(res.headers.entries()));
    const text = await res.text();
    console.log("Body:", text);
  } catch(e) {
    console.error(e);
  }
}

test();
