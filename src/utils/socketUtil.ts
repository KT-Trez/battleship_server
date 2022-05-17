import * as fs from 'fs';
import {Socket} from 'socket.io';
import {systemLogger} from './loggerUtil.js';


/**
 * Loads all events for connecting socket. Events are dynamically read from designated directory
 * @param {Socket} socket - connecting socket
 * @returns {Promise<void>}
 */
export default async function socketUtil(socket: Socket) {
	// todo: read events only once and then load from cache
	// read directory with all socket events
	await fs.readdir('./src/socket', async (err, socketFiles) => {
		// error handling
		if (err)
			return systemLogger.log(1, 'Socket: ' + socket.id + ' cannot load socket events: ' + err.message);

		// import event and load it for the socket
		for (let i = 0; i < socketFiles.length; i++) {
			const socketEvent = await import('../socket/' + socketFiles[i].replace('.ts', '.js'));
			socketEvent.default(socket);
		}
	});

	systemLogger.log(3, 'All events for socket: ' + socket.id + ' loaded');
}