import * as fs from 'fs';
import {Socket} from 'socket.io';
import {systemLogger} from './loggerUtil.js';

const socketEventsArr: Function[] = [];
/**
 * Loads all socket events which will be added to all connecting sockets
 * @returns {Promise<void>}
 */
export default async function socketUtil() {
	// read directory with all socket events
	await fs.readdir('./src/socket', async (err, socketFiles) => {
		// error handling
		if (err)
			return systemLogger.log(1, 'Cannot read directory with socket events: ' + err.message);

		// import event and load it for the socket
		for (let i = 0; i < socketFiles.length; i++) {
			const socketEvent = await import('../socket/' + socketFiles[i].replace('.ts', '.js'));
			socketEventsArr.push(socketEvent.default);
		}
	});
}

/**
 * Loads all events for connecting socket
 * @param {Socket} socket - connecting socket
 * @returns {Promise<void>}
 */
export function loadSocketEvents(socket: Socket) {
	for (const socketEvent of socketEventsArr)
		socketEvent(socket);

	systemLogger.log(3, 'All events for socket: ' + socket.id + ' loaded');
}