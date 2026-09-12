import { Router } from 'express';
import * as ctrl from '../controllers/orders.controller';

const router = Router();
router.post('/', ctrl.registerOrder);
router.get('/', ctrl.listOrders);
router.get('/:id', ctrl.getOrderById);

export default router;