import {Socket} from 'socket.io';
import Room from '../classes/Room.js';
import {ClientToServerEvents} from '../types/socket.js';
import isInputCorrectUtil from '../utils/isInputCorrectUtil.js';


export default function (socket: Socket<ClientToServerEvents>) {
	socket.on('registerShot', (roomID, coordinates, callback) => {
		// check input
		if (isInputCorrectUtil({input: roomID, type: 'number'}, {input: coordinates.x, type: 'number'}, {input: coordinates.y, type: 'number'}))
			return;

		// register shot
		const engine = Room.map.get(roomID);
		const result = engine.registerShot(socket.id, coordinates.x, coordinates.y);

		// return shot status to the client
		callback(result);
	});
}