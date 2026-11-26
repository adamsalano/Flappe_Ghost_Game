# Flappy Ghost Plan Research

**Date**: 2026-11-26

This research resolves the implementation plan's runtime and browser API
choices. No external runtime, test, or build dependencies are needed.

## Runtime and Modules

**Decision**: Require Node.js 22 or newer for development tests. Use `.mjs`
files and native ECMAScript `import`/`export`.

**Rationale**: Node's built-in test runner became stable in Node.js 20, and
`.mjs` is an explicit marker for ECMAScript modules. Node.js 22 is an LTS
release at the time of this plan; Node.js 20 has reached end of life. This
avoids relying on an unsupported runtime while meeting the requested
`node --test` workflow.

**Alternatives considered**: Node.js 20+ would meet the test-runner capability
but includes an EOL runtime. Adding a package manifest or a module/build tool
is unnecessary for the requested `.mjs` files and would expand dependencies.

**Sources**:

- [Node.js test runner](https://nodejs.org/api/test.html)
- [Node.js ECMAScript modules](https://nodejs.org/api/esm.html)
- [Node.js release schedule](https://nodejs.org/en/about/previous-releases)

## Animation and Time-Based Physics

**Decision**: Drive drawing with `requestAnimationFrame`; use its timestamp to
derive elapsed seconds for the pure game update. Cap a single elapsed update
at 50 ms.

**Rationale**: `requestAnimationFrame` schedules work before repaint, is
one-shot, and can be paused in background tabs. Its timestamp should be used
to calculate animation progress so motion does not depend on display refresh
rate. Passing elapsed time into game logic keeps it deterministic and
independently testable. The 50 ms cap prevents a long pause from advancing the
game by one very large physics step.

**Alternatives considered**: Advancing a fixed amount per rendered frame
would make speed vary across refresh rates. A fixed-step accumulator is also
viable, but adds state and complexity not needed for this single-player MVP.
The cap is a conservative implementation parameter, not a gameplay feature.

**Source**:

- [MDN: `requestAnimationFrame()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)

## Canvas Rendering

**Decision**: Use one HTML Canvas with its built-in 2D context for the game
scene. Keep the logical drawing area at 960 by 540 and scale the canvas
proportionally with CSS.

**Rationale**: The browser's Canvas API provides scriptable 2D graphics and
supports shapes and text needed for the ghost, pipes, floor, score, and
instructions. A fixed logical coordinate system keeps rendering aligned with
collision geometry; proportional CSS sizing preserves the scene layout.

**Alternatives considered**: DOM elements for each game object or a third-party
rendering engine are unnecessary and conflict with the requested Canvas-only
rendering and no-engine constraints.

**Source**:

- [MDN: Canvas tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)

## Test Strategy

**Decision**: Use `node:test` and `node:assert/strict` from the standard
library, run with `node --test`, and test pure game-state transitions without
browser APIs.

**Rationale**: The built-in test runner is stable and requires no installation.
Keeping tests on the pure logic module fulfills the requested Node-only
verification and supports the constitution's test-first workflow.

**Alternatives considered**: Third-party test runners or browser automation
would add dependencies and are not necessary for verifying game rules. Visual
rendering and input wiring will be checked with the manual browser walkthrough
in [quickstart.md](./quickstart.md).

**Source**:

- [Node.js test runner](https://nodejs.org/api/test.html)
