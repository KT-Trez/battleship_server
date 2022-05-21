import {Socket} from 'socket.io';
import BoardService from '../services/BoardService.js';
import {ClientToServerEvents} from '../types/socket.js';
import isInputCorrectUtil from '../utils/isInputCorrectUtil.js';


export default function (socket: Socket<ClientToServerEvents>) {
	socket.on('checkPath', (roomID,coordinates, isHorizontal, pathLength, callback) => {
		// check input
		if (isInputCorrectUtil({input: roomID, type: 'number'}, {input: coordinates.x, type: 'number'}, {input: coordinates.y, type: 'number'}, {input: isHorizontal, type: 'boolean'}, {input: length, type: 'number'}))
			return;

		// check and return placement data to client
		const placementData = BoardService.checkShipPlacement(roomID, socket.id, coordinates.x, coordinates.y, isHorizontal, pathLength);
		callback(placementData);
	});
}