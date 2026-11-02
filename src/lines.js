import { BOARD_SIZE } from './board.js';

/**
 * Coordinates of one row or column, ordered from the edge tiles move towards.
 * Index 0 is the destination edge, index 3 is the far edge.
 *
 * @param {'up' | 'down' | 'left' | 'right'} direction
 * @param {number} index Row index for left/right, column index for up/down.
 * @returns {Array<[number, number]>}
 */
export function lineCoordinates(direction, index) {
	/** @type {Array<[number, number]>} */
	const coordinates = [];

	for (let offset = 0; offset < BOARD_SIZE; offset += 1) {
		switch (direction) {
			case 'left':
				coordinates.push([index, offset]);
				break;
			case 'right':
				coordinates.push([index, BOARD_SIZE - 1 - offset]);
				break;
			case 'up':
				coordinates.push([offset, index]);
				break;
			case 'down':
				coordinates.push([BOARD_SIZE - 1 - offset, index]);
				break;
		}
	}

	return coordinates;
}

/**
 * Collapse a line into groups, preserving which source cells feed each group.
 * A group holds one source for a plain move or two sources for a merge.
 *
 * @param {number[]} values Four cell values, ordered from the destination edge.
 * @returns {Array<{ value: number, sourceIndices: number[] }>}
 */
export function groupLine(values) {
	/** @type {Array<{ value: number, sourceIndices: number[] }>} */
	const groups = [];

	values.forEach((value, index) => {
		if (value === 0) return;

		const previous = groups.at(-1);

		if (previous && previous.sourceIndices.length === 1 && previous.value === value) {
			previous.value *= 2;
			previous.sourceIndices.push(index);
		} else {
			groups.push({ value, sourceIndices: [index] });
		}
	});

	return groups;
}
