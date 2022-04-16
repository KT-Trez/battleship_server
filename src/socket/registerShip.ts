import {Socket} from 'socket.io';
import Room from '../classes/Room.js';
import {MapSymbols} from '../types/enums.js';
import {displayBoard} from '../utils/devUtil.js';


export default function (socket: Socket) {
	socket.on('registerShip', (roomID, x, y, horizontal, length) => {
		// todo: sanitize input
		const engine = Room.map.get(roomID);
		const pathToWrite = engine.board.getPath(x, y, horizontal, length);

		for (let i = 0; i < pathToWrite.length; i++)
			if (pathToWrite[i].status === MapSymbols.wall || pathToWrite[i].forceIDs.find(forceID => forceID === socket.id))
				return;
		// todo: check if there are no additional ships added
		engine.board.writePath(pathToWrite, socket.id, MapSymbols.ships);

		displayBoard(engine.board.map, socket.id);
	});
}