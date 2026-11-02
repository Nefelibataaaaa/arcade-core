import { assertBoard, assertDirection, boardsEqual, DIRECTIONS } from './board.js';
import { move } from './move.js';

/**
 * True when pushing the board in `direction` would change at least one cell.
 *
 * @param {import('./board.js').Board} board
 * @param {'up' | 'down' | 'left' | 'right'} direction
 * @returns {boolean}
 */
export function canMove(board, direction) {
	assertBoard(board);
	assertDirection(direction);

	return !boardsEqual(board, move(board, direction));
}

/**
 * True when at least one direction would change the board. This is the "game
 * is still playable" check: it becomes false only when the board is full and no
 * two orthogonally adjacent tiles are equal.
 *
 * @param {import('./board.js').Board} board
 * @returns {boolean}
 */
export function hasMoves(board) {
	assertBoard(board);

	return DIRECTIONS.some((direction) => canMove(board, direction));
}
