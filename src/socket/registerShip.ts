import {Socket} from 'socket.io';
import Game from '../classes/Game.js';
import {MapSymbols} from '../types/enums.js';
import {displayBoard} from '../utils/devUtil.js';


export default function (socket: Socket) {
	socket.on('registerShip', (roomID, x, y, horizontal, length) => {
		// todo: sanitize input
		const room = Game.map.get(roomID);
		const pathToWrite = room.board.getPath(x, y, horizontal, length);

		for (let i = 0; i < pathToWrite.length; i++)
			if (pathToWrite[i].status === MapSymbols.wall || pathToWrite[i].forceIDs.find(forceID => forceID === socket.id))
				return;
		room.board.writePath(pathToWrite, socket.id, MapSymbols.ships);

		displayBoard(room.board.map, socket.id);
	});
}