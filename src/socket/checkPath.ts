import {Socket} from 'socket.io';
import Game from '../classes/Game.js';


export default function (socket: Socket) {
	socket.on('checkPath', (roomID, x, y, horizontally, length, callback) => {
		// todo: check input correctness
		const room = Game.map.get(roomID);
		const pathToCheck = room.board.iteratePath(x, y, horizontally, length);

		// todo: check tiles around
		callback({
			available: pathToCheck.length === length,
			correctPath: pathToCheck.filter(tile => !tile.forceIDs.includes(socket.id)),
			takenPath: pathToCheck.filter(tile => tile.forceIDs.includes(socket.id))
		});
	});
}