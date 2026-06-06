const prisma = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    const password = await bcrypt.hash('password123', 10);
    
    // Admin
    await prisma.user.upsert({
      where: { email: 'admin@demo.com' },
      update: { password },
      create: { name: 'Admin Demo', email: 'admin@demo.com', password, role: 'ADMIN', address: 'Admin Office' },
    });

    // Store Owner
    await prisma.user.upsert({
      where: { email: 'store@demo.com' },
      update: { password },
      create: { name: 'Store Owner Demo', email: 'store@demo.com', password, role: 'STORE_OWNER', address: 'Store Location' },
    });

    // Normal User
    await prisma.user.upsert({
      where: { email: 'user@demo.com' },
      update: { password },
      create: { name: 'Normal User Demo', email: 'user@demo.com', password, role: 'USER', address: 'User Address' },
    });

    console.log('Seed completed successfully');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    process.exit(0);
  }
}

seed();
