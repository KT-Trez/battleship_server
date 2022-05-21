import {ITile as BoardTile} from '../types/ITile.js';


/** possible statuses of board's tile */
export enum TileStatuses {
	empty,
	wall,
	ships
}

/**
 * Class that represents all data of a board's tile
 */
export default class Tile implements BoardTile {
	/** IDs of a players that have their ship placed on this tile */
	private readonly shipownersIDsArr: string[] = [];
	/** IDs of a players that have shot on this tile */
	private readonly shootersIDsArr: string[] = [];
	/** tile's status (ex.: empty, ship, wall etc.) */
	private status: TileStatuses;

	/** tile's horizontal coordinate */
	readonly x: number;
	/** tile's vertical coordinate */
	readonly y: number;

	/**
	 * Creates new instance of board's tile data
	 * @param {number} x - tile's horizontal coordinate
	 * @param {number} y - tile's vertical coordinate
	 * @param {string[]} shipownerIDArr - array of IDs of a players that have their ship placed on this tile
	 * @param {TileStatuses} status - tile's status (ex.: empty, ship, wall etc.)
	 */
	constructor(x: number, y: number, shipownerIDArr: string[], status: TileStatuses) {
		this.x = x;
		this.y = y;

		this.addShips(shipownerIDArr);
		this.status = status;
	}

	/**
	 * Saves the IDs of a players that shot at this tile
	 * @param {string | string[]} shootersIDs - array of players IDs or single player's ID
	 */
	addShooters(shootersIDs: string | string []) {
		if (typeof shootersIDs === 'string')
			this.shootersIDsArr.push(shootersIDs);
		else
			this.shootersIDsArr.splice(this.shootersIDsArr.length, 0, ...shootersIDs);
	}

	/**
	 * Saves ships of the given players to this tile
	 * @param {string | string[]} playerIDs - array of players IDs or single player's ID that placed their ship on this tile
	 */
	addShips(playerIDs: string | string[]) {
		if (typeof playerIDs === 'string')
			this.shootersIDsArr.push(playerIDs);
		else
			this.shootersIDsArr.splice(this.shootersIDsArr.length, 0, ...playerIDs);
	};

	/**
	 * Checks if a player has placed his/her ship on this tile
	 * @param {string} playerID - player's ID
	 * @returns {boolean} - whether player placed his/her ship on this tile or not
	 */
	containsShipOfPlayer(playerID: string) {
		return this.shipownersIDsArr.includes(playerID);
	}

	/**
	 * Gets all players who have placed their ships on this tile, excluding one
	 * @param {string} playerID
	 * @returns {string[]}
	 */
	getShipownersExcludingOne(playerID: string) {
		return this.shipownersIDsArr.filter(shipOwnerID => shipOwnerID !== playerID);
	}

	/**
	 * Checks if player has already shot at this tile
	 * @param {string} playerID - player's ID
	 * @returns {boolean} - whether player shot this tile or not
	 */
	hasBeenShotAtByPlayer(playerID: string) {
		return this.shootersIDsArr.includes(playerID);
	}

	/**
	 * Gets tile's current status
	 * @returns {TileStatuses} - tile's status
	 */
	getStatus() {
		return this.status;
	}

	/**
	 * Removes ships of the given players from this tile
	 * @param {string | string[]} playerIDs - players IDs whose ships will be removed
	 */
	removeShips(playerIDs: string | string[]) {
		// removes ID of a player from array of shipowners
		const removeShipOwner = (ownerID: string) => {
			const shipOwnerIndex = this.shipownersIDsArr.indexOf(ownerID);
			this.shipownersIDsArr.splice(shipOwnerIndex, 1);
		};

		// remove one or many shipowners
		if (typeof playerIDs === 'string')
			removeShipOwner(playerIDs);
		else
			for (const shipOwner of playerIDs)
				removeShipOwner(shipOwner);
	}

	/**
	 * Sets tile's status
	 * @param {TileStatuses} status - new status for tile
	 */
	setStatus(status: TileStatuses) {
		this.status = status;
	}
}