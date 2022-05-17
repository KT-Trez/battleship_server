import * as fs from 'fs';
import moment from 'moment';


/** Full log level options */
interface LevelConfig extends DefaultLevelConfig {
	/** level's color in ASCII console notation */
	color?: string;
	/** level's name */
	name?: string;
}

/** Default config options loaded for all log levels */
interface DefaultLevelConfig {
	/** settings used to save logs to file */
	file?: FileSettings;
	/** format in which logs timestamp will be formatted */
	timeFormat?: string;
}

/** Settings used to save logs to file */
type FileSettings = {
	/** flag that enables/disables saving logs to file */
	isEnabled: boolean;
	/** path to logs dir */
	path: string;
};

export default class Logger {
	config: LevelConfig[];
	maxLevelLength: number;

	/**
	 * Creates new logger config instance
	 * @param defaultConfig - default config for all log levels.
	 */
	constructor(defaultConfig: DefaultLevelConfig) {
		const levelsColors = ['\x1b[0;35m', '\x1b[0;31m', '\x1b[0;33m', '\x1b[0;32m', '\x1b[0;36m', '\x1b[0;37;45m'];
		const levelsConfig = [];
		const levelsNames = ['fatal', 'error', 'warning', 'success', 'info', 'debug'];

		for (let i = 0; i < 6; i++) {
			levelsConfig.push({
				color: levelsColors[i],
				file: {
					isEnabled: defaultConfig.file ? defaultConfig.file.isEnabled : false,
					path: defaultConfig.file ?  defaultConfig.file.path : null
				},
				name: levelsNames[i],
				timeFormat: defaultConfig.timeFormat ?? 'D MMM YYYY · HH:mm:ss.SSS'
			});
		}

		this.config = levelsConfig;

		this.maxLevelLength = 0;
		this.calcMaxLevelLength();

		if (defaultConfig.file && defaultConfig.file.isEnabled)
			this.createLogsDir(defaultConfig.file.path);
	}

	/**
	 * Calculate the longest level's name length.
	 * @private
	 */
	private calcMaxLevelLength() {
		for (let i = 0; i < this.config.length; i++) {
			const levelLength = this.config[i].name.length;
			if (levelLength > this.maxLevelLength)
				this.maxLevelLength = levelLength;
		}
	}

	/**
	 * Creates directory in which logs will be saved.
	 * @param {string} path - path to directory that will be created.
	 * @private
	 */
	private createLogsDir(path: string) {
		if (!fs.existsSync(path))
			fs.mkdir(path, err => {
				if (err)
					throw new Error('Cannot create logs directory: ' + err.message);
			});
	}

	/**
	 * Logs message using created config.
	 * @param {0 | 1 | 2 | 3 | 4 | 5} level - log level.
	 * @param {string} message - log message.
	 * @param object - object that will be stringifies-ed to JSON and attached to log.
	 */
	log(level: 0 | 1 | 2 | 3 | 4 | 5, message: string, object?: object) {
		const levelInfo = this.config[level].name.toLocaleUpperCase();
		const levelInfoColor = this.config[level].color + this.config[level].name.toLocaleUpperCase() + (this.config[level].color ? '\x1b[0m' : '');
		let spaces = '';
		for (let i = 0; i < this.maxLevelLength - this.config[level].name.length; i++)
			spaces += ' ';
		const time = moment(new Date()).format(this.config[level].timeFormat);

		const log = `${spaces} · ${time} | ${message}${object ? ' ' + JSON.stringify(object) : ''}`

		console.log(levelInfoColor + log);
		if (this.config[level].file.isEnabled)
			this.saveToFile(level, levelInfo + log);
	}

	/**
	 * Reconfigures multiple log levels by loading array of {level, config} values.
	 * @param {{level: number, config: LevelConfig}[]} settings - level and its config that will be used to reconfiguration.
	 * @return {this}
	 */
	reconfigure(settings: {level: number, config: LevelConfig}[]) {
		for (let i = 0; i < settings.length; i++) {
			this.config[settings[i].level] = settings[i].config;
			if (settings[i].config.file && settings[i].config.file.isEnabled)
				this.createLogsDir(settings[i].config.file.path);
		}
		return this;
	}

	/**
	 * Reconfigures single log level.
	 * @param {0 | 1 | 2 | 3 | 4 | 5} level - level which will be reconfigured.
	 * @param config - config that will be used to reconfiguration.
	 * @return {this}
	 */
	reconfigureLevel(level: 0 | 1 | 2 | 3 | 4 | 5, config: LevelConfig) {
		Object.assign(this.config[level], config);
		if (config.file && config.file.isEnabled)
			this.createLogsDir(config.file.path);
		return this;
	}

	/**
	 * Saves log to file.
	 * @param {0 | 1 | 2 | 3 | 4 | 5} level - log's level.
	 * @param {string} message - log's message.
	 * @private
	 */
	private saveToFile(level: 0 | 1 | 2 | 3 | 4 | 5 , message: string) {
		fs.writeFile(this.config[level].file.path + '/' + moment(new Date()).format('DD-MM-YYYY') + '.log', message + '\n', {
			flag: 'a'
		}, err => {
			if (err)
				throw new Error('Cannot save logs to file: ' + err.message);
		});
	}
}