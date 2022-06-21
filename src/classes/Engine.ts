import {io} from '../server.js';
import config from '../config.js';
import {Client} from '../types/interfaces.js';
import {debugLogger} from '../utils/loggerUtil.js';
import Board from './Board.js';
import Room from './Room.js';


export default class Engine {
	board: Board;
	room: Room;

	readonly allShipsElementsCount = 0;
	private gameEnded = false;
	private gameStarted = false;
	private players: Client[];
	playersShips: Map<string, number>
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
			debugLogger.log(4, this.room.id + ': ' + this.turnPlayerID + ' wins!');

			// todo: add multiple players
			io.in(this.room.id.toString()).emit('win', this.players[this.turnPlayerIndex].nick);
			return true;
		}
		return false;
	}

	hasGameEnded() {
		return this.gameEnded;
	}

	private nextPlayer() {
		this.turnPlayerIndex = (this.turnPlayerIndex + 1) % this.players.length;
		this.turnPlayerID = this.players[this.turnPlayerIndex].id;
	}

	registerShot(playerID: string, x: number, y: number) {
		if (playerID !== this.turnPlayerID)
			throw new Error('Invalid player tried to register move');

		const tile = this.board.getTile(x, y);
		if (tile.hasBeenShotAtByPlayer(playerID))
			throw new Error('Position has already been fired at');

		tile.addShooters(playerID);

		const enemyForcesIDsArr = tile.getShipownersExcludingOne(playerID);
		if (enemyForcesIDsArr.length > 0) {
			io.to(this.room.id.toString()).emit('shot', this.turnPlayerID, 'hit', {x, y}, enemyForcesIDsArr);

			let hasSomeoneWon = false;
			for (const player of enemyForcesIDsArr) {
				const playerShipsCount = this.playersShips.get(player);
				this.playersShips.set(player, playerShipsCount - 1);

				hasSomeoneWon = this.checkForWin(playerShipsCount - 1);
			}

			if (!hasSomeoneWon)
				this.startTurn();

			return true;
		}

		io.to(this.room.id.toString()).emit('shot', this.turnPlayerID, 'miss', {x, y}, this.players.filter(player => player.id !== this.turnPlayerID).map(player => player.id));
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
		if (this.gameStarted)
			throw new Error('Game has already started');
		this.gameStarted = true;

		this.players = this.room.getClients();
		this.turnPlayerID = this.players[0].id;

		// todo: debug only, remove later
		debugLogger.log(4, 'Starting game: ' + this.room.id);

		io.in(this.room.id.toString()).emit('gameStarted', this.players);
		this.startTurn();
	}
}