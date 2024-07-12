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
	const [self, setSelf] = useState({
		username: '',
		record: { cooperate: 0, defect: 0 },
		score: 0,
	});

	useEffect(() => {
		fetch('http://localhost:1025/auth/me', {
			headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
		}).then(async (res) => {
			const data = await res.json();
			setSelf(data);
		});
	}, []);

	useEffect(() => {
		socket.auth = { token: localStorage.getItem('token') };
		socket.connect();

		socket.on('gameStart', (data) => {
			setGameState('start');
			console.log(data.opponent);
			setOpponent(data.opponent.username);
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

		socket.on('connect_error', (err) => {
			console.log(err.message);
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
			Self: {self.username}
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
