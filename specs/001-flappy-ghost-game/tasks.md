---
description: "Dependency-ordered tasks for the Flappy Ghost MVP"
---

# Tasks: Flappy Ghost

**Input**: Design documents from `specs/001-flappy-ghost-game/`

**Prerequisites**: `plan.md`, `spec.md`; also use `data-model.md`,
`contracts/game-ui.md`, `research.md`, `quickstart.md`, and
`.specify/memory/constitution.md` as the implementation references.

**Tests**: Use only Node.js built-ins. Phase 2 demonstrates one complete
Red-Green-Refactor cycle for ghost flap. The consolidated implementation task
adds focused automated coverage for remaining game rules, as required by the
constitution and plan.

**Organization**: The four phases follow the requested workflow. Remaining
game implementation is intentionally one cross-story task; story labels
identify every story it covers.

## Format

`- [ ] [TaskID] [P?] [Story?] Description with file path`

- `[P]` marks work that can proceed in parallel in different files.
- Story labels map to the user stories in `spec.md`.

## Phase 1: Project Setup

**Purpose**: Create the requested static page and module structure, initialize
Canvas, and prepare the built-in Node.js test entry point without adding
dependencies or a build system.

- [X] T001 [P] Create `index.html` with the `#game-canvas` element, fallback text, `styles.css` link, and `src/main.mjs` module entry.
- [X] T002 [P] Create `styles.css` with minimal page layout and proportional 16:9 sizing for `#game-canvas`.
- [X] T003 [P] Create browser-independent `src/game-logic.mjs` with an exported no-op `flapGhost(state)` scaffold so the Phase 2 assertion can fail on behavior rather than module loading.
- [X] T004 Initialize the 960 by 540 Canvas and acquire its 2D context in `src/main.mjs`, using the canvas ID from `index.html`.
- [X] T005 [P] Create `tests/game-logic.test.mjs` with imports from `node:test` and `node:assert/strict`, but no test case yet; use `node --test` without adding `package.json` or dependencies.

## Phase 2: TDD Demonstration — User Story 1 (P1)

**Goal**: Demonstrate one complete TDD cycle for the ghost's upward flap.

**Independent Test**: With a playing-state ghost whose vertical velocity is
zero, the flap transition returns a state with negative `ghost.velocityY`
(AC-004, FR-004).

- [X] T006 [US1] Add exactly one automated ghost-flap test to `tests/game-logic.test.mjs`; call `flapGhost(state)` and assert the resulting `ghost.velocityY` is negative (AC-004, FR-004).
- [X] T007 [US1] Run `node --test` for `tests/game-logic.test.mjs` before implementing the flap and record the expected failing assertion.
- [X] T008 [US1] Implement the minimum pure `flapGhost(state)` transition in `src/game-logic.mjs` to set the ghost's vertical velocity to a configured negative flap impulse; do not weaken or change the test.
- [X] T009 [US1] Rerun `node --test` for `tests/game-logic.test.mjs` and record that the unchanged flap test passes.
- [X] T010 [US1] Refactor `src/game-logic.mjs` to keep the negative flap impulse in a named module constant; leave `tests/game-logic.test.mjs` unchanged, rerun `node --test`, and record that the test still passes.

## Phase 3: Remaining Game Implementation — Consolidated User Stories 1–4

**Goal**: Complete the rest of the approved gameplay in one integrated
implementation task, without separate feature-by-feature test and code tasks.

**Independent Test Criteria**:

| Story | Acceptance criteria for independent review |
|---|---|
| US1 — Start and Fly (P1) | Ready UI is present; Space/click starts and flaps; gravity and separate flap inputs behave as specified (AC-001–AC-005). |
| US2 — Pass Pipes and Score (P1) | One pipe pair moves and repositions; scoring occurs after full clearance, once per traversal, and not after collision (AC-006–AC-009). |
| US3 — Collide and See Game Over (P1) | Pipe, ceiling, and floor contact end play; movement stops and final score remains visible (AC-010–AC-013). |
| US4 — Restart the Game (P2) | Space/click after Game Over starts a fresh round at zero and flaps once (AC-014). |

- [X] T011 [US1] [US2] [US3] [US4] Complete the remaining MVP in `src/game-logic.mjs`, `src/main.mjs`, `styles.css`, and `tests/game-logic.test.mjs`: add initial state, gravity and movement, one reusable pipe pair, collision-before-scoring, full-clearance one-point scoring, Game Over and restart transitions; wire Canvas rendering, `requestAnimationFrame` with the planned 50 ms update cap, Space/click input, and score/state messages; add acceptance-mapped tests for the remaining rules. Keep logic pure and separate from browser code, use a fixed playable gap, preserve all tests, and follow the constitution's test-first workflow within this consolidated task.

## Phase 4: Validation

**Purpose**: Validate the complete MVP against automated logic tests and the
manual browser acceptance walkthrough.

- [X] T012 Run `node --test` from the repository root and confirm all tests in `tests/game-logic.test.mjs` pass without changing or weakening assertions.
- [X] T013 Serve the repository root over HTTP, open `index.html` in a modern browser, and complete the gameplay and non-functional acceptance checks in `quickstart.md` at 1280 by 720 (AC-001–AC-014, NFR-001–NFR-003).

## Dependencies and Execution Order

### Phase Dependencies

- **Phase 1** has no implementation dependency. T001, T002, T003, and T005 can be prepared in parallel; T004 depends on T001's canvas ID.
- **Phase 2** depends on the Phase 1 module and test scaffolds. T006 → T007 → T008 → T009 → T010 is a strict Red-Green-Refactor sequence.
- **Phase 3** depends on the passing flap test after T010 and consolidates the remaining behavior across US1–US4, as requested.
- **Phase 4** depends on T011. Run automated tests before the browser walkthrough.

### User Story Dependencies

- **US1 (P1)**: Its explicit flap TDD demonstration follows setup; the remaining start/fly behavior is completed in T011.
- **US2 (P1)**: Its pipes and scoring are implemented with the shared game loop in T011.
- **US3 (P1)**: Its collision and Game Over behavior is implemented with shared state handling in T011.
- **US4 (P2)**: Restart depends on Game Over state handling; both are implemented in T011.
- US2–US4 are not parallel delivery increments because the requested single consolidated task combines their remaining implementation.

### Parallel Opportunities

- T001, T002, T003, and T005 touch separate files and can be started concurrently; keep the shared `#game-canvas` and `flapGhost(state)` names as specified.
- No implementation task in Phase 3 is parallelized; it intentionally integrates the game loop, rendering, controls, and state logic.
- T012 and T013 are sequential validation steps so browser acceptance follows a passing automated suite.

## Implementation Strategy

1. Complete Phase 1 scaffolding without adding dependencies or implementing gameplay beyond the Canvas initialization and flap stub.
2. Complete the single ghost-flap Red-Green-Refactor TDD demonstration in Phase 2.
3. Implement all remaining approved MVP behavior in T011, including tests for the remaining game rules; do not add clouds, saved/high scores, advanced animation, or visual refinements.
4. Run automated tests, then complete the manual browser and performance checks. The MVP scope is the approved set of User Stories 1–4; the flap test is the first independently testable milestone, not the full game.

## Notes

- `[P]` tasks operate on different files and have no dependency on unfinished work.
- Every implementation and test assertion must trace to an approved FR/AC in `spec.md`.
- Keep `.mjs` modules, Node.js built-in testing, and the game-logic/presentation boundary.
- Do not create tasks or files for features outside the approved MVP.
