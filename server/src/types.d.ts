import 'jsonwebtoken';

declare module 'jsonwebtoken' {
	export interface JwtPayload {
		id: string;
	}
}

declare global {
	declare namespace Express {
		export interface Request {
			user: string;
			token: string;
		}
	}
}
