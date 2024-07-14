import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../lib/jwt';
import { JwtPayload } from 'jsonwebtoken';

export const parseToken = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers['authorization'];

	if (!token) {
		return res.status(401).json({
			message: 'Unauthorized',
		});
	}

	req.token = token.split(' ')[1];
	try {
		const payload = verifyToken(req.token);

		req.user = (payload as JwtPayload).id;

		next();
	} catch (e) {
		return res.json('Invalid token');
	}
};
