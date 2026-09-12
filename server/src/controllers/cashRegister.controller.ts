import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export const getCurrentSession = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await prisma.cashSession.findFirst({
      where: { status: 'OPEN' },
      include: { orders: { include: { items: true } } },
    });
    res.json(session);
  } catch (e) { next(e); }
};

const openSchema = z.object({ openingAmount: z.number().nonnegative() });

export const openSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { openingAmount } = openSchema.parse(req.body);
    const existing = await prisma.cashSession.findFirst({ where: { status: 'OPEN' } });
    if (existing) {
      return res.status(400).json({ error: 'Ya existe una caja abierta' });
    }
    const session = await prisma.cashSession.create({
      data: { openingAmount, status: 'OPEN' },
    });
    res.status(201).json(session);
  } catch (e) { next(e); }
};

const closeSchema = z.object({
  closingAmount: z.number().nonnegative(),
  notes: z.string().optional(),
});

export const closeSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { closingAmount, notes } = closeSchema.parse(req.body);
    const session = await prisma.cashSession.findFirst({ where: { status: 'OPEN' } });
    if (!session) return res.status(400).json({ error: 'No hay caja abierta' });

    const expectedAmount = session.openingAmount + session.totalSales;
    const difference = closingAmount - expectedAmount;

    const closed = await prisma.cashSession.update({
      where: { id: session.id },
      data: {
        closingAmount,
        expectedAmount,
        difference,
        notes,
        status: 'CLOSED',
        closedAt: new Date(),
      },
    });
    res.json(closed);
  } catch (e) { next(e); }
};

export const listSessions = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const sessions = await prisma.cashSession.findMany({
      orderBy: { openedAt: 'desc' },
      take: 50,
    });
    res.json(sessions);
  } catch (e) { next(e); }
};