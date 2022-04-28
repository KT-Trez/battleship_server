import {Socket} from 'socket.io';
import Room from '../classes/Room.js';
import Tools from '../classes/Tools.js';
import config from '../config.js';
import BoardService from '../services/BoardService.js';
import {MapSymbols} from '../types/enums.js';


export default function (socket: Socket) {
	socket.on('registerShipsRandom', (roomID, callback) => {
		const engine = Room.map.get(roomID);

		for (const ship of config.ShipsList)
			for (let i = 0; i < ship.quantity; i++) {
				const placeShip = () => {
					// todo: dynamic board size
					const x = Tools.getRandomIntInclusive(0, 10 - ship.length);
					const y = Tools.getRandomIntInclusive(0, 10 - ship.length);
					const horizontal = Boolean(Tools.getRandomIntInclusive(0, 1));

					const newShipData = BoardService.checkShipPlacement(roomID, socket.id, x, y, horizontal, ship.length);
					if (!newShipData.isPlacementAvailable)
						placeShip();
					else
						engine.board.writePath(newShipData.tilesWithCorrectPlacement, socket.id, MapSymbols.ships);
				};
				placeShip();
			}

		callback(engine.board.getForcePositions(socket.id));
	});
}