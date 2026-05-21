import { PrismaClient } from '@prisma/client';
import { categories, menuItems } from '../data/menu';
import { tables } from '../data/tables';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Seed Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@drivethru.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@drivethru.com',
      password: 'admin123', // In a real app, hash this!
      role: 'admin',
    },
  });
  console.log('Seeded admin user:', admin.email);

  // 2. Seed Categories
  for (const category of categories) {
    await prisma.menu_category.upsert({
      where: { id: category.id },
      update: {
        name: category.name,
        icon: category.icon,
      },
      create: {
        id: category.id,
        name: category.name,
        icon: category.icon,
      },
    });
  }
  console.log('Seeded categories:', categories.length);

  // 3. Seed Menu Items
  for (const item of menuItems) {
    await prisma.menu_item.upsert({
      where: { id: item.id.toString() },
      update: {
        name: item.name,
        price: item.price,
        image: item.image,
        restaurant: item.restaurant,
        categoryId: item.categoryId,
        categoryName: item.category,
      },
      create: {
        id: item.id.toString(),
        name: item.name,
        price: item.price,
        image: item.image,
        restaurant: item.restaurant,
        categoryId: item.categoryId,
        categoryName: item.category,
      },
    });
  }
  console.log('Seeded menu items:', menuItems.length);

  // 4. Seed Tables
  for (const table of tables) {
    await prisma.table.upsert({
      where: { number: table.number },
      update: {
        seats: table.seats,
        type: table.type,
        status: table.status,
      },
      create: {
        id: table.id,
        number: table.number,
        seats: table.seats,
        type: table.type,
        status: table.status,
      },
    });
  }
  console.log('Seeded tables:', tables.length);

  // 5. Seed Settings
  await prisma.settings.upsert({
    where: { id: 'restaurant_config' },
    update: {},
    create: {
      id: 'restaurant_config',
      isOpen: true,
      mode: 'auto',
      openTime: '09:00',
      closeTime: '22:00',
    },
  });
  console.log('Seeded settings');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
