import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { createOrder, getSalesSummary } from '../services/order.service';
import { prisma } from '../lib/prisma';

const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
  })).min(1),
  paymentMethod: z.enum(['EFECTIVO', 'TARJETA', 'TRANSFERENCIA']),
  amountPaid: z.number().nonnegative(),
});

export const registerOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createOrderSchema.parse(req.body);
    const order = await createOrder(data);
    res.status(201).json(order);
  } catch (e) { next(e); }
};

export const listOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { from, to } = req.query as { from?: string; to?: string };
    const summary = await getSalesSummary(from, to);
    res.json(summary);
  } catch (e) { next(e); }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: true },
    });
    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
    res.json(order);
  } catch (e) { next(e); }
};