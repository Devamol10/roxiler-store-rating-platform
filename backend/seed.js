const prisma = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    const password = await bcrypt.hash('password123', 10);
    
    // Clear old data safely (cascade will handle relations if set, but let's be explicit)
    await prisma.rating.deleteMany({});
    await prisma.store.deleteMany({});
    await prisma.user.deleteMany({});

    // 1. Create Core Bypass Users (Admin, Store, User)
    const admin = await prisma.user.create({
      data: { name: 'Amol Budhwant', email: 'amol.budhwant@roxiler.com', password, role: 'ADMIN', address: 'Shivajinagar, Pune' },
    });

    const storeOwnerBypass = await prisma.user.create({
      data: { name: 'Kasem Irani', email: 'manager@cafegoodluck.in', password, role: 'STORE_OWNER', address: 'FC Road, Pune' },
    });

    const userBypass = await prisma.user.create({
      data: { name: 'Rahul Deshmukh', email: 'rahul.deshmukh@gmail.com', password, role: 'USER', address: 'Kothrud, Pune' },
    });

    // 2. Create 3 More Store Owners
    const owners = await Promise.all([
      prisma.user.create({ data: { name: 'Irani Bros', email: 'irani.brothers@pune.in', password, role: 'STORE_OWNER', address: 'Camp, Pune' } }),
      prisma.user.create({ data: { name: 'Chitale Mgmt', email: 'chitale@pune.in', password, role: 'STORE_OWNER', address: 'Deccan, Pune' } }),
      prisma.user.create({ data: { name: 'Sujata Mgmt', email: 'sujata@mastani.in', password, role: 'STORE_OWNER', address: 'Sadashiv Peth, Pune' } }),
    ]);

    const allOwners = [storeOwnerBypass, ...owners];

    // 3. Create 19 More Normal Users (making it 20 total users with userBypass)
    const userNames = [
      'Snehal Patil', 'Amit Joshi', 'Priya Sharma', 'Kunal Kadam',
      'Neha Awate', 'Vikram Singh', 'Pooja Kulkarni', 'Saurabh Wagh', 'Aarti Kale',
      'Ramesh Jadhav', 'Kavita Mane', 'Rohan More', 'Swati Pawar', 'Ganesh Shinde',
      'Meera Gawali', 'Sagar Thorat', 'Anjali Bhat', 'Nikhil Bhosale'
    ];
    
    const locations = ['Baner', 'Hinjewadi', 'Viman Nagar', 'Wakad', 'Hadapsar', 'Katraj', 'Aundh', 'Magarpatta', 'Kothrud', 'Camp'];

    const moreUsers = await Promise.all(userNames.map((name, index) => {
      const email = `${name.toLowerCase().replace(' ', '.')}@gmail.com`;
      const address = `${locations[index % locations.length]}, Pune`;
      return prisma.user.create({
        data: { name, email, password, role: 'USER', address }
      });
    }));

    const allUsers = [userBypass, ...moreUsers];

    // 4. Create 10 Stores
    const storeData = [
      { name: 'Cafe Goodluck', address: 'FC Road, Deccan Gymkhana, Pune', owner: storeOwnerBypass },
      { name: 'Vaishali', address: 'FC Road, Pune', owner: storeOwnerBypass },
      { name: 'Vohuman Cafe', address: 'Dhole Patil Road, Pune', owner: owners[0] },
      { name: 'German Bakery', address: 'North Main Road, Koregaon Park, Pune', owner: owners[0] },
      { name: 'Chitale Bandhu Mithaiwale', address: 'Deccan Gymkhana, Pune', owner: owners[1] },
      { name: 'Chitale Express', address: 'Kothrud, Pune', owner: owners[1] },
      { name: 'Sujata Mastani', address: 'Sadashiv Peth, Pune', owner: owners[2] },
      { name: 'SP Biryani House', address: 'Sadashiv Peth, Pune', owner: owners[2] },
      { name: 'Kayani Bakery', address: 'Camp, Pune', owner: owners[0] },
      { name: 'Blue Nile', address: 'Camp, Pune', owner: owners[0] },
    ];

    const createdStores = await Promise.all(storeData.map(store => 
      prisma.store.create({
        data: {
          name: store.name,
          address: store.address,
          ownerId: store.owner.id
        }
      })
    ));

    // 5. Create Extensive Ratings (approx 4-8 ratings per store)
    // We will ensure every store gets at least 5 ratings from random users.
    const ratingsToCreate = [];
    
    for (const store of createdStores) {
      // Pick 5 to 8 random users to rate this store
      const numRatings = Math.floor(Math.random() * 4) + 5; 
      
      // Shuffle users
      const shuffledUsers = [...allUsers].sort(() => 0.5 - Math.random());
      const selectedUsers = shuffledUsers.slice(0, numRatings);
      
      for (const user of selectedUsers) {
        // Random rating between 3 and 5 (with a higher chance of 4 and 5)
        const ratingValue = Math.floor(Math.random() * 3) + 3; 
        ratingsToCreate.push({
          userId: user.id,
          storeId: store.id,
          rating: ratingValue
        });
      }
    }

    // Create all ratings
    for (const r of ratingsToCreate) {
      await prisma.rating.create({
        data: r
      });
    }

    console.log(`Seed completed successfully!`);
    console.log(`Created 1 Admin, 4 Store Owners, 20 Normal Users`);
    console.log(`Created 10 Stores`);
    console.log(`Created ${ratingsToCreate.length} Ratings`);

  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    process.exit(0);
  }
}

seed();
