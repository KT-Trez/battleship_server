import {Socket} from 'socket.io';
import Room from '../classes/Room.js';
import {TileStatuses} from '../classes/Tile.js';
import BoardService from '../services/BoardService.js';
import isInputCorrectUtil from '../utils/isInputCorrectUtil.js';


export default function (socket: Socket) {
	socket.on('registerShip', (roomID, x, y, isHorizontal, shipLength, callback) => {
		// check input
		if (isInputCorrectUtil({input: roomID, type: 'number'}, {input: x, type: 'number'}, {input: y, type: 'number'}, {input: isHorizontal, type: 'boolean'}, {input: shipLength, type: 'number'}))
			return;

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