import Engine from './Engine.js';
import {Client} from '../types/interfaces.js';


export default class Room {
	static readonly map = new Map<number, Engine>();

	private readonly clients: Client[] = [];
	private clientsReadyCount = 0;
	readonly id: number;

	constructor(gameID: number) {
		this.id = gameID;
	}

	addClient(clientID: string, nick: string) {
		this.clients.push({
			id: clientID,
			nick: nick ?? 'unnamed'
		});
	}

	getClients() {
		return this.clients;
	}

	removeClient(clientID: string) {
		const client = this.clients.find(client => client.id === clientID);
		const clientIndex = this.clients.indexOf(client);
		this.clients.splice(clientIndex, 1);
	}

	save(engine: Engine) {
		Room.map.set(this.id, engine);
	}

	toggleClientReadyStatus(isReady: boolean) {
		if (isReady)
			this.clientsReadyCount++;
		else
			this.clientsReadyCount--;
		return {
			clientsCount: this.clients.length,
			clientsReadyCount: this.clientsReadyCount
		}
	}
}