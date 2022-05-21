import {Socket} from 'socket.io';
import BoardService from '../services/BoardService.js';
import {ClientToServerEvents} from '../types/socket.js';
import isInputCorrectUtil from '../utils/isInputCorrectUtil.js';


export default function (socket: Socket<ClientToServerEvents>) {
	socket.on('registerShipsRandom', (roomID, callback) => {
		// check input
		if (isInputCorrectUtil({input: roomID, type: 'number'}))
			return;

		// place ships randomly and return map of all player's ships coordinates to the player
		BoardService.placeShipsRandomly(roomID, socket.id);
		callback(BoardService.getCoordinatesOfPlayerShips(roomID, socket.id));
	});
}