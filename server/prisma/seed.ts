import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const MENU = [
  {
    name: 'Hamburguesas',
    products: [
      { name: 'RES SENCILLA', description: 'Queso amarillo y salchicha', price: 50, stock: 50 },
      { name: 'POLLO', description: 'Jamón, queso Oaxaca y queso amarillo', price: 60, stock: 50 },
      { name: 'RES ARTESANAL', description: 'Jamón, queso Oaxaca, tocino y salchicha', price: 65, stock: 50 },
      { name: 'SIRLOIN', description: 'Jamón, queso Oaxaca, tocino y salchicha', price: 75, stock: 50 },
      { name: 'CHORIQUESO', description: 'Sirloin con chorizo, jamón, queso Oaxaca y salchicha', price: 95, stock: 30 },
      { name: 'AROS BBQ', description: 'Sirloin con queso amarillo, tocino, aros de cebolla y BBQ', price: 95, stock: 30 },
      { name: 'DOBLES RES SENCILLA', description: 'Doble carne, doble jamón, doble queso y salchicha', price: 70, stock: 25 },
      { name: 'DOBLES POLLO', description: 'Doble pollo, doble jamón, doble queso Oaxaca', price: 80, stock: 25 },
      { name: 'DOBLES RES ARTESANAL', description: 'Doble artesanal con todo', price: 95, stock: 25 },
      { name: 'DOBLES SIRLOIN', description: 'Doble sirloin con todo', price: 110, stock: 20 },
    ],
  },
  {
    name: 'Hot Dogs',
    products: [
      { name: 'HOT DOG SENCILLO', description: 'Salchicha y tocino', price: 20, stock: 60 },
      { name: 'HOT DOG ESPECIAL', description: 'Salchicha, queso Oaxaca y jamón', price: 30, stock: 60 },
      { name: 'HOT DOG JUMBO', description: 'Salchicha, queso Oaxaca, tocino y jamón', price: 50, stock: 40 },
      { name: 'HOT DOG JUMBO CHORIQUESO', description: 'Salchicha, chorizo, queso Oaxaca, tocino y jamón', price: 70, stock: 30 },
    ],
  },
  {
    name: 'Extras',
    products: [
      { name: 'PAPAS', description: 'Papas fritas con salchicha y condimentos', price: 40, stock: 40 },
      { name: 'SALCHIPULPOS', description: 'Salchichas fritas con condimentos', price: 40, stock: 40 },
      { name: 'AROS DE CEBOLLA', description: 'Crujientes y doraditos', price: 40, stock: 40 },
    ],
  },
  {
    name: 'Bebidas',
    products: [
      { name: 'COCA COLA 600ML', description: 'Refresco 600ml', price: 27, stock: 100 },
      { name: 'REFRESCO SIN AZÚCAR COCO', description: 'Sabor coco', price: 25, stock: 50 },
      { name: 'REFRESCO SIN AZÚCAR PIÑA', description: 'Sabor piña', price: 25, stock: 50 },
      { name: 'REFRESCO SIN AZÚCAR NARANJA', description: 'Sabor naranja', price: 25, stock: 50 },
    ],
  },
];

async function main() {
  console.log('🌱 Iniciando seed...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.cashSession.deleteMany();

  for (const cat of MENU) {
    const category = await prisma.category.create({ data: { name: cat.name } });
    for (const p of cat.products) {
      await prisma.product.create({ data: { ...p, categoryId: category.id } });
    }
    console.log(`   ✅ ${cat.name} (${cat.products.length} productos)`);
  }
  console.log('✅ Seed completado');
}

main()
  .catch((e) => { console.error('❌ Error en seed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());