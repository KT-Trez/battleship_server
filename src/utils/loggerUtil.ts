import Logger from '../classes/Logger.js';


/** Logger instance for all important event. All event will be saved to file */
const systemLogger = new Logger({
	file: {
		isEnabled: true,
		path: './logs'
	}
});
/** Logger instance for less important event, that won't be saved to file */
const routeLogger = new Logger({});

export {
	systemLogger,
	routeLogger
};