import Room from '../classes/Room.js';
import {TileStatuses} from '../classes/Tile.js';
import Tools from '../classes/Tools.js';
import config from '../config.js';


/**
 * Class that collects all more advanced operations using board's basic methods
 */
export default class BoardService {
	/**
	 * Checks if ship can be placed in given coordinates
	 * @param {number} roomID - ID of a room in which game is held
	 * @param {string} placerID - ID of a player who is placing ship
	 * @param {number} x - horizontal coordinate of ship's first tile
	 * @param {number} y - vertical coordinate of ship's first tile
	 * @param {boolean} isShipHorizontal - whether ship is placed horizontally or not
	 * @param {number} shipLength - length of the ship
	 * @returns {{tilesContactingObstacles: ITile[], tilesWithCorrectPlacement: ITile[], isPlacementAvailable: boolean, tilesAlreadyTaken: ITile[]}} -
	 * * isPlacementAvailable - whether ship can be placed or not
	 * * tilesAlreadyTaken - tiles that prevent placement because player has already placed his/her ships on them
	 * * tilesContactingObstacles - tiles that prevent placement because they are touching obstacles, such as other friendly ships
	 * * tilesWithCorrectPlacement - tiles that passed the check
	 *
	 * tilesAlreadyTaken, tilesContactingObstacles, tilesWithCorrectPlacement are additional information that can be used to generate preview for the ship's placement
	 */
	static checkShipPlacement(roomID: number, placerID: string, x: number, y: number, isShipHorizontal: boolean, shipLength: number) {
		// find game and get tiles on ship's path
		const engine = Room.map.get(roomID);
		const tilesOnPath = engine.board.getTilesOnPath(x, y, isShipHorizontal, shipLength);

		// get all tiles around ship, that contain or touch other friendly ships
		const tilesTakenNextToPath = engine.board.getTilesOnPath(x - 1, y - 1, isShipHorizontal, shipLength + 2, true)
			.concat(engine.board.getTilesOnPath(x + (isShipHorizontal ? -1 : 0), y + (isShipHorizontal ? 0 : -1), isShipHorizontal, shipLength + 2, true))
			.concat(engine.board.getTilesOnPath(x + (isShipHorizontal ? -1 : 1), y + (isShipHorizontal ? 1 : -1), isShipHorizontal, shipLength + 2, true))
			.map(tile => {
				if (tile.containsShipOfPlayer(placerID))
					return tile;
			})
			.filter(tile => tile);

		// generate information about ship's placement
		return {
			isPlacementAvailable: tilesOnPath.filter(tile => !tile.containsShipOfPlayer(placerID)).length === shipLength && tilesTakenNextToPath.length === 0,
			tilesAlreadyTaken: tilesOnPath.filter(tile => tile.containsShipOfPlayer(placerID)).map(tile => {
				return {
					x: tile.x,
					y: tile.y
				}
			}),
			tilesContactingObstacles: tilesTakenNextToPath.map(tile => {
				return {
					x: tile.x,
					y: tile.y
				}
			}),
			tilesWithCorrectPlacement: tilesOnPath.filter(tile => !tile.containsShipOfPlayer(placerID)).map(tile => {
				return {
					x: tile.x,
					y: tile.y
				}
			})
		};
	}

	/**
	 * Gets array with coordinates of all player's ships
	 * @param {number} roomID - ID of a room in which game is held
	 * @param {string} playerID - player's ID
	 * @returns {{x: number, y: number}[]} - array of coordinates of all player's ships
	 */
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

	/**
	 * Places randomly all player's ships
	 * @param {number} roomID - ID of a room in which game is held
	 * @param {string} playerID - player's ID
	 */
	static placeShipsRandomly(roomID: number, playerID: string) {
		const engine = Room.map.get(roomID);
		// clear all player's ships
		BoardService.removePlayerShipsFromBoard(roomID, playerID);

		// place new ships randomly
		for (const ship of config.ShipsList)
			for (let i = 0; i < ship.quantity; i++) {
				// randomly places new ship
				const placeShip = () => {
					// randomly pick coordinates and orientation
					const x = Tools.getRandomIntInclusive(0, engine.board.getDimensions().width - ship.length);
					const y = Tools.getRandomIntInclusive(0, engine.board.getDimensions().height - ship.length);
					const isHorizontal = Boolean(Tools.getRandomIntInclusive(0, 1));

					// check if ship can be placed; place new ship if possible, else repeat whole process
					const newShipData = BoardService.checkShipPlacement(roomID, playerID, x, y, isHorizontal, ship.length);
					if (!newShipData.isPlacementAvailable)
						placeShip();
					else {
						engine.board.writeTiles(engine.board.getTilesOnPath(x, y, isHorizontal, ship.length), playerID, TileStatuses.ships);
						engine.playersShips.set(playerID, (engine.playersShips.get(playerID) ?? 0) + ship.length);
					}
				};
				placeShip();
			}
	}

	/**
	 * Removes all player's ships from the board
	 * @param {number} roomID - ID of a room in which game is held
	 * @param {string} playerID - player's ID
	 */
	static removePlayerShipsFromBoard(roomID: number, playerID: string) {
		const engine = Room.map.get(roomID);
		const tilesWithPlayerShipsArr = engine.board.getTilesOfPlayer(playerID);

		for (const tile of tilesWithPlayerShipsArr)
			tile.removeShips(playerID);
	}
}