const prisma = require('../src/config/db');
const bcrypt = require('bcryptjs');

async function main() {
  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@roxiler.com' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@roxiler.com',
      password: hashedPassword,
      address: 'Roxiler Headquarters',
      role: 'ADMIN',
    },
  });

  console.log('Admin user seeded:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
