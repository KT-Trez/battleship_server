import {Socket} from 'socket.io';
import Room from '../classes/Room.js';
import isInputCorrectUtil from '../utils/isInputCorrectUtil.js';


export default function (socket: Socket) {
	socket.on('registerShot', (roomID, x, y, callback) => {
		// check input
		if (isInputCorrectUtil({input: roomID, type: 'number'}, {input: x, type: 'number'}, {input: y, type: 'number'}))
			return;

		// register shot
		const engine = Room.map.get(roomID);
		const result = engine.registerShot(socket.id, x, y);

		// return shot status to the client
		callback(result);
	});
}