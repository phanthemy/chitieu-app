import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticateToken);

router.get('/summary', async (req: AuthRequest, res: Response) => {
  try {
    const { month, year } = req.query;
    
    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required' });
    }

    const m = parseInt(month as string);
    const y = parseInt(year as string);
    
    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 0, 23, 59, 59, 999);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: { category: true }
    });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t: any) => {
      if (t.category.type === 'INCOME') {
        totalIncome += t.amount;
      } else if (t.category.type === 'EXPENSE') {
        totalExpense += t.amount;
      }
    });

    res.json({
      month: m,
      year: y,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionsCount: transactions.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
