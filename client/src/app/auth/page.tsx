'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Auth() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [signUpOrSignIn, setSignUpOrSignIn] = useState('signup');
	const router = useRouter();

	async function submit() {
		try {
			const res = await fetch(`http://localhost:1025/auth/${signUpOrSignIn}`, {
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
			}
		} catch (e) {
			throw e;
		}
	}

	return (
		<div>
			<label htmlFor="username">Username</label>
			<input
				type="text"
				id="username"
				name="username"
				onChange={(e) => {
					setUsername(e.target.value);
				}}
				required
			/>

			<label htmlFor="password">Password</label>
			<input
				type="password"
				id="password"
				name="password"
				onChange={(e) => {
					setPassword(e.target.value);
				}}
				required
			/>
			<br />

			{signUpOrSignIn === 'signup' ? (
				<button onClick={submit}>Sign Up</button>
			) : (
				<button onClick={submit}>Sign In</button>
			)}
			<br />
			{signUpOrSignIn === 'signup' ? (
				<button
					onClick={() => {
						setSignUpOrSignIn('signin');
					}}
				>
					Have an account? Sign In
				</button>
			) : (
				<button
					onClick={() => {
						setSignUpOrSignIn('signup');
					}}
				>
					Don't have an account yet? Sign Up
				</button>
			)}
		</div>
	);
}
