import { Socket } from 'socket.io';
import { generateId } from '../lib/nanoid';
import { connectedIds } from '../middlewares/socketAuth';
import { User } from '../models/User';

const queue: Socket[] = [];
const games = new Map<string, { socket: Socket; choice: '' | 'cooperate' | 'defect' }[]>();

export function registerLobbyHandlers(socket: Socket) {
	const onQueue = () => {
		queue.push(socket);

		console.log(socket.data);

		if (queue.length === 2) {
			const roomId = generateId();
			queue[0].join(roomId);
			queue[1].join(roomId);

			queue[0].emit('gameStart', { opponent: queue[1].id });
			queue[1].emit('gameStart', { opponent: queue[0].id });

			games.set(roomId, [
				{ socket: queue[0], choice: '' },
				{ socket: queue[1], choice: '' },
			]);

			queue.shift();
			queue.shift();
		}
	};

	const onChoice = async (choice: 'cooperate' | 'defect') => {
		const room = Array.from(socket.rooms)[1];
		const game = games.get(room);

		if (!game) {
			return;
		}

		const player = game.find((p) => p.socket === socket);
		const user = await User.findById(socket.data.user);

		if (!player || !user) {
			return;
		}

		player.choice = choice;

		// Payoff table
		// Both cooperate: 10
		// Both defect: -5
		// Cooperator: -10, Defector: 20

		if (game.every((p) => p.choice !== '')) {
			const [player1, player2] = game;

			if (player1.choice === 'cooperate' && player2.choice === 'cooperate') {
				player1.socket.emit('result', 10);
				player2.socket.emit('result', 10);
			}

			if (player1.choice === 'defect' && player2.choice === 'defect') {
				player1.socket.emit('result', -5);
				player2.socket.emit('result', -5);
			}

			if (player1.choice === 'cooperate' && player2.choice === 'defect') {
				player1.socket.emit('result', -10);
				player2.socket.emit('result', 20);
			}

			if (player1.choice === 'defect' && player2.choice === 'cooperate') {
				player1.socket.emit('result', 20);
				player2.socket.emit('result', -10);
			}
		}
	};

	const onDisconnecting = () => {
		socket.rooms.forEach((room) => {
			socket.to(room).emit('gameEnd');
			games.delete(room);
		});
	};

	const onDisconnect = () => {
		connectedIds.delete(socket.data.user);

		const index = queue.indexOf(socket);
		if (index !== -1) {
			queue.splice(index, 1);
		}
	};

	socket.on('queue', onQueue);
	socket.on('choice', onChoice);
	socket.on('disconnecting', onDisconnecting);
	socket.on('disconnect', onDisconnect);
}
