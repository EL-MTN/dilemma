import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { socketAuth } from './middlewares/socketAuth';
import { router } from './routes';
import { onConnection } from './socket';

const app = express();
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: '*',
	},
});

io.use(socketAuth);
io.on('connection', onConnection);

app.use(cors());
app.use(express.json());
app.use(router);

mongoose.connect(process.env.MONGODB_URI!).then(() => {
	console.log('connected to mongodb');
});

server.listen(process.env.PORT, () => {
	console.log('server running at http://localhost:1025');
});
