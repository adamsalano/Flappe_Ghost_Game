# Implementation Plan: Flappy Ghost

**Branch**: `main` | **Date**: 2026-11-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-flappy-ghost-game/spec.md`

## Summary

Build a single-player browser game using the requested HTML page, CSS, vanilla
JavaScript ES modules, and Canvas 2D rendering. Keep deterministic game rules
in `src/game-logic.mjs`; keep browser input, animation, and drawing in
`src/main.mjs`. Verify game rules with Node's built-in test runner and no
external dependencies or build step.

## Technical Context

**Language/Version**: Browser JavaScript ES modules (`.mjs`); Node.js 22+ for
the built-in test runner

**Primary Dependencies**: None; use browser built-ins and Node.js built-ins only

**Storage**: None; all game state and score are held for the current session

**Testing**: `node --test` with `node:test` and `node:assert/strict`

**Target Platform**: Modern desktop browsers with ES modules and Canvas 2D;
Node.js 22+ for tests

**Project Type**: Static browser game

**Performance Goals**: Meet spec targets: visible input feedback within 100 ms;
no more than three visible movement stalls over 250 ms in a 60-second run at
the reference 1280 by 720 viewport

**Constraints**: `.mjs` modules; Canvas 2D; separate game logic from browser
interaction and rendering; no frameworks, game engines, external runtime or
test dependencies, build tools, or bundlers; implement only the approved MVP

**Scale/Scope**: One player, one ghost, one reusable pipe pair, three game
states, session-only score, five requested application/test files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle or gate | Plan evidence | Result |
|---|---|---|
| Test-Driven Development | Add failing `node:test` cases before the minimum game-logic changes; keep tests intact and record red/green/refactor runs. | PASS |
| Separate game logic and presentation | Pure state transitions live in `game-logic.mjs`; Canvas, DOM, browser input, and animation live in `main.mjs`. | PASS |
| Modular, readable JavaScript | Use focused `.mjs` modules and the five requested files. | PASS |
| Independently testable game logic | Pass explicit state, action, and elapsed time into logic; tests require no browser. | PASS |
| Node.js built-in tests | Run tests with `node --test`, `node:test`, and `node:assert/strict`. | PASS |
| Minimal dependencies | No package dependencies, test framework, engine, bundler, or build tool. | PASS |
| Requirement traceability | Map state transitions and tests to spec requirement and acceptance-criterion IDs. | PASS |
| Approved MVP scope | Implement only the game behaviors and visuals in the approved spec. | PASS |

No constitution violations or exceptions are required.

**Post-Phase 1 re-check**: PASS. The state model, UI contract, and validation
guide remain within the MVP; preserve test-first work, pure game logic, the
requested test runner, and zero project dependencies.

## Project Structure

### Documentation (this feature)

```text
specs/001-flappy-ghost-game/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── game-ui.md
└── tasks.md                 # Created by /speckit-tasks, not this phase
```

### Source Code (repository root)

```text
index.html
styles.css
src/
├── game-logic.mjs
└── main.mjs
tests/
└── game-logic.test.mjs
```

**Structure Decision**: Use the user-requested single-page structure without
separate frontend/backend projects. `game-logic.mjs` owns pure game state
transitions; `main.mjs` owns all browser-specific behavior. Keep the requested
single logic test file and run it directly through Node's test discovery.

## Runtime Responsibilities

- **`index.html`**: Provide the page metadata, one Canvas element with fallback
  text, and the `main.mjs` module entry point. Do not embed game rules or
  inline scripts.
- **`styles.css`**: Center and size the game surface, preserve its 16:9 aspect
  ratio, and provide basic page styling. The game scene colors are drawn by the
  Canvas renderer.
- **`src/game-logic.mjs`**: Export initial-state creation, flap/restart state
  transitions, a time-step update, and collision/scoring helpers. Functions
  operate only on passed values and have no browser, rendering, clock, or
  random-number side effects.
- **`src/main.mjs`**: Acquire the Canvas 2D context; normalize keyboard and
  click input; call game-logic transitions; run the `requestAnimationFrame`
  loop; render the current state; and update the score and state instructions.
- **`tests/game-logic.test.mjs`**: Exercise game logic through Node's built-in
  test and assertion modules, without opening a browser or adding a test
  framework.

## Game State and Physics

Use the state shape and transitions in [data-model.md](./data-model.md).
`status` is `ready`, `playing`, or `gameOver`; score and pipe pass state reset
for every new round. A Space keydown or Canvas click is mapped according to
that state. Ignore repeated keydown events so holding Space remains one input.

Use a 960 by 540 logical play area with positive y downward. On each logic step
of `dt` seconds:

1. Apply `verticalVelocity += gravity × dt`.
2. Apply `ghostY += verticalVelocity × dt`.
3. Move the pipe pair left by `pipeSpeed × dt`.
4. Check ghost bounds against pipe and play-area bounds; touching counts.
5. If there is no collision and the ghost's full left/back edge has passed
   the pipe pair's right edge, award one point if the pair has not scored.
6. When the pipe pair is fully off the left edge, place it at the right edge
   and reset its one-pass score flag.

A flap sets vertical velocity to a configured negative impulse. Gravity applies
again on following steps. Keep physics constants in the game-logic module;
choose values during implementation to satisfy the spec's observable movement
and playability criteria. Use a fixed gap position on pipe reuse, as specified
in the data model.

The browser loop uses the `requestAnimationFrame` timestamp to calculate
elapsed time and caps one update step at 50 milliseconds to avoid a large jump
after a suspended tab. This keeps physics time-based while making the pure
update function deterministic under tests.

## Collision, Scoring, and State Ordering

Represent the visible ghost and pipe sections as axis-aligned rectangles in
the same logical coordinate space. Any edge contact or overlap is a collision.
After moving entities in a logic step, resolve collision before scoring. Thus,
a collision on or before full clearance ends the run without awarding that
pair's point. Once in `gameOver`, stop movement and scoring and preserve the
final score. The next accepted Space/click creates a fresh state, resets score,
and applies one flap in that same input.

## Rendering and Input

The Canvas renderer draws the light blue background, upper/lower green pipes,
dark floor, ghost emoji, score, and the ready/Game Over messages from the
current state. Use Canvas text drawing for the emoji and UI labels; keep HTML
responsible for the page and Canvas container, not game rules. CSS scales the
logical 16:9 surface to fit the available page width without cropping.

Listen for Space keydown and clicks on the Canvas. Prevent Space's page-scroll
default while the game page is active, ignore auto-repeat, and pass normalized
actions to the game logic. Do not add touch controls or other input modes.

## Testing Strategy

Follow the constitution's Red-Green-Refactor cycle for each behavior: add a
failing test mapped to an acceptance criterion, run it with `node --test`,
implement only enough logic to pass, then refactor with tests still passing.
Never weaken tests to make behavior pass.

The logic suite covers at least:

- Starting and restarting, including one flap on the triggering input and a
  zeroed score on a new round.
- Gravity increasing downward speed and a separate flap setting upward
  movement.
- Pipe movement, off-screen repositioning, and resetting the score-once flag.
- Inclusive boundary/pipe collision and movement freeze after Game Over.
- Scoring only after complete clearance, only once, and never after collision.

| Test scope | Acceptance and requirement traceability |
|---|---|
| Ready start and Game Over restart | AC-002, AC-014; FR-002, FR-011; SC-001, SC-007 |
| Gravity and discrete flap behavior | AC-003 through AC-005; FR-003, FR-004; SC-002 |
| Pipe movement and repositioning | AC-006, AC-007; FR-006, FR-007 |
| Pipe and boundary collisions; Game Over freeze | AC-010 through AC-013; FR-009, FR-010; SC-004 |
| Full-clearance scoring and one-score-per-pair | AC-008, AC-009; FR-008; SC-003 |
| Manual browser walkthrough and visual/input checks | AC-001; NFR-001 through NFR-003; SC-005, SC-006 |

Use a manual browser walkthrough from [quickstart.md](./quickstart.md) for
Canvas presentation, Space/click wiring, and visual acceptance checks. No
browser automation or additional test dependency is introduced.

## Complexity Tracking

No constitution violations or added project layers require justification.
