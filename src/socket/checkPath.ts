import {Socket} from 'socket.io';
import Game from '../classes/Game.js';


export default function (socket: Socket) {
	socket.on('checkPath', (roomID, x, y, horizontally, length, callback) => {
		// todo: check input correctness
		const room = Game.map.get(roomID);
		const pathToCheck = room.board.getPath(x, y, horizontally, length);

		const adjacentTiles = room.board.getPath(x - 1, y- 1, horizontally, length + 2)
			.concat(room.board.getPath(x + (horizontally ? -1 : 0), y + (horizontally ? 0 : -1), horizontally, length + 2))
			.concat(room.board.getPath(x + (horizontally ? -1: 1), y + (horizontally ? 1 : -1), horizontally, length + 2))
			.map(tile => {
				if (tile.forceIDs.includes(socket.id))
					return tile;
			})
			.filter(tile => tile);

		callback({
			available: pathToCheck.filter(tile => !tile.forceIDs.includes(socket.id)).length === length,
			adjoinTilesArr: adjacentTiles,
			correctPath: pathToCheck.filter(tile => !tile.forceIDs.includes(socket.id)),
			takenPath: pathToCheck.filter(tile => tile.forceIDs.includes(socket.id))
		});
	});
}