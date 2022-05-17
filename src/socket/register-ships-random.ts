import {Socket} from 'socket.io';
import Room from '../classes/Room.js';
import BoardService from '../services/BoardService.js';


export default function (socket: Socket) {
	socket.on('registerShipsRandom', (roomID, callback) => {
		// check input
		if (!Room.map.has(roomID))
			throw new Error('There is no room of given ID: ' + roomID);

		// place ships randomly and return map of all player's ships coordinates to the player
		BoardService.placeShipsRandomly(roomID, socket.id);
		callback(BoardService.getCoordinatesOfPlayerShips(roomID, socket.id));
	});
}