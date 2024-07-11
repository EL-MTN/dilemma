import { JwtPayload, verify } from 'jsonwebtoken';
import { Socket } from 'socket.io';

export const connectedIds = new Set<string>();

export function socketAuth(socket: Socket, next: (err?: any) => void) {
	if (socket.handshake.auth && socket.handshake.auth.token) {
		const payload = verify(socket.handshake.auth.token, 'secret');
		const userId = (payload as JwtPayload).id;

		socket.data.user = userId;

		if (connectedIds.has(userId)) {
			next(new Error('Already connected'));
			return;
		}

		connectedIds.add(userId);

		next();
	} else {
		next(new Error('Authentication error'));
	}
}
