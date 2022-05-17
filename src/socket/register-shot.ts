import {Socket} from 'socket.io';
import Room from '../classes/Room.js';


export default function (socket: Socket) {
	socket.on('registerShot', (roomID, x, y, callback) => {
		// check input
		if (!Room.map.has(roomID))
			throw new Error('There is no room of given ID: ' + roomID);

		// register shot
		const engine = Room.map.get(roomID);
		const result = engine.registerShot(socket.id, x, y);

		// return shot status to the client
		callback(result);
	});
}