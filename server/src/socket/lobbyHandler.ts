import { Socket } from 'socket.io';
import { generateId } from '../lib/nanoid';
import { connectedIds } from '../middlewares/socketAuth';
import { User } from '../models/User';
import { GameRecord } from '../models/GameRecord';

const queue: Socket[] = [];
const games = new Map<string, { socket: Socket; choice: '' | 'cooperate' | 'defect' }[]>();

export function registerLobbyHandlers(socket: Socket) {
	const onQueue = async () => {
		if (queue.indexOf(socket) !== -1) return;

		queue.push(socket);

		if (queue.length === 2) {
			const roomId = generateId();
			queue[0].join(roomId);
			queue[1].join(roomId);

			const opponent1 = await User.findById(queue[0].data.user).select('-password -_id');
			const opponent2 = await User.findById(queue[1].data.user).select('-password -_id');

			queue[0].emit('gameStart', { opponent: opponent2 });
			queue[1].emit('gameStart', { opponent: opponent1 });

			games.set(roomId, [
				{ socket: queue[0], choice: '' },
				{ socket: queue[1], choice: '' },
			]);

			queue.shift();
			queue.shift();
		}
	};

	const cancelQueue = async () => {
		const index = queue.indexOf(socket);
		if (index !== -1) {
			queue.splice(index, 1);
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

		user.record[choice] += 1;
		await user.save();

		// Payoff table
		// Both cooperate: 10
		// Both defect: -5
		// Cooperator: -10, Defector: 20

		if (game.every((p) => p.choice !== '')) {
			const [player1, player2] = game;
			const user1 = await User.findById(player1.socket.data.user);
			const user2 = await User.findById(player2.socket.data.user);

			if (!user1 || !user2) return;

			if (player1.choice === 'cooperate' && player2.choice === 'cooperate') {
				player1.socket.emit('result', 10);
				player2.socket.emit('result', 10);

				user1.score += 10;
				user2.score += 10;
			} else if (player1.choice === 'defect' && player2.choice === 'defect') {
				player1.socket.emit('result', -5);
				player2.socket.emit('result', -5);

				user1.score -= 5;
				user2.score -= 5;
			} else if (player1.choice === 'cooperate' && player2.choice === 'defect') {
				player1.socket.emit('result', -10);
				player2.socket.emit('result', 20);

				user1.score -= 10;
				user2.score += 20;
			} else if (player1.choice === 'defect' && player2.choice === 'cooperate') {
				player1.socket.emit('result', 20);
				player2.socket.emit('result', -10);

				user1.score += 20;
				user2.score -= 10;
			}

			await user1.save();
			await user2.save();

			player1.socket.leave(room);
			player2.socket.leave(room);

			games.delete(room);

			await new GameRecord({
				player1: {
					record: user1.record,
					score: user1.score,
					choice: player1.choice,
				},
				player2: {
					record: user2.record,
					score: user2.score,
					choice: player2.choice,
				},
			}).save();
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
	socket.on('cancelQueue', cancelQueue);
	socket.on('choice', onChoice);
	socket.on('disconnecting', onDisconnecting);
	socket.on('disconnect', onDisconnect);
}
