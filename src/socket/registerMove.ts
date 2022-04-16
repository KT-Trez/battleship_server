import {Socket} from 'socket.io';
import Room from '../classes/Room.js';


export default function (socket: Socket) {
	socket.on('registerMove', (roomID, x, y, callback) => {
		const engine = Room.map.get(roomID);
		const result = engine.registerMove(socket.id, x, y);

		callback(result);
	});
}