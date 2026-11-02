/**
 * Hash a string into a 32-bit unsigned integer (the xmur3 approach). The same
 * seed always produces the same hash on every platform.
 *
 * @param {string} text
 * @returns {number}
 */
function hashSeed(text) {
	let hash = 1779033703 ^ text.length;

	for (let index = 0; index < text.length; index += 1) {
		hash = Math.imul(hash ^ text.charCodeAt(index), 3432918353);
		hash = (hash << 13) | (hash >>> 19);
	}

	return hash >>> 0;
}

/**
 * Create a deterministic pseudo-random number generator (mulberry32). Every
 * call returns a value in [0, 1), and the same seed always produces the same
 * sequence. Use it as the `rng` argument of `spawn` or `createBoard` when a
 * game needs to be reproducible.
 *
 * The returned function keeps its own internal counter, so two generators with
 * the same seed are independent of each other.
 *
 * @param {string | number} seed
 * @returns {() => number}
 */
export function createRng(seed) {
	let state = hashSeed(String(seed));

	return function rng() {
		state = (state + 0x6d2b79f5) | 0;
		let value = Math.imul(state ^ (state >>> 15), 1 | state);
		value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;

		return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
	};
}
