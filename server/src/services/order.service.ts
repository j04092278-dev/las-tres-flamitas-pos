import { prisma } from '../lib/prisma';

interface OrderItemInput {
  productId: string;
  quantity: number;
}

interface CreateOrderInput {
  items: OrderItemInput[];
  paymentMethod: string;
  amountPaid: number;
}

export const createOrder = async (input: CreateOrderInput) => {
  const { items, paymentMethod, amountPaid } = input;

  if (!items || items.length === 0) {
    const err: any = new Error('El pedido debe tener al menos un producto');
    err.status = 400;
    throw err;
  }

  return await prisma.$transaction(async (tx) => {
    let subtotal = 0;
    const enrichedItems: any[] = [];

    for (const item of items) {
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        const err: any = new Error(`Producto no encontrado: ${item.productId}`);
        err.status = 404;
        throw err;
      }
      if (product.stock < item.quantity) {
        const err: any = new Error(
          `Stock insuficiente para "${product.name}". Disponible: ${product.stock}`
        );
        err.status = 400;
        throw err;
      }
      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;
      enrichedItems.push({ product, quantity: item.quantity, subtotal: itemSubtotal });
    }

    const total = subtotal;
    if (amountPaid < total) {
      const err: any = new Error('El monto pagado es insuficiente');
      err.status = 400;
      throw err;
    }

    const openSession = await tx.cashSession.findFirst({
      where: { status: 'OPEN' },
    });

    const order = await tx.order.create({
      data: {
        subtotal,
        total,
        paymentMethod,
        amountPaid,
        change: amountPaid - total,
        cashSessionId: openSession?.id,
        items: {
          create: enrichedItems.map((it) => ({
            productId: it.product.id,
            productName: it.product.name,
            quantity: it.quantity,
            price: it.product.price,
            subtotal: it.subtotal,
          })),
        },
      },
      include: { items: true },
    });

    for (const it of enrichedItems) {
      await tx.product.update({
        where: { id: it.product.id },
        data: { stock: { decrement: it.quantity } },
      });
    }

    if (openSession) {
      await tx.cashSession.update({
        where: { id: openSession.id },
        data: { totalSales: { increment: total } },
      });
    }

    return order;
  });
};

export const getSalesSummary = async (from?: string, to?: string) => {
  const where: any = {};
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      where.createdAt.lte = toDate;
    }
  }

  const orders = await prisma.order.findMany({
    where,
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const totalItems = orders.reduce(
    (s, o) => s + o.items.reduce((si, i) => si + i.quantity, 0),
    0
  );

  const productMap = new Map<string, { name: string; qty: number; revenue: number }>();
  orders.forEach((o) => {
    o.items.forEach((it) => {
      const cur = productMap.get(it.productId) || {
        name: it.productName,
        qty: 0,
        revenue: 0,
      };
      cur.qty += it.quantity;
      cur.revenue += it.subtotal;
      productMap.set(it.productId, cur);
    });
  });

  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 10);

  return { orders, totalRevenue, totalOrders, totalItems, topProducts };
};