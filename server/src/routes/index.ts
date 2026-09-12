import { Router } from 'express';
import productsRoutes from './products.routes';
import ordersRoutes from './orders.routes';
import cashRoutes from './cashRegister.routes';

const router = Router();
router.use('/products', productsRoutes);
router.use('/orders', ordersRoutes);
router.use('/cash-register', cashRoutes);

export default router;