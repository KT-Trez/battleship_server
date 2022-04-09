import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';
import {
	ClientToServerEvents,
	InterServerEvents,
	ServerToClientEvents,
	SocketData
} from './src/types/socket.js';
import {routeLogger, systemLogger} from './src/utils/loggerUtil.js';


const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
	cors: {
		credentials: true,
		origin: process.env.WEB_ORIGIN ?? '*'
	},
	serveClient: false
});

const port = process.env.SERVER_PORT ?? 3000;

process.on('uncaughtException', error => {
	systemLogger.log(0, 'Uncaught Exception:\n\t' + error.stack);
});


if (process.env.DEVELOPMENT)
	app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
		routeLogger.log(4, `${req.method} - ${req.ip} ${req.path} - ${req.secure ? 'secure' : 'not secure'}`)
		next();
	});
app.use(express.static('public'));
app.use(cors({
	credentials: true,
	origin: process.env.WEB_ORIGIN ?? '*'
}));


app.use(express.json());


export {
	io
}


httpServer.listen(port, () => systemLogger.log(4, 'Server started - :' + port));