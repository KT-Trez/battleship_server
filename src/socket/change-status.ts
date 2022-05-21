import {Socket} from 'socket.io';
import Room from '../classes/Room.js';
import {ClientToServerEvents} from '../types/socket.js';
import isInputCorrectUtil from '../utils/isInputCorrectUtil.js';


export default function (socket: Socket<ClientToServerEvents>) {
	socket.on('changeStatus', (roomID, readyStatus) => {
		// check input
		if (isInputCorrectUtil({input: roomID, type: 'number'}, {input: readyStatus, type: 'boolean'}))
			return;

		// change client's status
		const engine = Room.map.get(roomID);
		const readyState = engine.room.toggleClientReadyStatus(readyStatus);

		// start game if all clients are ready
		if (readyState.clientsReadyCount === readyState.clientsCount && readyState.clientsCount > 1)
			engine.start();
	});
}