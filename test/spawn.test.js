import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { spawn } from '../src/index.js';

/** @param {number[][]} rows */
function board(rows) {
	return rows.map((row) => row.slice());
}

/** @param {number[]} values */
function sequenceRng(values) {
	let index = 0;
	return () => values[index++];
}

/** @param {number[][]} value */
function countTiles(value) {
	return value.flat().filter((cell) => cell !== 0).length;
}

describe('spawn', () => {
	it('puts a 2 in the first empty cell when rng returns 0', () => {
		const input = board([
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]);

		const output = spawn(input, sequenceRng([0, 0]));

		assert.equal(output[0][0], 2);
		assert.equal(countTiles(output), 1);
	});

	it('selects among empty cells using the first random value', () => {
		const input = board([
			[2, 4, 8, 16],
			[0, 2, 4, 8],
			[16, 8, 4, 2],
			[2, 4, 8, 16]
		]);
		// There is exactly one empty cell, so any cell roll picks it.
		const output = spawn(input, sequenceRng([0.75, 0.95]));

		assert.equal(output[1][0], 4);
		assert.equal(countTiles(output), 16);
	});

	it('adds exactly one tile and never overwrites an occupied cell', () => {
		const input = board([
			[2, 4, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]);

		const output = spawn(input, sequenceRng([0.3, 0.5]));

		assert.equal(countTiles(output), 3);
		assert.deepEqual(
			output.map((row, rowIndex) => row.map((value, colIndex) => (input[rowIndex][colIndex] ? value : null))),
			[
				[2, 4, null, null],
				[null, null, null, null],
				[null, null, null, null],
				[null, null, null, null]
			]
		);
	});

	it('spawns a 4 when the value roll is at least 0.9', () => {
		const empty = board([
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]);

		assert.equal(spawn(empty, sequenceRng([0, 0.899]))[0][0], 2);
		assert.equal(spawn(empty, sequenceRng([0, 0.9]))[0][0], 4);
	});

	it('returns an unchanged copy when the board is full and does not call rng', () => {
		const full = board([
			[2, 4, 2, 4],
			[4, 2, 4, 2],
			[2, 4, 2, 4],
			[4, 2, 4, 2]
		]);
		let calls = 0;

		const output = spawn(full, () => {
			calls += 1;
			return 0;
		});

		assert.deepEqual(output, full);
		assert.notEqual(output, full);
		assert.equal(calls, 0);
	});

	it('never mutates the input board', () => {
		const input = board([
			[2, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]);

		spawn(input, sequenceRng([0, 0]));

		assert.deepEqual(input, [
			[2, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]);
	});

	it('rejects a bad rng result', () => {
		const empty = board([
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]);

		assert.throws(() => spawn(empty, () => 1), RangeError);
		assert.throws(() => spawn(empty, () => -0.1), RangeError);
		assert.throws(() => spawn(empty, /** @type {any} */ (null)), TypeError);
	});
});
