import { useState, useEffect } from 'react';

export function useToken(storageKey: string): string | null {
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		const storedToken = localStorage.getItem(storageKey);
		if (storedToken) {
			setToken(storedToken);
		}
	}, [storageKey]);

	return token;
}
