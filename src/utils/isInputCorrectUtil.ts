import {debugLogger} from './loggerUtil.js';


/**
 * Checks if input is correct
 * @param {{input: any, type: "string" | "number" | "boolean"}} args - array of inputs and theirs expected types
 * @returns {boolean} - whenever all inputs have correct types or not
 */
export default function isInputCorrectUtil(...args: { input: any, type: 'string' | 'number' | 'boolean' }[]) {
	let checkFlag = true;
	for (const arg of args)
		if (typeof arg.input !== arg.type) {
			if (process.env.development)
				debugLogger.log(2, `Incorrect input, expected: ${arg.type}, got: ${typeof arg.input}`, arg.input);
			checkFlag = false;
		}
	return checkFlag;
}