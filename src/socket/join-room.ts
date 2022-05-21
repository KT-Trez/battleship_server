import {Socket} from 'socket.io';
import Room from '../classes/Room.js';
import {ClientToServerEvents} from '../types/socket.js';
import isInputCorrectUtil from '../utils/isInputCorrectUtil.js';


export default function (socket: Socket<ClientToServerEvents>) {
	socket.on('joinRoom', (roomID, nick, callback) => {
		// check input
		if (isInputCorrectUtil({input: roomID, type: 'number'}, {input: nick, type: 'string'}))
			return;

		socket.join(roomID.toString());

		// if room exists, add client to room and/or return operation status
		const engine = Room.map.get(roomID);
		if (engine){
			engine.room.addClient(socket.id, nick);
			callback(true);
		} else
			callback(false);
	});
}