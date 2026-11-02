/**
 * Shared board helpers for arcade-core.
 *
 * A board is a 4 x 4 array of numbers. Each cell is either 0 (empty) or a
 * positive tile value. Functions in this package never mutate the board they
 * are given; a new board is returned instead.
 *
 * @typedef {number[][]} Board
 */

export const BOARD_SIZE = 4;

export const DIRECTIONS = Object.freeze(['up', 'down', 'left', 'right']);

const DIRECTION_SET = new Set(DIRECTIONS);

/**
 * Throw a TypeError if `board` is not a 4 x 4 matrix of non-negative integers.
 * Exported for consumers that want to validate saved games before calling the
 * rest of the API.
 *
 * @param {Board} board
 * @returns {void}
 */
export function assertBoard(board) {
	if (!Array.isArray(board) || board.length !== BOARD_SIZE) {
		throw new TypeError(`A board must be an array of ${BOARD_SIZE} rows.`);
	}

	for (const row of board) {
		if (!Array.isArray(row) || row.length !== BOARD_SIZE) {
			throw new TypeError(`Every board row must contain exactly ${BOARD_SIZE} cells.`);
		}

		for (const value of row) {
			if (!Number.isInteger(value) || value < 0) {
				throw new TypeError('Every cell must be a non-negative integer.');
			}
		}
	}
}

/**
 * @param {string} direction
 * @returns {void}
 */
export function assertDirection(direction) {
	if (!DIRECTION_SET.has(direction)) {
		throw new TypeError(`Direction must be one of: ${DIRECTIONS.join(', ')}.`);
	}
}

/**
 * @returns {Board} A new 4 x 4 board filled with zeroes.
 */
export function emptyBoard() {
	return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
}

/**
 * @param {Board} board
 * @returns {Board} A new board with the same values.
 */
export function cloneBoard(board) {
	return board.map((row) => row.slice());
}

/**
 * @param {Board} a
 * @param {Board} b
 * @returns {boolean} True when both boards hold identical values.
 */
export function boardsEqual(a, b) {
	for (let row = 0; row < BOARD_SIZE; row += 1) {
		for (let col = 0; col < BOARD_SIZE; col += 1) {
			if (a[row][col] !== b[row][col]) return false;
		}
	}

	return true;
}

/**
 * @param {Board} board
 * @returns {Array<[number, number]>} Coordinates of every empty cell.
 */
export function emptyCells(board) {
	/** @type {Array<[number, number]>} */
	const cells = [];

	for (let row = 0; row < BOARD_SIZE; row += 1) {
		for (let col = 0; col < BOARD_SIZE; col += 1) {
			if (board[row][col] === 0) cells.push([row, col]);
		}
	}

	return cells;
}
