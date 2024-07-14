import { Router } from 'express';
import { authRouter } from './auth';
import { globalRouter } from './global';

export const router = Router();

router.use(globalRouter);
router.use('/auth', authRouter);
