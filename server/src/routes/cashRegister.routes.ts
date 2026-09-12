import { Router } from 'express';
import * as ctrl from '../controllers/cashRegister.controller';

const router = Router();
router.get('/current', ctrl.getCurrentSession);
router.get('/', ctrl.listSessions);
router.post('/open', ctrl.openSession);
router.post('/close', ctrl.closeSession);

export default router;