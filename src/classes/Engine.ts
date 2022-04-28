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
			console.log(this.turnPlayerID + ' wins!');

			// todo: add multiple players
			io.in(this.room.id.toString()).emit('win', this.turnPlayerID);
			return true;
		}
		return false;
	}

	private nextPlayer() {
		this.turnPlayerIndex = (this.turnPlayerIndex + 1) % this.players.length;
		this.turnPlayerID = this.players[this.turnPlayerIndex];
		console.log(this.turnPlayerIndex, this.players);
	}

	registerShot(playerID: string, x: number, y: number) {
		if (playerID !== this.turnPlayerID)
			throw new Error('Invalid player tried to register move');

		const tile = this.board.getTile(x, y);
		if (tile.shotsFired.includes(playerID))
			throw new Error('Position has already been fired at');

		tile.shotsFired.push(playerID);

		const enemyForcesIDsArr = tile.forceIDs.filter(forceID => forceID !== playerID);
		if (enemyForcesIDsArr.length > 0) {
			let hasSomeoneWon = false;
			for (const player of tile.forceIDs.filter(forceID => forceID !== playerID)) {
				const playerShipsCount = this.playersShips.get(player);
				this.playersShips.set(player, playerShipsCount - 1);

				hasSomeoneWon = this.checkForWin(playerShipsCount - 1);
			}

			io.to(this.room.id.toString()).emit('hit', this.turnPlayerID, x, y, enemyForcesIDsArr);
			if (!hasSomeoneWon)
				this.startTurn();

			return true;
		}

		io.to(this.room.id.toString()).emit('miss', this.turnPlayerID, x, y, this.players.filter(playerID => playerID !== this.turnPlayerID));
		this.nextPlayer();
		this.startTurn();

		return false;
	}

	setTurnMaxTime(time: number) {
		this.turnMaxTime = time;
	}

	private startTurn() {
		io.to(this.room.id.toString()).emit('nextTurn', this.turnPlayerID, new Date(), this.turnMaxTime);

		clearTimeout(this.turn);
		this.turn = setTimeout(() => {
			if (this.gameEnded)
				return;

			this.nextPlayer();

			this.startTurn();
		}, this.turnMaxTime);
	}

	start() {
		this.players = Array.from(this.room.clients.keys());
		for (const player of this.players)
			this.playersShips.set(player, this.allShipsElementsCount);
		this.turnPlayerID = this.players[0];

		console.log('Game ' + this.room.id + ' starting!');
		console.log('Players:', this.players);
		// todo: isolate socket out of engine
		io.in(this.room.id.toString()).emit('gameStarted', this.players);
		this.startTurn();
	}
}