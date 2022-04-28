import Room from '../classes/Room.js';


export default class BoardService {
	static checkShipPlacement(roomID: number, placerID: string, x: number, y: number, isShipHorizontal: boolean, shipLength: number) {
		const engine = Room.map.get(roomID);
		const pathToCheck = engine.board.getPath(x, y, isShipHorizontal, shipLength);

		const adjacentTiles = engine.board.getPath(x - 1, y- 1, isShipHorizontal, shipLength + 2)
			.concat(engine.board.getPath(x + (isShipHorizontal ? -1 : 0), y + (isShipHorizontal ? 0 : -1), isShipHorizontal, shipLength + 2))
			.concat(engine.board.getPath(x + (isShipHorizontal ? -1: 1), y + (isShipHorizontal ? 1 : -1), isShipHorizontal, shipLength + 2))
			.map(tile => {
				if (tile.forceIDs.includes(placerID))
					return tile;
			})
			.filter(tile => tile);

		return {
			isPlacementAvailable: pathToCheck.filter(tile => !tile.forceIDs.includes(placerID)).length === shipLength && adjacentTiles.length === 0,
			tilesAlreadyTaken: pathToCheck.filter(tile => tile.forceIDs.includes(placerID)),
			tilesContactingObstacles: adjacentTiles,
			tilesWithCorrectPlacement: pathToCheck.filter(tile => !tile.forceIDs.includes(placerID))
		};
	}
}