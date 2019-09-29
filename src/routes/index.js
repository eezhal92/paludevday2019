import { Router } from 'express';
import backoffice from './backoffice';

const router = Router();

router.use('/backoffice', backoffice)

export default router;
