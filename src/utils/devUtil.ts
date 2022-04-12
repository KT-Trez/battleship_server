import {MapSymbols} from '../types/enums.js';
import {BoardMap} from '../types/interfaces.js';


export function displayBoard(board: BoardMap, forceID: string) {
	let log = '';

	for (const boardRow of board) {
		let row = '';
		for (const rowTile of boardRow)
			row += rowTile.forceIDs.includes(forceID) || rowTile.status === MapSymbols.wall ? 'x ' : '- ';

		log += row + '\n';
	}
	console.log(log);
}