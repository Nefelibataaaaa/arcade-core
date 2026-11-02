import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { move, moveDetails } from '../src/index.js';

/** @param {number[][]} rows */
function board(rows) {
	return rows.map((row) => row.slice());
}

/** @param {Array<{ from: { row: number, col: number }, to: { row: number, col: number } }>} moves */
function movePairs(moves) {
	return moves
		.map(({ from, to }) => `(${from.row},${from.col})->(${to.row},${to.col})`)
		.sort();
}

describe('moveDetails', () => {
	it('reports both sources of every merge and the score gained', () => {
		const input = board([
			[2, 2, 2, 2],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]);

		const details = moveDetails(input, 'left');

		assert.equal(details.moved, true);
		assert.deepEqual(details.board, [
			[4, 4, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]);
		assert.equal(details.gained, 8);
		assert.equal(details.merges.length, 2);
		assert.deepEqual(details.merges[0], {
			row: 0,
			col: 0,
			value: 4,
			sources: [
				{ row: 0, col: 0 },
				{ row: 0, col: 1 }
			]
		});
		assert.deepEqual(details.merges[1], {
			row: 0,
			col: 1,
			value: 4,
			sources: [
				{ row: 0, col: 2 },
				{ row: 0, col: 3 }
			]
		});
	});

	it('maps every occupied source cell to exactly one destination', () => {
		const input = board([
			[2, 0, 4, 8],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]);

		const details = moveDetails(input, 'left');

		assert.deepEqual(movePairs(details.moves), [
			'(0,0)->(0,0)',
			'(0,2)->(0,1)',
			'(0,3)->(0,2)'
		]);
		assert.equal(details.moves.length, 3);
	});

	it('reports moved: false and no gain when a direction is blocked', () => {
		const input = board([
			[2, 4, 2, 4],
			[4, 2, 4, 2],
			[2, 4, 2, 4],
			[4, 2, 4, 2]
		]);

		const details = moveDetails(input, 'left');

		assert.equal(details.moved, false);
		assert.equal(details.gained, 0);
		assert.deepEqual(details.merges, []);
		assert.ok(details.moves.every(({ from, to }) => from.row === to.row && from.col === to.col));
	});

	it('handles right, up, and down with the same rules', () => {
		const input = board([
			[2, 2, 0, 0],
			[2, 2, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]);

		const right = moveDetails(input, 'right');
		assert.deepEqual(right.board, [
			[0, 0, 0, 4],
			[0, 0, 0, 4],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]);
		assert.equal(right.gained, 8);

		const down = moveDetails(input, 'down');
		assert.deepEqual(down.board, [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[4, 4, 0, 0]
		]);
		assert.equal(down.gained, 8);
	});

	it('produces the same board as move for every direction', () => {
		const boards = [
			board([
				[2, 0, 2, 4],
				[4, 4, 8, 0],
				[0, 0, 0, 0],
				[2, 2, 2, 2]
			]),
			board([
				[2, 4, 2, 4],
				[4, 2, 4, 2],
				[2, 4, 2, 4],
				[4, 2, 4, 2]
			]),
			board([
				[0, 0, 0, 2],
				[0, 0, 2, 0],
				[0, 2, 0, 0],
				[2, 0, 0, 0]
			])
		];

		for (const input of boards) {
			for (const direction of ['up', 'down', 'left', 'right']) {
				assert.deepEqual(moveDetails(input, direction).board, move(input, direction));
			}
		}
	});

	it('never mutates the input board', () => {
		const input = board([
			[2, 2, 4, 4],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]);
		const snapshot = board(input);

		moveDetails(input, 'left');

		assert.deepEqual(input, snapshot);
	});

	it('validates its arguments', () => {
		assert.throws(() => moveDetails([[1, 2, 3, 4]], 'left'), TypeError);
		assert.throws(
			() =>
				moveDetails(
					[
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0]
					],
					'left-ish'
				),
			TypeError
		);
	});
});
