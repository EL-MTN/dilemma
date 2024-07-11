import { model, Schema } from 'mongoose';

const UserSchema = new Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	score: { type: Number, default: 0 },
	record: { type: Number, default: 0 },
});

export const User = model('User', UserSchema);
