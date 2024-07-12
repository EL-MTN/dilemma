import { compareSync, hashSync } from 'bcrypt';
import { Request, Response } from 'express';
import { createToken } from '../lib/jwt';
import { User } from '../models/User';

const signUp = async (req: Request, res: Response) => {
	// create new user if not exists

	const { username, password } = req.body;

	const user = await User.findOne({
		username,
	});

	if (user) {
		return res.status(400).json({
			message: 'User already exists',
		});
	}

	const hashedPassword = hashSync(password, 12);

	const newUser = new User({
		username,
		password: hashedPassword,
	});

	await newUser.save();

	const token = createToken({ id: newUser._id });

	res.status(201).json({ token });
};

const signIn = async (req: Request, res: Response) => {
	const { username, password } = req.body;

	const user = await User.findOne({
		username,
	});

	if (!user) {
		return res.status(400).json({
			message: 'Invalid credentials',
		});
	}

	const isPasswordValid = compareSync(password, user.password);

	if (!isPasswordValid) {
		return res.status(400).json({
			message: 'Invalid credentials',
		});
	}

	const token = createToken({ id: user._id });

	res.status(200).json({ token });
};

const me = async (req: Request, res: Response) => {
	const user = await User.findById(req.user).select('-password');

	if (!user) {
		return res.status(404).json({
			message: 'User not found',
		});
	}

	res.status(200).json(user);
};

export { signIn, signUp, me };
