import { Router } from 'express';
import * as authController from '../controllers/auth';
import { parseToken } from '../middlewares/parseToken';

export const authRouter = Router();

authRouter.post('/signup', authController.signUp);
authRouter.post('/signin', authController.signIn);

authRouter.use(parseToken);
authRouter.get('/me', authController.me);
