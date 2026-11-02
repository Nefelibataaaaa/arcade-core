import { assertBoard, cloneBoard, emptyCells } from './board.js';

/**
 * Place a new tile in a random empty cell. The tile is a 2 with probability
 * 0.9 and a 4 with probability 0.1.
 *
 * `rng` is any function that returns a number in [0, 1); pass a seeded
 * generator to make spawning reproducible. When the board is full the board
 * is returned unchanged and `rng` is not called.
 *
 * @param {import('./board.js').Board} board
 * @param {() => number} [rng]
 * @returns {import('./board.js').Board} A new board; the input is untouched.
 */
export function spawn(board, rng = Math.random) {
	assertBoard(board);

	if (typeof rng !== 'function') {
		throw new TypeError('rng must be a function that returns a number in [0, 1).');
	}

	const next = cloneBoard(board);
	const cells = emptyCells(board);

	if (cells.length === 0) return next;

	const roll = rng();
	if (!(roll >= 0 && roll < 1)) {
		throw new RangeError('rng must return a number in [0, 1).');
	}

	const [row, col] = cells[Math.floor(roll * cells.length)];
	const valueRoll = rng();
	if (!(valueRoll >= 0 && valueRoll < 1)) {
		throw new RangeError('rng must return a number in [0, 1).');
	}

	next[row][col] = valueRoll < 0.9 ? 2 : 4;

	return next;
}
