import {Socket} from 'socket.io';
import Room from '../classes/Room.js';


export default function (socket: Socket) {
	socket.on('changeStatus', (roomID, readyStatus) => {
		// check input
		if (!Room.map.has(roomID))
			throw new Error('There is no room of given ID: ' + roomID);

		// change client's status
		const engine = Room.map.get(roomID);
		const readyState = engine.room.toggleClientReadyStatus(readyStatus);

		// start game if all clients are ready
		if (readyState.clientsReadyCount === readyState.clientsCount && readyState.clientsCount > 1)
			engine.start();
	});
}