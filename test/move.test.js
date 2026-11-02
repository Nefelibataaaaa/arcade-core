import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { move } from '../src/index.js';

/** @param {number[][]} rows */
function board(rows) {
	return rows.map((row) => row.slice());
}

describe('move', () => {
	it('merges each tile at most once per move', () => {
		const input = board([
			[2, 2, 2, 2],
			[4, 4, 8, 0],
			[2, 2, 2, 0],
			[2, 4, 4, 0]
		]);

		assert.deepEqual(move(input, 'left'), [
			[4, 4, 0, 0],
			[8, 8, 0, 0],
			[4, 2, 0, 0],
			[2, 8, 0, 0]
		]);
	});

	it('merges the pair closest to the destination edge first', () => {
		const input = board([
			[2, 0, 2, 2],
			[2, 2, 2, 0],
			[4, 4, 8, 8],
			[2, 2, 4, 4]
		]);

		assert.deepEqual(move(input, 'left'), [
			[4, 2, 0, 0],
			[4, 2, 0, 0],
			[8, 16, 0, 0],
			[4, 8, 0, 0]
		]);
	});

	it('collapses gaps without merging unequal tiles', () => {
		const input = board([
			[0, 2, 0, 4],
			[8, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 16, 32]
		]);

		assert.deepEqual(move(input, 'left'), [
			[2, 4, 0, 0],
			[8, 0, 0, 0],
			[0, 0, 0, 0],
			[16, 32, 0, 0]
		]);
	});

	it('moves right by reversing each row', () => {
		const input = board([
			[2, 2, 2, 2],
			[4, 4, 8, 0],
			[0, 0, 0, 0],
			[2, 0, 0, 2]
		]);

		assert.deepEqual(move(input, 'right'), [
			[0, 0, 4, 4],
			[0, 0, 8, 8],
			[0, 0, 0, 0],
			[0, 0, 0, 4]
		]);
	});

	it('moves up by collapsing columns', () => {
		const input = board([
			[2, 0, 0, 4],
			[2, 0, 0, 4],
			[4, 0, 0, 8],
			[4, 0, 0, 8]
		]);

		assert.deepEqual(move(input, 'up'), [
			[4, 0, 0, 8],
			[8, 0, 0, 16],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]);
	});

	it('moves down by reversing each column', () => {
		const input = board([
			[2, 0, 0, 4],
			[2, 0, 0, 4],
			[4, 0, 0, 8],
			[4, 0, 0, 8]
		]);

		assert.deepEqual(move(input, 'down'), [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[4, 0, 0, 8],
			[8, 0, 0, 16]
		]);
	});

	it('returns a board with the same values when nothing can move', () => {
		const input = board([
			[2, 4, 2, 4],
			[4, 2, 4, 2],
			[2, 4, 2, 4],
			[4, 2, 4, 2]
		]);

		const output = move(input, 'left');

		assert.deepEqual(output, input);
		assert.notEqual(output, input);
		assert.notEqual(output[0], input[0]);
	});

	it('never mutates the input board', () => {
		const input = board([
			[2, 2, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]);
		const snapshot = board(input);

		move(input, 'left');

		assert.deepEqual(input, snapshot);
	});

	it('accepts a board with values above 2048', () => {
		const input = board([
			[2048, 2048, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]);

		assert.deepEqual(move(input, 'left'), [
			[4096, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]);
	});

	it('rejects a malformed board', () => {
		assert.throws(() => move([[2, 2, 2]], 'left'), TypeError);
		assert.throws(() => move([[2, 2, 2, -1]], 'left'), TypeError);
		assert.throws(
			() =>
				move(
					[
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0]
					],
					'left'
				),
			TypeError
		);
	});

	it('rejects an unknown direction', () => {
		const input = board([
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]);

		assert.throws(() => move(input, 'north-east'), TypeError);
	});
});
