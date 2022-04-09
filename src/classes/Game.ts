import Board from './Board';
import Engine from './Engine';


export default class Game {
	static readonly map: Map<string, Game>

	readonly board: Board;
	readonly engine: Engine;
	readonly id: number;

	constructor(id: number) {
		this.board = new Board(10, 10);
		this.engine = new Engine();

		this.id = id;
	}
}