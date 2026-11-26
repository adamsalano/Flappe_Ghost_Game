# Flappy Ghost Data Model

This design describes in-memory game state only. It adds no persistence or
features beyond the approved MVP.

## Game State

The game state is a plain value passed between pure game-logic operations.

| Field | Type | Constraints and purpose |
|---|---|---|
| `status` | `ready \| playing \| gameOver` | The current lifecycle state. Only `playing` advances physics and pipes. |
| `score` | non-negative integer | Number of pipe pairs fully passed in this session. Starts at zero and resets on restart. |
| `world.width` | positive number | Logical play-area width used for obstacle bounds. |
| `world.height` | positive number | Logical play-area height. |
| `world.floorTop` | number within world height | Top edge of the floor strip; contact ends the round. |
| `ghost.x`, `ghost.y` | numbers | Ghost center position in the logical play area; positive y is downward. |
| `ghost.velocityY` | number | Vertical speed; positive is downward, negative is upward. |
| `ghost.width`, `ghost.height` | positive numbers | Visible collision bounds for the ghost. |
| `pipe.x` | number | Left edge of the single pipe pair. |
| `pipe.width` | positive number | Horizontal extent shared by upper and lower pipes. |
| `pipe.gapTop` | number | Top of the passable opening. |
| `pipe.gapHeight` | positive number | Opening height, positioned so the gap remains within the playable area. |
| `pipe.scored` | boolean | Prevents this pair from awarding more than one point before it is repositioned. |

The displayed ghost is the `👻` character. Its visible body is represented by
the `ghost` bounds for collision checks. Pipe rectangles, the ceiling, and the
floor use the same logical coordinate space.

## State Transitions

| Current state | Event | Result |
|---|---|---|
| `ready` | Space press or game-area click | Initialize a fresh session, transition to `playing`, and apply one flap. |
| `playing` | Space press or game-area click | Apply one flap; holding Space does not repeat it. |
| `playing` | Time step with no flap | Apply gravity, move the ghost and pipe pair, then evaluate collisions and scoring. |
| `playing` | Ghost touches or overlaps a pipe or play-area boundary | Transition to `gameOver`; freeze ghost and pipe movement and preserve score. |
| `playing` | Ghost clears the right edge of the pipe pair without collision | Increase score by one only if `pipe.scored` is false, then mark the pair scored. |
| `playing` | Pipe pair moves fully beyond the left edge | Reposition the same pair at the right edge and clear its `scored` flag. |
| `gameOver` | Space press or game-area click | Initialize a fresh session, reset score to zero, transition to `playing`, and apply one flap. |

## Physics and Validation Rules

- Time steps are supplied in seconds. Gravity increases vertical speed by
  `gravity × elapsedSeconds`; position advances using the resulting vertical
  speed.
- A flap sets vertical speed to a fixed upward impulse (negative y direction).
  Gravity continues to apply on subsequent time steps.
- Pipe position advances left by `pipeSpeed × elapsedSeconds`.
- Collision bounds are axis-aligned rectangles. Touching edges counts as a
  collision, as does overlap.
- Evaluate collision before awarding a pass in a time step. A collision on or
  before full clearance ends the run without awarding that pair's point.
- Full clearance occurs when the ghost's left/back edge has moved past the
  pipe pair's right edge.
- `score` is always a non-negative integer. `pipe.scored` is set once per
  successful pass and reset only when the pair is repositioned.
- Reuse a fixed, playable gap position and size when the pair returns; do not
  add random obstacle variation to this MVP.
- `ready` and `gameOver` states do not advance movement or scoring.
