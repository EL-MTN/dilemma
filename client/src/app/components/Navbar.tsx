import { Box, Link, Stack } from '@chakra-ui/react';

export default function Navbar() {
	return (
		<Stack direction="row" spacing={4} justify={'space-around'} p={2} bg={'gray.200'}>
			<Box>
				<Link href="/">Home</Link>
			</Box>
			<Box>
				<Link href="/dashboard">Dashboard</Link>
			</Box>
			<Box>
				<Link href="/leaderboard">Leaderboard</Link>
			</Box>
			<Box>
				<Link href="/auth">Auth</Link>
			</Box>
		</Stack>
	);
}
