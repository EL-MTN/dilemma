import { customAlphabet } from 'nanoid';
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';

const nanoid = customAlphabet(alphabet, 6);

export function generateId() {
	return nanoid();
}
