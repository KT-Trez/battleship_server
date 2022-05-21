import {BoardMap} from '../types/types.js';
import {displayBoard} from '../utils/devUtil.js';
import {systemLogger} from '../utils/loggerUtil.js';
import Tile, {TileStatuses} from './Tile.js';
import {ITile} from '../types/ITile.js'


/**
 * Class that manages game's board
 */
export default class Board {
	/** virtual array with board's data, essentially the board itself */
	readonly map: BoardMap;
	/** game's height */
	private readonly height: number;
	/** game's width */
	private readonly width: number;

	/**
	 * Creates new board instance
	 * @param {number} height - board's height
	 * @param {number} width - board's width
	 */
	constructor(height: number, width: number) {
		// generating board's data
		const gameMap = [];
		for (let i = 0; i < height + 2; i++) {
			const row = [];

			for (let j = 0; j < width + 2; j++)
				if (j === 0 || j === width + 1 || i === 0 || i === height + 1)
					row.push(new Tile(j - 1, i - 1, [], TileStatuses.wall))
				else
					row.push(new Tile(j - 1, i - 1, [], TileStatuses.empty));

			gameMap.push(row);
		}

		// saving board's config
		this.height = height;
		this.width = width;
		this.map = gameMap;
	}

	/**
	 * Returns board dimensions
	 * @returns {{width: number, height: number}} - board's height and width
	 */
	getDimensions() {
		return {
			height: this.height,
			width: this.width
		};
	}

	/**
	 * Return tile of given coordinates
	 * @param {number} x - horizontal coordinate
	 * @param {number} y - vertical coordinate
	 * @returns {Tile} searched tile or tile from the middle of the board if coordinates are incorrect
	 */
	getTile(x: number, y: number) {
		// todo: implement error notification if tile is incorrect
		try {
			return this.map[y + 1][x + 1];
		} catch (error) {
			systemLogger.log(1, `Tried to get invalid tile [x:${x + 1} y:${y + 1}]: ${error.message}`);
			return this.map[Math.round(this.height / 2 + 1)][Math.round(this.width / 2 + 1)];
		}
	}

	/**
	 * Searches for all tiles that contain ships of given player
	 * @param {string} forceID - player's ID
	 * @returns {Tile[]} tiles that contain player's ships
	 */
	getTilesOfPlayer(forceID: string) {
		const forceArr = [];

		for (let i = 0; i < this.height; i++) {
			const row = this.map[i + 1];

			for (let j = 0; j < this.width; j++) {
				const tile = row[j + 1];
				if (tile.containsShipOfPlayer(forceID))
					forceArr.push(tile);
			}
		}

		// todo: remove, debug only
		displayBoard(this.map, forceID);
		return forceArr;
	}

	/**
	 * Returns tiles from the given path
	 * @param {number} x - horizontal coordinate of a path's start
	 * @param {number} y - vertical coordinate of a path's start
	 * @param {boolean} isHorizontal - whether path is horizontal or vertical
	 * @param {number} length - path's length
	 * @returns {ITile[]} - tiles on the path
	 */
	getTilesOnPath(x: number, y: number, isHorizontal: boolean, length: number) {
		const path = [];
		for (let i = 0; i < length; i++) {
			// calculate coordinates of the next tile on path (taking axis orientation into account)
			const nextX = isHorizontal ? x + 1 + i : x + 1;
			const nextY = isHorizontal ? y + 1 : y + 1 + i;

			const nextTile = this.map[nextY][nextX];

			// check if tile is a wall, if not, add to the returned path
			if (nextTile.getStatus() === TileStatuses.wall && y !== -1)
				return path;
			else
				path.push(nextTile);
		}

		return path;
	}

	/**
	 * Writes new data to the tiles
	 * @param {Tile[]} tiles - array of tiles that will be written
	 * @param {string | null} forceID - ID of a player that has his/her ships placed on the tile
	 * @param {TileStatuses} status - tile's status (ex.: wall, ship etc.)
	 */
	writeTiles(tiles: ITile[], forceID: string | null, status: TileStatuses) {
		for (let i = 0; i < tiles.length; i++) {
			const tile = tiles[i];
			if (forceID)
				tile.addShips(forceID);
			tile.setStatus(status);
		}
	}
}