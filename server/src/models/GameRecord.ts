import { model, Schema } from 'mongoose';

interface Game {
	player1: {
		record: {
			cooperate: number;
			defect: number;
		};
		score: number;
		choice: 'cooperate' | 'defect';
	};
	player2: {
		record: {
			cooperate: number;
			defect: number;
		};
		score: number;
		choice: 'cooperate' | 'defect';
	};
}

const gameRecordSchema = new Schema({
	player1: {
		record: {
			cooperate: Number,
			defect: Number,
		},
		score: Number,
		choice: String,
	},
	player2: {
		record: {
			cooperate: Number,
			defect: Number,
		},
		score: Number,
		choice: String,
	},
});

export const GameRecord = model<Game>('GameRecord', gameRecordSchema);
