import { Router } from 'express';
import { checkIn, checkOut, getReport } from '../controllers/attendance.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticateToken);

router.post('/check-in', checkIn);
router.post('/check-out', checkOut);
router.get('/report', getReport);

export default router;