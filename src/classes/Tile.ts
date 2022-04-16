import {MapSymbols} from '../types/enums.js';
import {Tile as BoardTile} from '../types/Tile.js';


export default class Tile implements BoardTile {
	forceIDs: string[];
	shotsFired: string[];
	status: MapSymbols;
	x: number;
	y: number;

	constructor(x: number, y: number, forceID: string[], status: MapSymbols) {
		this.x = x;
		this.y = y;

		this.forceIDs = forceID;
		this.shotsFired = [];
		this.status = status;
	}
}