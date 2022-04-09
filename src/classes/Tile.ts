import {MapSymbols} from '../types/enums';
import {Tile as BoardTile} from '../types/interfaces';


export default class Tile implements BoardTile {
	forceID: number;
	status: MapSymbols;
	x: number;
	y: number;

	constructor(x: number, y: number, forceID: number, status: MapSymbols) {
		this.x = x;
		this.y = y;

		this.forceID = forceID;
		this.status = status;
	}
}