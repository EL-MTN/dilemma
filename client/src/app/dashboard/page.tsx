'use client';

import { Box, Button, Center, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io(`${process.env.NEXT_PUBLIC_HOST_URL}`, {
	autoConnect: false,
});

interface UserProfile {
	username: string;
	record: { cooperate: number; defect: number };
	score: number;
}

export default function Dashboard() {
	const [message, setMessage] = useState('');
	const [choiceSent, setChoiceSent] = useState(false);
	const [opponent, setOpponent] = useState<UserProfile | null>(null);
	const [gameState, setGameState] = useState<'start' | 'queue' | 'none'>('none');
	const [self, setSelf] = useState({
		username: '',
		record: { cooperate: 0, defect: 0 },
		score: 0,
	});

	useEffect(() => {
		if (localStorage.getItem('token') === null) {
			window.location.href = '/auth';
		}
	}, []);

	useEffect(() => {
		fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/auth/me`, {
			headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
		}).then(async (res) => {
			const data = await res.json();
			setSelf(data);
		});
	}, [gameState]);

	useEffect(() => {
		socket.auth = { token: localStorage.getItem('token') };
		socket.connect();

		socket.on('gameStart', (data) => {
			setGameState('start');
			console.log(data.opponent);
			setOpponent(data.opponent);
		});

		socket.on('message', (data) => {
			setMessage(data);
		});

		socket.on('gameEnd', () => {
			setOpponent(null);
			setGameState('none');
			setChoiceSent(false);
		});

		socket.on('result', (data) => {
			alert(`Payoff: ${data}`);
			setOpponent(null);
			setGameState('none');
			setChoiceSent(false);
		});

		socket.on('connect_error', (err) => {
			console.log(err.message);
		});
	}, []);

	function queueUp() {
		setGameState('queue');
		socket.emit('queue');
	}

	function cancelQueue() {
		setGameState('none');
		socket.emit('cancelQueue');
	}

	function sendChoice(choice: 'cooperate' | 'defect') {
		socket.emit('choice', choice);
		setChoiceSent(true);
	}

	return (
		<Flex h="100%" justify={'space-around'}>
			<Center py={6}>
				<Box boxShadow={'2xl'} rounded={'lg'} p={6} textAlign={'center'}>
					<Stack width={'full'} spacing={2}>
						<Heading fontSize={'2xl'}>{self.username}</Heading>
						<Text textAlign={'center'} px={3}>
							Record: {self.record.cooperate} cooperate, {self.record.defect} defect
						</Text>
						<Text textAlign={'center'} px={3}>
							Lifetime Score: {self.score}
						</Text>

						{gameState === 'none' && (
							<Stack direction={'row'}>
								<Button flex={1} fontSize={'sm'} rounded={'full'} onClick={queueUp}>
									Queue
								</Button>
							</Stack>
						)}

						{gameState === 'queue' && (
							<Stack direction={'row'}>
								<Button
									flex={1}
									fontSize={'sm'}
									rounded={'full'}
									onClick={cancelQueue}
								>
									In Queue... Cancel?
								</Button>
							</Stack>
						)}

						{gameState === 'start' && !choiceSent && (
							<Stack direction={'row'}>
								<Button
									flex={1}
									fontSize={'sm'}
									rounded={'full'}
									bg={'green.200'}
									_hover={{ bg: 'green.300' }}
									onClick={() => sendChoice('cooperate')}
								>
									Cooperate
								</Button>
								<Button
									flex={1}
									fontSize={'sm'}
									rounded={'full'}
									bg={'red.200'}
									_hover={{ bg: 'red.300' }}
									onClick={() => sendChoice('defect')}
								>
									Defect
								</Button>
							</Stack>
						)}

						{gameState === 'start' && choiceSent && (
							<Stack direction={'row'}>
								<Button
									flex={1}
									fontSize={'sm'}
									rounded={'full'}
									isLoading
									loadingText={'Awaiting your opponent...'}
								/>
							</Stack>
						)}
					</Stack>
				</Box>
			</Center>
			{opponent && (
				<Center py={6}>
					<Box boxShadow={'2xl'} rounded={'lg'} p={6} textAlign={'center'}>
						<Stack width={'full'} spacing={2}>
							<Heading fontSize={'2xl'}>{opponent.username}</Heading>
							<Text textAlign={'center'} px={3}>
								Record: {opponent.record.cooperate} cooperate,{' '}
								{opponent.record.defect} defect
							</Text>
							<Text textAlign={'center'} px={3}>
								Lifetime Score: {opponent.score}
							</Text>

							<Stack direction={'row'}>
								<Button
									flex={1}
									fontSize={'sm'}
									rounded={'full'}
									isLoading
									loadingText={'Your opponent is selecting...'}
								></Button>
							</Stack>
						</Stack>
					</Box>
				</Center>
			)}
		</Flex>
	);
}
