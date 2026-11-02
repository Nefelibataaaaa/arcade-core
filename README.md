# @nefelibataaaaa/arcade-core

Pure, dependency-free **2048 game logic** for JavaScript. It has no Svelte, DOM,
browser, or Node-only dependencies, so it runs anywhere JavaScript runs.

- No side effects: every function returns a new board and never mutates its input.
- No randomness unless you want it: `spawn` accepts an optional random function.
- No framework code: only board maths lives here.

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
import { move, spawn, hasMoves, canMove } from '@nefelibataaaaa/arcade-core';

let board = [
  [2, 2, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];

if (canMove(board, 'left')) {
  board = move(board, 'left'); // [[4, 0, 0, 0], ...]
  board = spawn(board); // add a 2 or 4 to a random empty cell
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

## Errors and validation

All four functions validate their input:

- a board must be 4 rows of 4 non-negative integers;
- a direction must be one of the four supported strings;
- `rng` must be a function returning a number in `[0, 1)`.

Invalid input throws `TypeError` or `RangeError`; valid boards are never mutated.

## License

MIT © Cheney Gong
