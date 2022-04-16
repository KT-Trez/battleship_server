import {Socket} from 'socket.io';
import {io} from '../../server.js';
import Room from '../classes/Room.js';


export default function (socket: Socket) {
	socket.on('leaveRoom', (roomID) => {
		socket.leave(roomID.toString());

		const engine = Room.map.get(roomID);
		engine.room.removeClient(socket.id);

		// delete room if all clients left
		if (engine.room.clients.size === 0) {
			io.socketsLeave(roomID.toString());
			Room.map.delete(roomID);
		}
	});
}