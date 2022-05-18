import {Socket} from 'socket.io';
import {io} from '../../server.js';
import Room from '../classes/Room.js';
import isInputCorrectUtil from '../utils/isInputCorrectUtil.js';


export default function (socket: Socket) {
	socket.on('leaveRoom', (roomID) => {
		// check input
		if (isInputCorrectUtil({input: roomID, type: 'number'}))
			return;

		// remove client from the room and stop listening to room's channel
		socket.leave(roomID.toString());

		const engine = Room.map.get(roomID);
		engine.room.removeClient(socket.id);

		// delete room if all clients left
		if (engine.room.getClients().length === 0) {
			io.socketsLeave(roomID.toString());
			Room.map.delete(roomID);
		}
	});
}