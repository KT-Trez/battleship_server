import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';
import {gameRouter} from './src/routes/game.js';
import {
	ClientToServerEvents,
	InterServerEvents,
	ServerToClientEvents,
	SocketData
} from './src/types/socket.js';
import {routeLogger, systemLogger} from './src/utils/loggerUtil.js';
import socketUtil, {loadSocketEvents} from './src/utils/socketUtil.js';


// initialize express
const app = express();
// initialize http server with express to pass it for the socket.io
const httpServer = createServer(app);
// initialize socket.io
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
	cors: {
		credentials: true,
		origin: process.env.WEB_ORIGIN ?? '*'
	},
	serveClient: false
});

const port = process.env.SERVER_PORT ?? 3000;

// handle all uncaught exceptions
process.on('uncaughtException', error => {
	systemLogger.log(0, 'Uncaught Exception:\n\t' + error.stack);
});


// log all incoming connections in development mode
if (process.env.DEVELOPMENT)
	app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
		routeLogger.log(4, `${req.method} - ${req.ip} ${req.path} - ${req.secure ? 'secure' : 'not secure'}`)
		next();
	});
// load public resources & set cors
app.use(express.static('public'));
app.use(cors({
	credentials: false,
	origin: process.env.WEB_ORIGIN ?? '*'
}));


// load all routes
app.use('/game', gameRouter);

// load socket events and add them for all incoming connections
await socketUtil();
io.on('connection', async socket => {
	loadSocketEvents(socket);
});

export {
	io
}


// start server
httpServer.listen(port, () => systemLogger.log(4, 'Server started - :' + port));