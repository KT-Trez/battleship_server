import {Socket} from 'socket.io';
import Room from '../classes/Room.js';
import {TileStatuses} from '../classes/Tile.js';
import BoardService from '../services/BoardService.js';


export default function (socket: Socket) {
	socket.on('registerShip', (roomID, x, y, isHorizontal, shipLength, callback) => {
		// check input
		if (!Room.map.has(roomID))
			throw new Error('There is no room of given ID: ' + roomID);
		if (typeof x !== 'number' || typeof y !== 'number')
			throw new Error('Coordinates must be of a type number. Got: ' + typeof x + ' ' + typeof y);
		if (typeof isHorizontal !== 'boolean')
			throw new Error('Ship orientation must of a type boolean. Got: ' + typeof isHorizontal);
		if (typeof shipLength !== 'number')
			throw new Error('Path shipLength must be of a type number. Got: ' + typeof shipLength);

		// get path to write
		const engine = Room.map.get(roomID);
		const pathToWrite = engine.board.getTilesOnPath(x, y, isHorizontal, shipLength);

		// check if ship's placement and quantity are correct
		const placementData = BoardService.checkShipPlacement(roomID, socket.id, x, y, isHorizontal, shipLength);
		if (!placementData.isPlacementAvailable)
			return callback(false);
		// todo: check if there are no additional ships added
		//if (shipAreOverFlowingHelpMeSenpaiUwU)
		//	return callback(false);

		engine.board.writeTiles(pathToWrite, socket.id, TileStatuses.ships);
	});
}