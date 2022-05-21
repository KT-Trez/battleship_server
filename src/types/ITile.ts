import {TileStatuses} from '../classes/Tile.js';


export interface ITile {
	x: number;
	y: number;

	addShooters: (shootersIDs: string | string[]) => void;
	addShips: (ownersIDs: string | string[]) => void;
	containsShipOfPlayer: (playerID: string) => boolean;
	getShipownersExcludingOne: (ownerID: string) => string[];
	hasBeenShotAtByPlayer: (shooterID: string) => boolean;
	getStatus: () => TileStatuses;
	removeShips: (ownersIDs: string | string[]) => void
	setStatus: (status: TileStatuses) => void;
}