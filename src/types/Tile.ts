import {MapSymbols} from './enums';


export interface Tile {
	forceIDs: string[];
	shotsFired: string[];
	status: MapSymbols;
	x: number;
	y: number;
}
