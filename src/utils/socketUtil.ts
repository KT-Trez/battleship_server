import * as fs from 'fs';
import {Socket} from 'socket.io';
import {systemLogger} from './loggerUtil.js';


export default async function socketUtil(socket: Socket) {
	await fs.readdir('./src/socket', async (err, socketFiles) => {
		if (err)
			return systemLogger.log(1, 'Cannot load socket events: ' + err.message);

		for (let i = 0; i < socketFiles.length; i++) {
			const socketEvent = await import('../socket/' + socketFiles[i].replace('.ts', '.js'));
			socketEvent.default(socket);
		}
	});

	systemLogger.log(3, 'All socket events loaded');
}