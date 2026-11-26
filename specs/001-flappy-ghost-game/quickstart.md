# Flappy Ghost Quickstart and Validation

## Prerequisites

- Node.js 22 or newer for the built-in test runner.
- A modern browser with JavaScript ES modules and Canvas 2D support.
- No package installation, build step, or bundler is required.
- To try the page locally, use an available local static HTTP server. If Python
  is already installed, the standard-library server below is sufficient; it
  is a development convenience, not an application dependency.

## Run the Tests

From the repository root:

```text
node --test
```

Expected result: Node discovers `tests/game-logic.test.mjs` and reports all
game-logic tests passing.

## Run the Game Locally

Serve the repository root with an available static HTTP server. For example,
with Python already installed:

```text
python -m http.server 8000
```

Open `http://localhost:8000` in a browser. The ready screen should show the
ghost, one green pipe pair, the score, and the Space/click start instruction.
Space or a click starts the game and flaps once. After a collision, either
input starts a fresh game and resets the score.

## Acceptance Walkthrough

1. Confirm the ready screen and its specified visual elements.
2. Start once with Space and once with a click; verify each starts at zero and
   flaps on that same input.
3. During play, verify the ghost falls between flaps, rises after each separate
   input, and the pipe pair moves left and returns from the right.
4. Verify a successful pass adds one point only after the ghost fully clears
   the pair; a collision before clearance awards no point.
5. Verify pipe, ceiling, and floor contact each stop the round and preserve
   the final score.
6. Restart with Space and click in separate runs; each must start at zero and
   flap on the restart input.

## Non-Functional Acceptance Checks

At the reference 1280 by 720 viewport, use the browser's built-in performance
tools during manual testing:

- Check 20 start, flap, and restart inputs; visible feedback must occur within
  100 ms in at least 19 trials.
- Record a 60-second active session and count visible movement stalls longer
  than 250 ms; there must be no more than three.
- Confirm the ghost, pipes, score, instructions, and floor remain visible and
  readable without clipping.

The game-state fields and transition rules are detailed in
[data-model.md](./data-model.md); browser interaction behavior is summarized in
[contracts/game-ui.md](./contracts/game-ui.md).
