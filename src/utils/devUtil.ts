import {MapSymbols} from '../types/enums.js';
import {BoardMap} from '../types/interfaces.js';


export function displayBoard(board: BoardMap, forceID: string) {
	let log = '';

	for (const boardRow of board) {
		let row = '';
		for (const rowTile of boardRow)
			if (rowTile.forceIDs.includes(forceID))
				row += 'x ';
			else if (rowTile.status === MapSymbols.wall)
				row += '# ';
			else
				row += '- ';

		log += row + '\n';
	}
	console.log(log);
}