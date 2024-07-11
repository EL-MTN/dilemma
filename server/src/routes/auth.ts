import { Router } from 'express';
import * as authController from '../controllers/auth';

export const authRouter = Router();

authRouter.post('/signup', authController.signUp);
authRouter.post('/signin', authController.signIn);
