import {Socket} from 'socket.io';
import {io} from '../../server.js';
import Game from '../classes/Game.js';


export default function (socket: Socket) {
	socket.on('leaveRoom', (roomID) => {
		socket.leave(roomID.toString());

		const game = Game.map.get(roomID);
		game.removeClient(socket.id);

		// delete room if all clients left
		if (game.clients.size === 0) {
			io.socketsLeave(roomID.toString());
			Game.map.delete(roomID);
		}
	});
}