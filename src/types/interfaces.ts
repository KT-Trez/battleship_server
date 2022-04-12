import {MapSymbols} from './enums';


export interface Tile {
	forceIDs: string[];
	status: MapSymbols;
	x: number;
	y: number;
}

export type BoardMap = Row[];

export type Row = Tile[];

