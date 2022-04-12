import Board from './Board.js';
import Engine from './Engine.js';


export default class Game {
	static readonly map: Map<number, Game> = new Map<number, Game>();

	readonly board: Board;
	readonly clients: Map<string, string>;
	readonly engine: Engine;
	readonly id: number;

	constructor(id: number) {
		this.board = new Board(10, 10);
		this.engine = new Engine();

		this.clients = new Map<string, string>();
		this.id = id;
	}

	addClient(id: string, nick: string) {
		this.clients.set(id, nick);
	}

	save() {
		Game.map.set(this.id, this);
	}

	removeClient(id: string) {
		this.clients.delete(id);
	}
}