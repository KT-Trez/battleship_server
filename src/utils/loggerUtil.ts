import Logger from '../classes/Logger.js';


const systemLogger = new Logger({
	file: {
		isEnabled: true,
		path: './logs'
	}
});
const routeLogger = new Logger({});

export {
	systemLogger,
	routeLogger
};