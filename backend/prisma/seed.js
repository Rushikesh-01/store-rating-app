const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'System Administrator User',
      email: 'admin@example.com',
      password: adminPassword,
      address: '123 Admin Street, System City, 10001',
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  const ownerPassword = await bcrypt.hash('Owner@123', 12);
  const owner = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      name: 'Sample Store Owner Account',
      email: 'owner@example.com',
      password: ownerPassword,
      address: '456 Owner Avenue, Commerce City, 20002',
      role: 'STORE_OWNER',
    },
  });
  console.log(`✅ Store Owner created: ${owner.email}`);

  const store = await prisma.store.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'The Grand Sample Store',
      email: 'store@example.com',
      address: '789 Store Boulevard, Market City, 30003',
      ownerId: owner.id,
    },
  });
  console.log(`✅ Sample store created: ${store.name}`);

  const userPassword = await bcrypt.hash('User@1234', 12);
  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Regular Sample User Account',
      email: 'user@example.com',
      password: userPassword,
      address: '321 User Lane, Resident City, 40004',
      role: 'USER',
    },
  });
  console.log(`✅ User created: user@example.com`);

  console.log('\n🎉 Database seeded!');
  console.log('   Admin:       admin@example.com / Admin@123');
  console.log('   Store Owner: owner@example.com / Owner@123');
  console.log('   User:        user@example.com  / User@1234');
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
