import {
	assertBoard,
	assertDirection,
	BOARD_SIZE,
	boardsEqual,
	emptyBoard
} from './board.js';
import { groupLine, lineCoordinates } from './lines.js';

/**
 * @typedef {{ row: number, col: number }} Coordinate
 * @typedef {{ from: Coordinate, to: Coordinate, value: number, merged: boolean }} TileMove
 * @typedef {{ row: number, col: number, value: number, sources: Coordinate[] }} Merge
 * @typedef {{
 *   board: number[][],
 *   moved: boolean,
 *   gained: number,
 *   moves: TileMove[],
 *   merges: Merge[]
 * }} MoveDetails
 */

/**
 * Like `move`, but also describes how every tile travelled. This is the same
 * pure function used internally by `move`; the extra data is intended for UI
 * layers that want to animate slides and merges.
 *
 * `moves` has one entry per occupied source cell. In a merge two entries share
 * the same destination. `merges` lists those destinations, their new value, and
 * the source cells. `gained` is the sum of all newly merged tile values, i.e.
 * the 2048 score increase for this move.
 *
 * @param {number[][]} board
 * @param {'up' | 'down' | 'left' | 'right'} direction
 * @returns {MoveDetails}
 */
export function moveDetails(board, direction) {
	assertBoard(board);
	assertDirection(direction);

	const next = emptyBoard();
	/** @type {TileMove[]} */
	const moves = [];
	/** @type {Merge[]} */
	const merges = [];
	let gained = 0;

	for (let lineIndex = 0; lineIndex < BOARD_SIZE; lineIndex += 1) {
		const coordinates = lineCoordinates(direction, lineIndex);
		const values = coordinates.map(([row, col]) => board[row][col]);
		const groups = groupLine(values);

		groups.forEach((group, destinationIndex) => {
			const [row, col] = coordinates[destinationIndex];
			next[row][col] = group.value;

			const sources = group.sourceIndices.map((sourceIndex) => {
				const [sourceRow, sourceCol] = coordinates[sourceIndex];
				return { row: sourceRow, col: sourceCol };
			});

			const merged = sources.length > 1;

			for (const source of sources) {
				moves.push({
					from: source,
					to: { row, col },
					value: group.value,
					merged
				});
			}

			if (merged) {
				merges.push({ row, col, value: group.value, sources });
				gained += group.value;
			}
		});
	}

	return {
		board: next,
		moved: !boardsEqual(board, next),
		gained,
		moves,
		merges
	};
}
