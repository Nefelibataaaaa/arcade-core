# Changelog

All notable changes to this package are documented in this file. The format is
based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project follows [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-11-01

### Added

- Initial release.
- `move(board, direction)` — slides and merges tiles, one merge per tile per move.
- `spawn(board, rng?)` — adds a 2 or 4 to a random empty cell.
- `hasMoves(board)` — reports whether any direction can change the board.
- `canMove(board, direction)` — reports whether one direction can change the board.
- Input validation for boards, directions, and random functions.
