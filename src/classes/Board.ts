import {MapSymbols} from '../types/enums.js';
import {BoardMap} from '../types/interfaces.js';
import Tile from './Tile.js';


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
					row.push(new Tile(j - 1, i - 1, [], MapSymbols.wall))
				else
					row.push(new Tile(j - 1, i - 1, [], MapSymbols.empty));

			gameMap.push(row);
		}

		this.height = height;
		this.width = width;
		this.map = gameMap;
	}

	getForceMap(forceID: string) {
		const forceMap = [];

		for (let i = 0; i < this.height; i++) {
			const forceRow = [];
			const row = this.map[i + 1];

			for (let j = 0; j < this.width; j++) {
				const tile = row[j + 1];
				forceRow.push({
					taken: tile.forceIDs.find(force => force === forceID),
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
			const nextX = horizontally ? x + 1 + i : x + 1;
			const nextY = horizontally ? y + 1 : y + 1 + i;

			const nextTile = this.map[nextY][nextX];

			if (nextTile.status === MapSymbols.wall)
				return path;
			else
				path.push(nextTile);
		}

		return path;
	}

	writePath(path: Tile[], forceID: string | null, status: MapSymbols) {
		for (let i = 0; i < path.length; i++)
			Object.assign(path[i], {
				forceIDs: path[i].forceIDs.concat([forceID]),
				status
			});
	}
}