'use client';

import { Table, TableContainer, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface LeaderboardEntry {
	username: string;
	score: number;
	record: {
		cooperate: number;
		defect: number;
	};
}

export default function Leaderboard() {
	const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

	useEffect(() => {
		fetch('http://localhost:1025/leaderboard').then(async (res) => {
			const data = await res.json();
			setLeaderboard(data);
		});
	}, []);

	return (
		<TableContainer>
			<Table variant={'simple'}>
				<Thead>
					<Tr>
						<Th>Username</Th>
						<Th>Score</Th>
						<Th>Cooperate</Th>
						<Th>Defect</Th>
					</Tr>
				</Thead>
				<Tbody>
					{leaderboard.map((entry) => (
						<Tr key={entry.username}>
							<Th>{entry.username}</Th>
							<Th>{entry.score}</Th>
							<Th>{entry.record.cooperate}</Th>
							<Th>{entry.record.defect}</Th>
						</Tr>
					))}
				</Tbody>
			</Table>
		</TableContainer>
	);
}
