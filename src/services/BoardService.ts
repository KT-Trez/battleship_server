import Room from '../classes/Room.js';
import {TileStatuses} from '../classes/Tile.js';
import Tools from '../classes/Tools.js';
import config from '../config.js';


export default class BoardService {
	static checkShipPlacement(roomID: number, placerID: string, x: number, y: number, isShipHorizontal: boolean, shipLength: number) {
		const engine = Room.map.get(roomID);
		const tilesOnPath = engine.board.getTilesOnPath(x, y, isShipHorizontal, shipLength);

		const tilesTakenNextToPath = engine.board.getTilesOnPath(x - 1, y - 1, isShipHorizontal, shipLength + 2)
			.concat(engine.board.getTilesOnPath(x + (isShipHorizontal ? -1 : 0), y + (isShipHorizontal ? 0 : -1), isShipHorizontal, shipLength + 2))
			.concat(engine.board.getTilesOnPath(x + (isShipHorizontal ? -1 : 1), y + (isShipHorizontal ? 1 : -1), isShipHorizontal, shipLength + 2))
			.map(tile => {
				if (tile.containsPlayerShip(placerID))
					return tile;
			})
			.filter(tile => tile);

		return {
			isPlacementAvailable: tilesOnPath.filter(tile => !tile.containsPlayerShip(placerID)).length === shipLength && tilesTakenNextToPath.length === 0,
			tilesAlreadyTaken: tilesOnPath.filter(tile => tile.containsPlayerShip(placerID)),
			tilesContactingObstacles: tilesTakenNextToPath,
			tilesWithCorrectPlacement: tilesOnPath.filter(tile => !tile.containsPlayerShip(placerID))
		};
	}

	static clearBoardOfPlayerShips(roomID: number, playerID: string) {
		const engine = Room.map.get(roomID);
		const tilesWithPlayerShipsArr = engine.board.getTilesOfPlayer(playerID);

		for (const tile of tilesWithPlayerShipsArr)
			tile.removeShips(playerID);
	}

	static getCoordinatesOfPlayerShips(roomID: number, playerID: string) {
		const engine = Room.map.get(roomID);
		const shipsTilesArr = engine.board.getTilesOfPlayer(playerID);

		return shipsTilesArr.map(tile => {
			return {
				x: tile.x,
				y: tile.y
			}
		});
	}

	static placeShipsRandomly(roomID: number, playerID: string) {
		const engine = Room.map.get(roomID);
		// clear all player's ships
		BoardService.clearBoardOfPlayerShips(roomID, playerID);

		// place new ships randomly
		for (const ship of config.ShipsList)
			for (let i = 0; i < ship.quantity; i++) {
				// randomly places new ship
				const placeShip = () => {
					// randomly pick coordinates and orientation
					const x = Tools.getRandomIntInclusive(0, engine.board.getDimensions().width - ship.length);
					const y = Tools.getRandomIntInclusive(0, engine.board.getDimensions().height - ship.length);
					const horizontal = Boolean(Tools.getRandomIntInclusive(0, 1));

					// check if ship can be placed; place new ship if possible, else repeat whole process
					const newShipData = BoardService.checkShipPlacement(roomID, playerID, x, y, horizontal, ship.length);
					if (!newShipData.isPlacementAvailable)
						placeShip();
					else
						engine.board.writeTiles(newShipData.tilesWithCorrectPlacement, playerID, TileStatuses.ships);
				};
				placeShip();
			}
	}
}