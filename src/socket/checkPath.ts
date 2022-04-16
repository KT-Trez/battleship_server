import {Socket} from 'socket.io';
import Room from '../classes/Room.js';


export default function (socket: Socket) {
	socket.on('checkPath', (roomID, x, y, horizontally, length, callback) => {
		// todo: check input correctness
		const engine = Room.map.get(roomID);
		const pathToCheck = engine.board.getPath(x, y, horizontally, length);

		const adjacentTiles = engine.board.getPath(x - 1, y- 1, horizontally, length + 2)
			.concat(engine.board.getPath(x + (horizontally ? -1 : 0), y + (horizontally ? 0 : -1), horizontally, length + 2))
			.concat(engine.board.getPath(x + (horizontally ? -1: 1), y + (horizontally ? 1 : -1), horizontally, length + 2))
			.map(tile => {
				if (tile.forceIDs.includes(socket.id))
					return tile;
			})
			.filter(tile => tile);

		callback({
			available: pathToCheck.filter(tile => !tile.forceIDs.includes(socket.id)).length === length && adjacentTiles.length === 0,
			adjoinTilesArr: adjacentTiles,
			correctPath: pathToCheck.filter(tile => !tile.forceIDs.includes(socket.id)),
			takenPath: pathToCheck.filter(tile => tile.forceIDs.includes(socket.id))
		});
	});
}