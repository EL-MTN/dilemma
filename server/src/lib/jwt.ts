import { sign, verify } from 'jsonwebtoken';

const PRIVATE_KEY = 'secret';

export function createToken(payload: any) {
	return sign(payload, PRIVATE_KEY, { expiresIn: '24h' });
}

export function verifyTOken(token: string) {
	return verify(token, PRIVATE_KEY);
}
