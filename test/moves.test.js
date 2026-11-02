import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { canMove, hasMoves } from '../src/index.js';

/** @param {number[][]} rows */
function board(rows) {
	return rows.map((row) => row.slice());
}

const DEAD_BOARD = board([
	[2, 4, 2, 4],
	[4, 2, 4, 2],
	[2, 4, 2, 4],
	[4, 2, 4, 2]
]);

describe('canMove', () => {
	it('is false when a direction would not change the board', () => {
		const input = board([
			[2, 0, 0, 0],
			[4, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]);

		assert.equal(canMove(input, 'left'), false);
		assert.equal(canMove(input, 'right'), true);
		assert.equal(canMove(input, 'up'), false);
		assert.equal(canMove(input, 'down'), true);
	});

	it('is true only in the directions where a merge is available', () => {
		const input = board([
			[2, 4, 2, 4],
			[2, 8, 4, 8],
			[4, 16, 8, 16],
			[8, 32, 16, 32]
		]);

		assert.equal(canMove(input, 'left'), false);
		assert.equal(canMove(input, 'right'), false);
		assert.equal(canMove(input, 'up'), true);
		assert.equal(canMove(input, 'down'), true);
	});

	it('is false in every direction on a dead full board', () => {
		assert.equal(canMove(DEAD_BOARD, 'left'), false);
		assert.equal(canMove(DEAD_BOARD, 'right'), false);
		assert.equal(canMove(DEAD_BOARD, 'up'), false);
		assert.equal(canMove(DEAD_BOARD, 'down'), false);
	});

	it('rejects unknown directions', () => {
		assert.throws(() => canMove(DEAD_BOARD, 'sideways'), TypeError);
	});
});

describe('hasMoves', () => {
	it('is false only when the board is full and no neighbours match', () => {
		assert.equal(hasMoves(DEAD_BOARD), false);
	});

	it('is true when at least one pair can merge', () => {
		const input = board([
			[2, 4, 2, 4],
			[4, 2, 4, 2],
			[2, 4, 4, 4],
			[4, 2, 4, 2]
		]);

		assert.equal(hasMoves(input), true);
	});

	it('is true while the board still has an empty cell', () => {
		const input = board([
			[0, 4, 2, 4],
			[4, 2, 4, 2],
			[2, 4, 2, 4],
			[4, 2, 4, 2]
		]);

		assert.equal(hasMoves(input), true);
	});

	it('rejects a malformed board', () => {
		assert.throws(() => hasMoves([[1, 2, 3, 4]]), TypeError);
	});
});
