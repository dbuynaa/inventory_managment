import { PrismaClient, type UserRole } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
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
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
