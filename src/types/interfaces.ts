import {MapSymbols} from './enums';


export interface Tile {
	forceID: number | null;
	status: MapSymbols;
	x: number;
	y: number;
}

export type BoardMap = Row[];

export type Row = Tile[];

