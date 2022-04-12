import {Socket} from 'socket.io';
import Game from '../classes/Game.js';


export default function (socket: Socket) {
	socket.on('createRoom', callback => {
		const roomID = parseInt(new Date().getTime() + (Math.round(Math.random() * 10000)).toString());
		const room = new Game(roomID);

		room.save();
		callback(roomID);
	});
}