import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createBoard, createRng, spawn } from '../src/index.js';

/** @param {() => number} rng */
function take(rng, count) {
	return Array.from({ length: count }, () => rng());
}

describe('createRng', () => {
	it('returns the same sequence for the same seed', () => {
		assert.deepEqual(take(createRng('arcade'), 8), take(createRng('arcade'), 8));
		assert.deepEqual(take(createRng(2026), 8), take(createRng(2026), 8));
	});

	it('treats a numeric seed and its string form identically', () => {
		assert.deepEqual(take(createRng(12345), 6), take(createRng('12345'), 6));
	});

	it('returns different sequences for different seeds', () => {
		assert.notDeepEqual(take(createRng('seed-a'), 8), take(createRng('seed-b'), 8));
	});

	it('always returns numbers in [0, 1)', () => {
		for (const value of take(createRng('range-check'), 1000)) {
			assert.ok(value >= 0 && value < 1);
		}
	});

	it('keeps generators independent even when they share a seed', () => {
		const first = createRng('independent');
		const second = createRng('independent');

		assert.equal(first(), second());
		assert.equal(first(), second());
	});

	it('drives spawn deterministically', () => {
		const empty = Array.from({ length: 4 }, () => Array(4).fill(0));

		const firstBoard = spawn(empty, createRng('spawn-seed'));
		const secondBoard = spawn(empty, createRng('spawn-seed'));

		assert.deepEqual(firstBoard, secondBoard);
	});

	it('drives createBoard deterministically', () => {
		assert.deepEqual(createBoard(createRng('opening')), createBoard(createRng('opening')));
	});
});
