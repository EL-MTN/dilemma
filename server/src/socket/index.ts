import { Socket } from 'socket.io';
import { registerLobbyHandlers } from './lobbyHandler';

export const onConnection = (socket: Socket) => {
	registerLobbyHandlers(socket);
};
