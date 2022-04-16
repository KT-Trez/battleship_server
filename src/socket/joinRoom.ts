import {Socket} from 'socket.io';
import Room from '../classes/Room.js';


export default function (socket: Socket) {
	socket.on('joinRoom', (roomID, nick) => {
		socket.join(roomID.toString());

		const engine = Room.map.get(roomID);
		engine.room.addClient(socket.id, nick);
	});
}