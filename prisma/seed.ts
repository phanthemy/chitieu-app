import { PrismaClient, TransactionType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create test user
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
    },
  })

  console.log({ user })

  // Create categories
  const salaryCategory = await prisma.category.create({
    data: {
      name: 'Lương',
      type: TransactionType.INCOME,
      userId: user.id
    }
  })

  const foodCategory = await prisma.category.create({
    data: {
      name: 'Ăn uống',
      type: TransactionType.EXPENSE,
      userId: user.id
    }
  })

  // Create transactions
  await prisma.transaction.create({
    data: {
      amount: 20000000,
      note: 'Lương tháng 8',
      date: new Date('2026-08-01'),
      categoryId: salaryCategory.id,
      userId: user.id
    }
  })

  await prisma.transaction.create({
    data: {
      amount: 50000,
      note: 'Phở bò',
      date: new Date('2026-08-02'),
      categoryId: foodCategory.id,
      userId: user.id
    }
  })

  // Create budget
  await prisma.budget.create({
    data: {
      amount: 5000000,
      month: 8,
      year: 2026,
      categoryId: foodCategory.id,
      userId: user.id
    }
  })

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
