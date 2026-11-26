# Feature Specification: Flappy Ghost Game

**Feature Branch**: `main`

**Created**: 2026-11-26

**Status**: Draft

**Input**: User description: "Browser-based Flappy Ghost MVP with a ghost character, green pipes, scoring, collision, game-over, restart, and keyboard and mouse controls."

## Clarifications

### Session 2026-11-26

- Q: When Space is pressed or the player clicks on the ready screen, should that input start the game and flap once, or start the game without flapping? → A: Start the game and flap once on the same input.
- Q: How should gravity and flap input affect the ghost during active play? → A: Gravity increases the ghost’s downward speed over time, and each separate Space press or click gives one upward flap; holding Space does not repeat.
- Q: At what point should the score increase when the ghost passes through a pipe gap without colliding? → A: Award one point only after the ghost’s entire visible body clears the pipes’ right edge without a collision.
- Q: What should count as a collision between the ghost and a pipe, the ceiling, or the floor? → A: Any part of the visible ghost touching or overlapping a pipe or play-area boundary ends the game.
- Q: After Game Over, should Space or a click immediately start a fresh game, reset the score, and flap once, or should restarting work differently? → A: Space or click immediately starts a new game, resets the score, and causes one flap.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Start and Fly (Priority: P1)

As a player, I want to start a game and flap the ghost so I can guide it through
the play area.

**Why this priority**: Starting and controlling the ghost is necessary for any
playable game session.

**Independent Test**: Open the game, start using either supported control, then
observe the ghost with and without flap input.

**Acceptance Scenarios**:

1. **Given** the game has loaded, **When** the ready screen appears, **Then**
   it shows the ghost emoji (👻) near the left side, one pair of green pipes
   with a gap, a light blue background, a dark floor strip, a score of zero,
   and instructions to press Space or click to start. (AC-001)
2. **Given** the ready screen is shown, **When** the player presses Space or
   clicks in the game area, **Then** active gameplay starts at score zero and
   that same input causes one upward flap. (AC-002)
3. **Given** gameplay is active, **When** the player gives no flap input for
   one second, **Then** gravity continuously pulls the ghost downward and its
   downward speed increases. (AC-003)
4. **Given** gameplay is active, **When** the player presses Space, **Then**
   the ghost receives one upward flap and begins moving upward. (AC-004)
5. **Given** gameplay is active, **When** the player clicks in the game area,
   **Then** the ghost receives one upward flap and begins moving upward.
   (AC-005)

---

### User Story 2 - Pass Pipes and Score (Priority: P1)

As a player, I want the pipes to move and the game to count successful passes
so I can see how well I am doing.

**Why this priority**: Moving obstacles and reliable scoring provide the
gameplay challenge and feedback.

**Independent Test**: Start an active session and observe pipe movement,
repositioning, and score changes as the ghost passes a pair.

**Acceptance Scenarios**:

1. **Given** gameplay is active, **When** time passes, **Then** the single
   visible pair of green pipes moves from right to left with a gap between the
   upper and lower pipes. (AC-006)
2. **Given** the pipe pair has moved fully beyond the left side of the play
   area, **When** it is repositioned, **Then** it returns from the right with
   its gap within the playable area, and there is still only one pair.
   (AC-007)
3. **Given** the ghost passes through the gap without a collision, **When**
   its entire visible body clears the pipes' right edge, **Then** the displayed
   score increases by exactly one point. (AC-008)
4. **Given** a pipe pair has already been passed, **When** gameplay continues
   before another pair is passed, **Then** that pair does not award another
   point. (AC-009)

---

### User Story 3 - Collide and See Game Over (Priority: P1)

As a player, I want collisions to end the current game clearly so I know when
the session has finished.

**Why this priority**: A clear end condition makes the game rules understandable
and lets players decide whether to restart.

**Independent Test**: In separate active sessions, collide with a pipe, the
ceiling, and the floor and verify each ends gameplay.

**Acceptance Scenarios**:

1. **Given** gameplay is active, **When** any visible part of the ghost
   touches or overlaps either pipe, **Then** gameplay ends and the Game Over
   screen appears. (AC-010)
2. **Given** gameplay is active, **When** any visible part of the ghost
   touches or overlaps the ceiling, **Then** gameplay ends and the Game Over
   screen appears. (AC-011)
3. **Given** gameplay is active, **When** any visible part of the ghost
   touches or overlaps the floor, **Then** gameplay ends and the Game Over
   screen appears. (AC-012)
4. **Given** the Game Over screen is shown, **When** no restart input is
   given, **Then** the ghost and pipes stop moving, the final score remains
   visible, and the score does not change. (AC-013)

---

### User Story 4 - Restart the Game (Priority: P2)

As a player, I want to restart after Game Over so I can play another round.

**Why this priority**: Restarting supports replay without requiring the player
to reload the game.

**Independent Test**: End a session with a nonzero score, restart using either
control, and verify a fresh session begins at zero.

**Acceptance Scenarios**:

1. **Given** the Game Over screen is shown, **When** the player presses Space
   or clicks in the game area, **Then** a new active session begins, the score
   resets to zero, and that same input causes one upward flap.
   (AC-014)

