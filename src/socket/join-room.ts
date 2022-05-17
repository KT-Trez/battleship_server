import {Socket} from 'socket.io';
import Room from '../classes/Room.js';


export default function (socket: Socket) {
	socket.on('joinRoom', (roomID, nick, callback) => {
		// check input
		if (!Room.map.has(roomID))
			throw new Error('There is no room of given ID: ' + roomID);

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