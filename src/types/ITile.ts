import {TileStatuses} from '../classes/Tile.js';


export interface ITile {
	x: number;
	y: number;

	addShooters: (shootersIDs: string | string[]) => void;
	addShips: (ownersIDs: string | string[]) => void;
	containsPlayerShip: (playerID: string) => boolean;
	getShipownersExcludingOne: (ownerID: string) => string[];
	hasPlayerShot: (shooterID: string) => boolean;
	getStatus: () => TileStatuses;
	removeShips: (ownersIDs: string | string[]) => void
	setStatus: (status: TileStatuses) => void;
}