import {Socket} from 'socket.io';
import Game from '../classes/Game.js';


export default function (socket: Socket) {
	socket.on('joinRoom', (roomID, nick) => {
		socket.join(roomID.toString());

		const game = Game.map.get(roomID);
		game.addClient(socket.id, nick);
	});
}