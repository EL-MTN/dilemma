import { Router } from 'express';
import * as globalController from '../controllers/global';

export const globalRouter = Router();

globalRouter.get('/leaderboard', globalController.getTopUsers);
