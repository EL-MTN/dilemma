import { model, Schema } from 'mongoose';

const UserSchema = new Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	score: { type: Number, default: 0 },
	record: {
		cooperate: { type: Number, default: 0 },
		defect: { type: Number, default: 0 },
	},
});

interface UserInterface {
	username: string;
	password: string;
	score: number;
	record: {
		cooperate: number;
		defect: number;
	};
}

export const User = model<UserInterface>('User', UserSchema);
