import {MapSymbols} from '../types/enums.js';
import {Tile as BoardTile} from '../types/interfaces.js';


export default class Tile implements BoardTile {
	forceIDs: string[] | null;
	status: MapSymbols;
	x: number;
	y: number;

	constructor(x: number, y: number, forceID: string[], status: MapSymbols) {
		this.x = x;
		this.y = y;

		this.forceIDs = forceID;
		this.status = status;
	}
}