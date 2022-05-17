import {Socket} from 'socket.io';
import Room from '../classes/Room.js';
import BoardService from '../services/BoardService.js';


export default function (socket: Socket) {
	socket.on('checkPath', (roomID, x, y, isHorizontal, pathLength, callback) => {
		// check input
		// todo: create util for checking input
		if (!Room.map.has(roomID))
			throw new Error('There is no room of given ID: ' + roomID);
		if (typeof x !== 'number' || typeof y !== 'number')
			throw new Error('Coordinates must be of a type number. Got: ' + typeof x + ' ' + typeof y);
		if (typeof isHorizontal !== 'boolean')
			throw new Error('Ship orientation must of a type boolean. Got: ' + typeof isHorizontal);
		if (typeof pathLength !== 'number')
			throw new Error('Path length must be of a type number. Got: ' + typeof pathLength);

		// check and return placement data to client
		const placementData = BoardService.checkShipPlacement(roomID, socket.id, x, y, isHorizontal, pathLength);
		callback(placementData);
	});
}