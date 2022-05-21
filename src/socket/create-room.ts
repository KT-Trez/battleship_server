import {Socket} from 'socket.io';
import Board from '../classes/Board.js';
import Engine from '../classes/Engine.js';
import Room from '../classes/Room.js';
import config from '../config.js';
import {ClientToServerEvents} from '../types/socket.js';


export default function (socket: Socket<ClientToServerEvents>) {
	socket.on('createRoom', callback => {
		// create room and it's components
		const roomID = parseInt(new Date().getTime() + (Math.round(Math.random() * 10000)).toString());

		const board = new Board(10, 10);
		const room = new Room(roomID);
		const engine = new Engine(board, room, config.Engine.turnMaxTime);

		// save room and send its ID to the client
		room.save(engine);
		callback(roomID);
	});
}