'use client';

import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Link,
	Stack,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import z from 'zod';

export default function Auth() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [signUpOrSignIn, setSignUpOrSignIn] = useState('signup');
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const schema = z.object({
		username: z.string().min(1),
		password: z.string().min(5),
	});

	async function submit() {
		setLoading(true);

		const result = schema.safeParse({
			username,
			password,
		});
		if (result.error) {
			alert('Invalid input');
			setLoading(false);
			return;
		}

		try {
			const res = await fetch(`http://${process.env.NEXT_PUBLIC_HOST_URL}/auth/${signUpOrSignIn}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username,
					password,
				}),
			});

			const data = await res.json();

			if (data.token) {
				localStorage.setItem('token', data.token);
				router.push('/dashboard');
			} else {
				alert(data.message);
				setLoading(false);
			}
		} catch (e) {
			alert('Credentials failed');
			setLoading(false);
		}
	}

	return (
		<Flex
			minH={'100vh'}
			align={'center'}
			justify={'center'}
			bg={useColorModeValue('gray.50', 'gray.800')}
		>
			<Stack spacing={8} py={12} px={6} w={'lg'}>
				<Stack align={'center'}>
					<Heading fontSize={'4xl'}>
						{signUpOrSignIn === 'signup' ? 'Sign up ' : 'Sign in'}
					</Heading>
				</Stack>
				<Box
					rounded={'lg'}
					bg={useColorModeValue('white', 'gray.700')}
					boxShadow={'lg'}
					p={8}
				>
					<Stack spacing={5}>
						<FormControl id="username" isRequired>
							<FormLabel>Username</FormLabel>
							<Input
								type="text"
								value={username}
								onChange={(e) => {
									setUsername(e.target.value);
								}}
							/>
						</FormControl>
						<FormControl id="password" isRequired>
							<FormLabel>Password</FormLabel>
							<Input
								type="password"
								value={password}
								onChange={(e) => {
									setPassword(e.target.value);
								}}
							/>
						</FormControl>
						{signUpOrSignIn === 'signup' ? (
							<Link
								color={'blue.400'}
								onClick={() => {
									setSignUpOrSignIn('signin');
								}}
							>
								Have an account? Sign in instead.
							</Link>
						) : (
							<Link
								color={'blue.400'}
								onClick={() => {
									setSignUpOrSignIn('signup');
								}}
							>
								Need an account? Sign up.
							</Link>
						)}

						<Button
							bg={'blue.400'}
							color={'white'}
							_hover={{
								bg: 'blue.500',
							}}
							isLoading={loading}
							onClick={submit}
						>
							{signUpOrSignIn === 'signup' ? 'Sign up' : 'Sign in'}
						</Button>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}
