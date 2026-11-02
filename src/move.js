import { assertBoard, assertDirection, cloneBoard } from './board.js';

/**
 * Collapse one line so that its occupied cells sit at the front. Equal
 * neighbours merge once; a freshly merged tile cannot merge again in the same
 * move.
 *
 * @param {number[]} line Four cell values, ordered from the destination edge.
 * @returns {number[]} The collapsed line, padded with zeroes.
 */
function collapseLine(line) {
	const tiles = line.filter((value) => value !== 0);
	/** @type {number[]} */
	const collapsed = [];

	for (let index = 0; index < tiles.length; index += 1) {
		const current = tiles[index];
		const next = tiles[index + 1];

		if (current === next) {
			collapsed.push(current * 2);
			index += 1;
		} else {
			collapsed.push(current);
		}
	}

	while (collapsed.length < 4) collapsed.push(0);

	return collapsed;
}

/**
 * Read one row or column in the order tiles travel for `direction`. Index 0 is
 * always the edge the tiles are moving towards.
 *
 * @param {number[][]} board
 * @param {string} direction
 * @param {number} index Row index for left/right, column index for up/down.
 * @returns {number[]}
 */
function readLine(board, direction, index) {
	switch (direction) {
		case 'left':
			return board[index].slice();
		case 'right':
			return board[index].slice().reverse();
		case 'up':
			return board.map((row) => row[index]);
		case 'down':
			return board.map((row) => row[index]).reverse();
		default:
			throw new TypeError(`Unknown direction: ${direction}`);
	}
}

/**
 * Write one collapsed line back into the board.
 *
 * @param {number[][]} board
 * @param {string} direction
 * @param {number} index
 * @param {number[]} line
 * @returns {void}
 */
function writeLine(board, direction, index, line) {
	switch (direction) {
		case 'left':
			board[index] = line.slice();
			break;
		case 'right':
			board[index] = line.slice().reverse();
			break;
		case 'up':
			line.forEach((value, row) => {
				board[row][index] = value;
			});
			break;
		case 'down':
			line.slice().reverse().forEach((value, row) => {
				board[row][index] = value;
			});
			break;
		default:
			throw new TypeError(`Unknown direction: ${direction}`);
	}
}

/**
 * Slide every tile in `direction` and merge equal neighbours. Each tile may
 * take part in at most one merge per move, which is why 2 2 2 2 becomes 4 4 and
 * never 8.
 *
 * @param {import('./board.js').Board} board
 * @param {'up' | 'down' | 'left' | 'right'} direction
 * @returns {import('./board.js').Board} A new board; the input is untouched.
 */
export function move(board, direction) {
	assertBoard(board);
	assertDirection(direction);

	const next = cloneBoard(board);

	for (let index = 0; index < 4; index += 1) {
		writeLine(next, direction, index, collapseLine(readLine(board, direction, index)));
	}

	return next;
}
