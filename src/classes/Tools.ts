/**
 * Public class to collect all useful and generic tools
 */
export default class Tools {
	/**
	 * Gets inclusive number between min and max range
	 * @param {number} min - start value of a range
	 * @param {number} max - end value of a range
	 * @returns {number} - inclusive number between min and max range
	 */
	static getRandomIntInclusive(min: number, max: number) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
}