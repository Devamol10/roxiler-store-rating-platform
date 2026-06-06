const email = 'amol.budhwant@roxiler.com';
const password = 'password123';
const baseUrl = 'https://roxiler-store-rating-platform.onrender.com/api';

async function getUsers() {
  try {
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    // Get the set-cookie header
    const cookieHeader = loginRes.headers.get('set-cookie');
    
    const usersRes = await fetch(`${baseUrl}/admin/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader
      }
    });
    
    const usersData = await usersRes.json();
    console.log("Total users from API:", usersData.data?.length);
    const rahul = usersData.data?.find(u => u.email.includes('rahul'));
    console.log("Rahul from API:", rahul);
    
  } catch(e) {
    console.error(e);
  }
}

getUsers();
