import {MapSymbols} from '../types/enums';
import {BoardMap} from '../types/interfaces';
import Tile from './Tile';


export default class Board {
	readonly map: BoardMap;
	private readonly height: number;
	private readonly width: number;

	constructor(height: number, width: number) {
		const gameMap = [];
		for (let i = 0; i < height + 2; i++) {
			const row = [];

			for (let j = 0; j < width + 2; j++)
				if (j === 0 || j === width + 1 || i === 0 || i === height + 1)
					row.push(new Tile(j, i, null, MapSymbols.taken))
				else
					row.push(new Tile(j, i, null, MapSymbols.empty));

			gameMap.push(row);
		}

		this.height = height;
		this.width = width;
		this.map = gameMap;
	}

	getForceMap(forceID: number) {
		const forceMap = [];

		for (let i = 0; i < this.height; i++) {
			const forceRow = [];
			const row = this.map[i + 1];

			for (let j = 0; j < this.width; j++) {
				const tile = row[j + 1];
				forceRow.push({
					taken: tile.forceID === forceID,
					x: j,
					y: i
				});
			}
			forceMap.push(forceRow);
		}

		return forceMap;
	}

	iteratePath(x: number, y: number, horizontally: boolean, length: number) {
		const path: Tile[] = [];
		for (let i = 0; i < length; i++) {
			const nextX = horizontally ? x + 1 + i : y + 1;
			const nextY = horizontally ? y + 1 : y + 1 + i;

			const iteratedTile = this.map[nextY][nextX];

			if (iteratedTile.status === MapSymbols.taken && !iteratedTile.forceID)
				return path;
			else
				path.push(iteratedTile);
		}

		return path;
	}

	writePath(path: Tile[], forceID: number | null, status: MapSymbols) {
		for (let i = 0; i < path.length; i++)
			Object.assign(path[i], {
				forceID,
				status
			});
	}
}