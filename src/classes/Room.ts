import Engine from './Engine.js';


export default class Room {
	static readonly map = new Map<number, Engine>();

	readonly clients: Map<string, string>;
	private clientsReadyCount: number;
	readonly id: number;

	constructor(id: number) {
		this.clients = new Map<string, string>();
		this.clientsReadyCount = 0;
		this.id = id;
	}

	addClient(id: string, nick: string) {
		this.clients.set(id, nick);
	}

	removeClient(id: string) {
		this.clients.delete(id);
	}

	setClientAsReady(ready: boolean) {
		if (ready)
			this.clientsReadyCount++;
		else
			this.clientsReadyCount--;
		return {
			clientsCount: this.clients.size,
			clientsReadyCount: this.clientsReadyCount
		}
	}

	save(engine: Engine) {
		Room.map.set(this.id, engine);
	}
}