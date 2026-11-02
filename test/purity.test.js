import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';

import * as core from '../src/index.js';

const sourceDirectory = fileURLToPath(new URL('../src/', import.meta.url));
const sourceFiles = readdirSync(sourceDirectory).filter((name) => name.endsWith('.js'));

describe('package purity', () => {
	it('only imports relative modules', () => {
		for (const file of sourceFiles) {
			const source = readFileSync(`${sourceDirectory}${file}`, 'utf8');

			for (const match of source.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
				assert.ok(
					match[1].startsWith('./'),
					`${file} imports "${match[1]}"; the package must be dependency-free`
				);
			}
		}
	});

	it('does not reference Svelte, the DOM, or browser storage', () => {
		const forbidden = /\b(document|window|localStorage|sessionStorage|navigator|requestAnimationFrame)\b/;

		for (const file of sourceFiles) {
			const source = readFileSync(`${sourceDirectory}${file}`, 'utf8');
			assert.doesNotMatch(source, /from\s+['"]svelte/, `${file} imports Svelte`);
			assert.doesNotMatch(source, forbidden, `${file} references a browser global`);
		}
	});

	it('exports the documented API', () => {
		assert.deepEqual(Object.keys(core).sort(), [
			'canMove',
			'createBoard',
			'createRng',
			'hasMoves',
			'move',
			'moveDetails',
			'spawn'
		]);
	});
});
