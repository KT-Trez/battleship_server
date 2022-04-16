import {Socket} from 'socket.io';
import Room from '../classes/Room.js';


export default function (socket: Socket) {
	socket.on('startGame', (roomID, readyStatus) => {
		const engine = Room.map.get(roomID);
		const readyState = engine.room.setClientAsReady(readyStatus);

		if (readyState.clientsReadyCount === readyState.clientsCount && readyState.clientsCount > 1)
			engine.start();

		console.log(readyState);
	});
}