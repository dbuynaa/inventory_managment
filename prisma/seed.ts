import { type Category, PrismaClient, type UserRole } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function seedCategory() {
  console.log('🍀 Seed your db successfully!');

  const categoryTest = [
    {
      id: '1',
      name: 'Fruits'
    },
    {
      id: '2',
      name: 'Vegetables'
    }
  ];

  for (const item of categoryTest) {
    const category = await prisma.category.findUnique({
      where: { id: item.id }
    });
    if (category) {
      await prisma.category.update({
        where: { id: category.id },
        data: {
          name: item.name,
          id: item.id,
          updatedAt: new Date()
        }
      });
    } else {
      await prisma.category.create({
        data: {
          name: item.name,
          id: item.id
        }
      });
    }
  }
}

async function seedUser() {
  console.log('🍀 Seed your db successfully!');
  const userTest = [
    {
      name: 'Alice',
      phoneNumber: '88691178',
      role: 'ADMIN',
      password: 'a123456'
    },
    {
      name: 'Bob',
      phoneNumber: '88558855',
      role: 'CUSTOMER',
      password: 'a123456'
    }
  ];

  for (const item of userTest) {
    const { phoneNumber, password, role } = item;
    const passwordHashed = await hash(password, 10);
    const user = await prisma.user.findUnique({ where: { phoneNumber } });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: passwordHashed,
          role: role as UserRole,
          name: item.name
        }
      });
    } else {
      await prisma.user.create({
        data: {
          phoneNumber,
          password: passwordHashed,
          role: role as UserRole,
          name: item.name
        }
      });
    }
  }

  console.log('Seeding completed');
}

async function seed() {
  await seedUser();
  await seedCategory();
}
seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
