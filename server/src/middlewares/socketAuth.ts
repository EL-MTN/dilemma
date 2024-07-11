import { JwtPayload, verify } from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { User } from '../models/User';

export const connectedIds = new Set<string>();

export async function socketAuth(socket: Socket, next: (err?: any) => void) {
	if (socket.handshake.auth && socket.handshake.auth.token) {
		const payload = verify(socket.handshake.auth.token, 'secret');
		const userId = (payload as JwtPayload).id;

		if (!(await User.findById(userId))) next(new Error('User not found'));

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
