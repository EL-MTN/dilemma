import {
	Center,
	Box,
	useColorModeValue,
	Heading,
	Stack,
	Button,
	Text,
	ButtonGroup,
} from '@chakra-ui/react';

export interface UserProfile {
	username: string;
	record: { cooperate: number; defect: number };
	score: number;
}

export function UserProfile({
	username,
	record,
	score,
	gameState,
}: UserProfile & { gameState: 'start' | 'queue' | 'none' }) {
	return (
		<Center py={6}>
			<Box
				maxW={'320px'}
				w={'full'}
				bg={useColorModeValue('white', 'gray.900')}
				boxShadow={'2xl'}
				rounded={'lg'}
				p={6}
				textAlign={'center'}
			>
				<Heading fontSize={'2xl'} fontFamily={'body'}>
					{username}
				</Heading>
				<Text textAlign={'center'} color={useColorModeValue('gray.700', 'gray.400')} px={3}>
					Record: {record.cooperate} cooperate, {record.defect} defect
				</Text>
				<Text textAlign={'center'} color={useColorModeValue('gray.700', 'gray.400')} px={3}>
					Lifetime Score: {score}
				</Text>

				<Stack mt={8} direction={'row'} spacing={4}>
					{gameState === 'none' ? (
						<Button
							flex={1}
							fontSize={'sm'}
							rounded={'full'}
							_focus={{
								bg: 'gray.200',
							}}
						>
							Queue
						</Button>
					) : (
						<div>
							<Button flex={1} fontSize={'sm'} rounded={'full'} bg={'green.200'}>
								Cooperate
							</Button>
							<Button flex={1} fontSize={'sm'} rounded={'full'} color={'red.200'}>
								Defect
							</Button>
						</div>
					)}
				</Stack>
			</Box>
		</Center>
	);
}
