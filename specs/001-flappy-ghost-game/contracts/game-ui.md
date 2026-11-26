# Game UI Contract

This is the user-facing interaction contract for the single-page game. There
are no network endpoints or external service contracts.

## Game Surface

- Present one Canvas game surface with a light blue play area, a ghost emoji
  near the left, one green pipe pair and gap, a dark floor strip, and a visible
  score.
- The ready state shows a score of zero and the instruction to press Space or
  click to start.
- The Game Over state stops gameplay, preserves and displays the final score,
  and permits immediate restart.

## Controls and State Behavior

| State | Input | Observable result |
|---|---|---|
| Ready | Space press | Start a new round at zero and flap once. |
| Ready | Click in game area | Start a new round at zero and flap once. |
| Playing | Separate Space press | Flap once; key hold/repeat does not create repeated flaps. |
| Playing | Click in game area | Flap once. |
| Playing | Collision with a pipe, ceiling, or floor | Stop movement and scoring; show Game Over and final score. |
| Game Over | Space press | Start a fresh round at zero and flap once. |
| Game Over | Click in game area | Start a fresh round at zero and flap once. |

The page does not expose a pause, settings, saved-score, or alternate-control
flow in this MVP.
