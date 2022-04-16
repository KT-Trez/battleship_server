import {Socket} from 'socket.io';
import Board from '../classes/Board.js';
import Engine from '../classes/Engine.js';
import Room from '../classes/Room.js';


export default function (socket: Socket) {
	socket.on('createRoom', callback => {
		const roomID = parseInt(new Date().getTime() + (Math.round(Math.random() * 10000)).toString());

		const board = new Board(10, 10);
		const room = new Room(roomID);
		const engine = new Engine(board, room, 60000);

		room.save(engine);

		callback(roomID);
	});
}