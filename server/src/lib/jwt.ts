import { sign } from 'jsonwebtoken';

const PRIVATE_KEY = 'secret';

export function createToken(payload: any) {
	return sign(payload, PRIVATE_KEY, { expiresIn: '24h' });
}