### Edge Cases

- Touching a pipe, ceiling, or floor ends the active session, including when
  more than one collision occurs at the same time.
- A collision before the ghost fully clears a pipe pair prevents that pair
  from awarding a point.
- Repositioning a pipe pair does not award a point by itself.
- A new session starts with no score or scoring state carried over from the
  previous session.
- Flap input while the Game Over screen is displayed starts a new session; it
  does not change the previous session's final score.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The ready screen MUST show the ghost emoji (👻) near the left
  side, one pair of green pipes with a gap, a light blue background, a dark
  floor strip, a score display initialized to zero, and instructions to press
  Space or click to start. Verified by AC-001.
- **FR-002**: Pressing Space or clicking in the game area on the ready screen
  MUST start active gameplay with a score of zero and cause one upward flap on
  the same input. Verified by AC-002.
- **FR-003**: During active gameplay, gravity MUST continuously pull the ghost
  downward between flap inputs, increasing its downward speed over time.
  Verified by AC-003.
- **FR-004**: Each discrete Space press or click in the game area during
  active gameplay MUST cause one upward flap that makes the ghost begin moving
  upward. Verified by AC-004 and AC-005.
- **FR-005**: The game MUST display exactly one pair of simple green
  rectangular pipes with a gap between them. Verified by AC-001 and AC-006.
- **FR-006**: During active gameplay, the pipe pair MUST move from right to
  left. Verified by AC-006.
- **FR-007**: After the pair moves fully beyond the left side of the play area,
  it MUST be repositioned at the right side with a gap inside the playable
  area, while remaining the only visible pair. Verified by AC-007.
- **FR-008**: A pipe pair MUST award exactly one point when the ghost passes
  through the gap without collision and its entire visible body clears the
  pair's right edge. A pair MUST NOT award points more than once. Verified by
  AC-008 and AC-009.
- **FR-009**: Any part of the visible ghost touching or overlapping a pipe, the
  ceiling, or the floor MUST end active gameplay. Verified by AC-010 through
  AC-012.
- **FR-010**: The Game Over screen MUST show the final score, stop ghost and
  pipe movement, and keep the score unchanged until a new session begins.
  Verified by AC-013.
- **FR-011**: Pressing Space or clicking in the game area on the Game Over
  screen MUST immediately start a new active session, reset the score to zero,
  and cause one upward flap on the same input. Verified by AC-014.
- **FR-012**: The current score MUST be visible during gameplay. Verified by
  AC-001, AC-008, and AC-013.
- **FR-013**: The visual presentation MUST remain clean and minimal, using the
  specified background, pipe, floor, ghost, and score elements. Verified by
  AC-001 and SC-006.

### Non-Functional Requirements

- **NFR-001**: Start, flap, and restart input MUST produce visible feedback
  within 100 milliseconds on the reference desktop setup described in
  Assumptions.
- **NFR-002**: During a 60-second active session on the reference desktop setup,
  there MUST be no more than three visible movement stalls lasting longer than
  250 milliseconds.
- **NFR-003**: At the reference viewport size, the ghost, pipes, score,
  instructions, and floor MUST remain visible and readable without clipping.

### Key Entities

- **Ghost**: The player-controlled character, positioned near the left side of
  the play area and subject to gravity, flap input, and collision.
- **Pipe Pair**: The upper and lower green obstacles with a gap, which move
  together and can award one point when successfully passed.
- **Game Session**: One play round with a ready, active, or Game Over state.
- **Score**: The number of pipe pairs successfully passed during the current
  session.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Across 10 acceptance runs (five started with Space and five with
  a click), the game starts from the ready screen and displays a score of zero
  in every run.
- **SC-002**: In 10 out of 10 gameplay checks, the ghost descends between flap
  inputs and begins moving upward after each supported flap input.
- **SC-003**: Across 10 successful pipe passes, the score increases by exactly
  10 points, with no pair counted more than once.
- **SC-004**: Pipe, ceiling, and floor contact each produce a Game Over screen
  in every corresponding acceptance scenario.
- **SC-005**: Start, flap, and restart feedback is visible within 100
  milliseconds in at least 19 of 20 trials.
- **SC-006**: At 1280 by 720 pixels, all required visual elements remain
  visible and readable, and movement meets NFR-002 during a 60-second run.
- **SC-007**: Across 10 restart checks (five using Space and five using a
  click), the new session begins with a score of zero in every run.

## Assumptions

- The MVP targets a modern desktop browser with keyboard and mouse input; the
  reference viewport for visual and responsiveness checks is 1280 by 720
  pixels.
- Space and a click in the game area are the only required controls. Each
  separate Space press or click is one input; holding Space does not repeat
  flaps.
- Space or click starts a new active session immediately from the ready or Game
  Over screen. That input also causes one upward flap.
- Exactly one pipe pair is visible at a time. The pair is reused after leaving
  the play area; pipe gap size and movement rates are not fixed by this
  specification, but the gap must remain playable.
- A collision occurs when the ghost's visible body touches or overlaps a pipe,
  the ceiling, or the floor.
- Scores are session-only. Persistent high scores, multiple lives, additional
  obstacle types, sound, and other modes are outside this MVP.
