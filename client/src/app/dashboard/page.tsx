'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:1025', {
	autoConnect: false,
});

export default function Dashboard() {
	const [message, setMessage] = useState('');
	const [opponent, setOpponent] = useState('');
	const [gameState, setGameState] = useState<'start' | 'queue' | 'none'>('none');

	useEffect(() => {
		socket.auth = { token: localStorage.getItem('token') };
		socket.connect();

		socket.on('gameStart', (data) => {
			setGameState('start');
			setOpponent(data.opponent);
		});

		socket.on('message', (data) => {
			setMessage(data);
		});

		socket.on('gameEnd', () => {
			setOpponent('');
			setGameState('none');
		});

		socket.on('result', (data) => {
			alert(`Payoff: ${data}`);
		});
	}, []);

	function queueUp() {
		setGameState('queue');
		socket.emit('queue');
	}

	function sendChoice(choice: 'cooperate' | 'defect') {
		socket.emit('choice', choice);
	}

	return (
		<div>
			{message}
			<br />
			Self: {socket.id}
			<br />
			Opponent: {opponent}
			<br />
			{gameState == 'none' && (
				<button
					onClick={() => {
						queueUp();
					}}
				>
					Queue Up
				</button>
			)}
			{gameState == 'queue' && <div>Queued Up</div>}
			{gameState == 'start' && (
				<div>
					<h1>Game Started</h1>
					<button
						onClick={() => {
							sendChoice('cooperate');
						}}
					>
						Cooperate
					</button>
					<button
						onClick={() => {
							sendChoice('defect');
						}}
					>
						Defect
					</button>
				</div>
			)}
		</div>
	);
}
