import {TileStatuses} from '../classes/Tile.js';
import {BoardMap} from '../types/types.js';


/**
 * Logs to terminal a game's board of a single player
 * @param {BoardMap} board - game's board
 * @param {string} playerID - ID of a player of whose board should be logged
 */
export function displayBoard(board: BoardMap, playerID: string) {
	let log = '';

	// iterate each tile & row to draw player's game board
	for (const boardRow of board) {
		let row = '';
		for (const rowTile of boardRow)
			if (rowTile.containsPlayerShip(playerID))
				row += 'x ';
			else if (rowTile.getStatus() === TileStatuses.wall)
				row += '# ';
			else
				row += '- ';

		log += row + '\n';
	}
	// log board
	console.info(log);
}