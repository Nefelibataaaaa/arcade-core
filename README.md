# @nefelibataaaaa/arcade-core

Pure, dependency-free **2048 game logic** for JavaScript. It has no Svelte, DOM,
browser, or Node-only dependencies, so it runs anywhere JavaScript runs.

- No side effects: every board function returns a new board and never mutates its input.
- No hidden randomness: `spawn` accepts an optional random function, and
  `createRng(seed)` makes a game reproducible.
- No framework code: only board maths lives here. Rendering, storage, and
  animation belong to the application.

## Install

```bash
npm install @nefelibataaaaa/arcade-core
```

The package is ESM-only and requires Node 18 or newer (or any modern bundler).

## Board structure

A board is a 4 x 4 array of numbers:

```js
const board = [
  [2, 0, 0, 0],
  [0, 4, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];
```

- Each row has exactly four cells.
- `0` means empty.
- A tile is a positive integer: `2`, `4`, `8`, ... `2048`, `4096`, and so on.
- Boards are plain data. Serialize them with `JSON.stringify` if you need to save
  a game.

## Basic usage

```js
import {
  move,
  spawn,
  hasMoves,
  canMove,
  createRng
} from '@nefelibataaaaa/arcade-core';

const rng = createRng('my-seed');

let board = [
  [2, 2, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];

if (canMove(board, 'left')) {
  board = move(board, 'left'); // [[4, 0, 0, 0], ...]
  board = spawn(board, rng); // reproducible 2 or 4 in an empty cell
}

console.log(hasMoves(board)); // true while another move exists
```

## API

### `move(board, direction)`

Slides every tile as far as possible in `direction` and merges equal neighbours.
Each tile can merge **once per move**, so `2 2 2 2` becomes `4 4` and never `8`.

- `direction`: `'up' | 'down' | 'left' | 'right'`
- Returns a new 4 x 4 board. If nothing can move, the returned board has the same
  values as the input.
- Throws `TypeError` for a malformed board or an unknown direction.

### `spawn(board, rng?)`

Adds one tile to a random empty cell: a `2` with 90% probability or a `4` with
10% probability.

- `rng`: optional function returning a number in `[0, 1)`. Defaults to
  `Math.random`. Pass a seeded generator for reproducible games.
- Returns a new board. When the board is full the unchanged board is returned
  and `rng` is not called.
- Does not touch the DOM, timers, or global state.

### `hasMoves(board)`

Returns `true` when at least one direction would change the board. It returns
`false` only when the board is full and no two orthogonally adjacent tiles are
equal — in other words, when the game is over.

### `canMove(board, direction)`

Returns `true` when moving in `direction` would change at least one cell. It
returns `false` when that direction is blocked (for example, all tiles are
already against that edge and cannot merge).

## Seeded games and UI helpers

These functions were added in **1.1.0**. They are optional: the four functions
above are enough to play 2048.

### `createBoard(rng?)`

Creates a fresh board with exactly two starting tiles, placed with `spawn`.
Passing a seeded `rng` makes the opening position reproducible.

```js
const board = createBoard(createRng('opening'));
```

### `createRng(seed)`

Creates a deterministic pseudo-random number generator (mulberry32). The same
seed always yields the same sequence of numbers in `[0, 1)`, and different
generators keep independent state.

```js
const rng = createRng(42);
rng(); // always the same first number for seed 42
```

Seeds may be numbers or strings; a number and its string form are equivalent.

### `moveDetails(board, direction)`

Runs the same logic as `move`, but also returns the data a UI needs to animate
the turn:

```js
const details = moveDetails(board, 'left');

details.board; // the resulting board, identical to move(board, 'left')
details.moved; // false when the direction is blocked
details.gained; // score earned by merges in this move
details.moves; // [{ from: { row, col }, to: { row, col }, value, merged }, ...]
details.merges; // [{ row, col, value, sources: [{ row, col }, ...] }, ...]
```

`moves` contains one entry for every occupied source cell. In a merge, both
source tiles map to the same destination, and `merges` records the new tile
value plus its two sources.

## Errors and validation

All board functions validate their input:

- a board must be 4 rows of 4 non-negative integers;
- a direction must be one of the four supported strings;
- `rng` must be a function returning a number in `[0, 1)`.

Invalid input throws `TypeError` or `RangeError`; valid boards are never mutated.

## License

MIT © Cheney Gong
