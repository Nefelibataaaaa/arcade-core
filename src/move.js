import { moveDetails } from './details.js';

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
	return moveDetails(board, direction).board;
}
