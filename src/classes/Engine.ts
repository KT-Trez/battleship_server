import {io} from '../../server.js';
import config from '../config.js';
import Board from './Board.js';
import Room from './Room.js';


export default class Engine {
	board: Board;
	room: Room;

	private readonly allShipsElementsCount = 0;
	private gameEnded = false;
	private players: string[];
	private playersShips: Map<string, number>
	private turn: NodeJS.Timeout;
	private turnMaxTime: number;
	private turnPlayerID: string;
	private turnPlayerIndex = 0;

	constructor(board: Board, room: Room, turnMaxTime: number) {
		this.board = board;
		this.room = room;

		for (const ship of config.ShipsList)
			this.allShipsElementsCount += ship.quantity * ship.length;
		this.playersShips = new Map();
		this.turnMaxTime = turnMaxTime;
	}

	private checkForWin(shipsLeft: number) {
		if (shipsLeft <= 0) {
			clearTimeout(this.turn);

			// todo: add multiple players
			io.in(this.room.id.toString()).emit('win', this.turnPlayerID);
		}
	}

	registerMove(playerID: string, x: number, y: number) {
		if (playerID !== this.turnPlayerID)
			throw new Error('Invalid player tried to register move');

		const tile = this.board.getTile(x, y);
		if (tile.shotsFired.includes(playerID))
			throw new Error('Position has already been fired at');

		tile.shotsFired.push(playerID);

		const enemyForcesIDsArr = tile.forceIDs.filter(forceID => forceID !== playerID);
		if (enemyForcesIDsArr.length > 0) {
			for (const player of tile.forceIDs.filter(forceID => forceID !== playerID)) {
				const playerShipsCount = this.playersShips.get(player);
				this.playersShips.set(player, playerShipsCount - 1);

				this.checkForWin(playerShipsCount - 1);
			}

			io.to(this.room.id.toString()).emit('hit', this.turnPlayerID, x, y, enemyForcesIDsArr);

			clearTimeout(this.turn);
			this.startTurn();

			return true;
		}

		io.to(this.room.id.toString()).emit('miss', this.turnPlayerID, x, y);
		return false;
	}

	setTurnMaxTime(time: number) {
		this.turnMaxTime = time;
	}

	private startTurn() {
		io.to(this.room.id.toString()).emit('nextTurn', this.turnPlayerID, new Date(), this.turnMaxTime);

		this.turn = setTimeout(() => {
			if (this.gameEnded)
				return;

			this.turnPlayerIndex++;
			this.turnPlayerID = this.players[this.turnPlayerIndex];

			this.startTurn();
		}, this.turnMaxTime);
	}

	start() {
		this.players = Array.from(this.room.clients.keys());
		for (const player of this.players)
			this.playersShips.set(player, this.allShipsElementsCount);
		this.turnPlayerID = this.players[0];

		console.log('Game ' + this.room.id + ' starting!');
		// todo: isolate socket out of engine
		io.in(this.room.id.toString()).emit('gameStarted');
		this.startTurn();
	}
}