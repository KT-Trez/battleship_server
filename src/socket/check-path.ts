import {Socket} from 'socket.io';
import BoardService from '../services/BoardService.js';
import isInputCorrectUtil from '../utils/isInputCorrectUtil.js';


export default function (socket: Socket) {
	socket.on('checkPath', (roomID, x, y, isHorizontal, pathLength, callback) => {
		// check input
		if (isInputCorrectUtil({input: roomID, type: 'number'}, {input: x, type: 'number'}, {input: y, type: 'number'}, {input: isHorizontal, type: 'boolean'}, {input: length, type: 'number'}))
			return;

		// check and return placement data to client
		const placementData = BoardService.checkShipPlacement(roomID, socket.id, x, y, isHorizontal, pathLength);
		callback(placementData);
	});
}