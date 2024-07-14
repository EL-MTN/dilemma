import { Request, Response } from 'express';
import { User } from '../models/User';

export const getTopUsers = async (req: Request, res: Response) => {
	const users = await User.find().sort({ score: -1 }).limit(10).select('username record score -_id');

	res.status(200).json(users);
};
