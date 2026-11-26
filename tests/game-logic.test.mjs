import assert from 'node:assert/strict';
import test from 'node:test';
import { flapGhost } from '../src/game-logic.mjs';
import { createInitialState, flap, updateGame } from '../src/game-logic.mjs';

test('flap applies upward velocity without mutating the original state', () => {
  const originalState = {
    status: 'playing',
    ghost: { velocityY: 0 },
  };

  const nextState = flapGhost(originalState);

  assert.ok(nextState.ghost.velocityY < 0);
  assert.equal(originalState.ghost.velocityY, 0);
});

function createPlayingState() {
  return flap(createInitialState());
}

function withState(state, { ghost = {}, pipe = {} } = {}) {
  return {
    ...state,
    ghost: { ...state.ghost, ...ghost },
    pipe: { ...state.pipe, ...pipe },
  };
}

test('AC-002 and AC-014: ready starts and Game Over restarts with a fresh score', () => {
  const readyState = createInitialState();
  const startedState = flap(readyState);

  assert.equal(readyState.status, 'ready');
  assert.equal(startedState.status, 'playing');
  assert.equal(startedState.score, 0);
  assert.ok(startedState.ghost.velocityY < 0);

  const gameOverState = { ...startedState, status: 'gameOver', score: 4 };
  const frozenState = updateGame(gameOverState, 1);
  const restartedState = flap(gameOverState);

  assert.strictEqual(frozenState, gameOverState);
  assert.equal(gameOverState.score, 4);
  assert.equal(restartedState.status, 'playing');
  assert.equal(restartedState.score, 0);
  assert.ok(restartedState.ghost.velocityY < 0);
});

test('AC-003 and AC-006: gravity accelerates the ghost and pipes move left', () => {
  const activeState = withState(createPlayingState(), {
    ghost: { velocityY: 0 },
  });
  const nextState = updateGame(activeState, 0.1);

  assert.ok(nextState.ghost.velocityY > 0);
  assert.ok(nextState.ghost.y > activeState.ghost.y);
  assert.ok(nextState.pipe.x < activeState.pipe.x);
});

test('AC-007: an off-screen pipe pair returns on the right and resets its score flag', () => {
  const activeState = createPlayingState();
  const offScreenState = withState(activeState, {
    pipe: { x: -activeState.pipe.width, scored: true },
  });
  const nextState = updateGame(offScreenState, 0.01);

  assert.equal(nextState.pipe.x, nextState.world.width);
  assert.equal(nextState.pipe.scored, false);
});

test('AC-010 through AC-013: collisions end play and Game Over freezes the state', () => {
  const activeState = createPlayingState();
  const pipeCollision = withState(activeState, {
    ghost: { velocityY: 0 },
    pipe: {
      x: activeState.ghost.x,
      gapTop: activeState.ghost.y,
      gapHeight: 20,
    },
  });
  const ceilingCollision = withState(activeState, {
    ghost: {
      y: activeState.ghost.height / 2,
      velocityY: -100,
    },
  });
  const floorCollision = withState(activeState, {
    ghost: {
      y: activeState.world.floorTop - activeState.ghost.height / 2 - 1,
      velocityY: 100,
    },
  });

  for (const collisionState of [
    pipeCollision,
    ceilingCollision,
    floorCollision,
  ]) {
    assert.equal(updateGame(collisionState, 0.02).status, 'gameOver');
  }

  const gameOverState = updateGame(pipeCollision, 0.02);
  const frozenState = updateGame(gameOverState, 1);

  assert.equal(gameOverState.status, 'gameOver');
  assert.equal(frozenState.ghost.y, gameOverState.ghost.y);
  assert.equal(frozenState.pipe.x, gameOverState.pipe.x);
  assert.equal(frozenState.score, gameOverState.score);
});

test('AC-008 and AC-009: scoring waits for full clearance and occurs once per pass', () => {
  const activeState = withState(createPlayingState(), {
    ghost: { velocityY: 0 },
  });
  const ghostLeft = activeState.ghost.x - activeState.ghost.width / 2;
  const nearPipeState = withState(activeState, {
    pipe: {
      x: ghostLeft - activeState.pipe.width + 1,
      scored: false,
    },
  });

  const notYetCleared = updateGame(nearPipeState, 0.001);
  const cleared = updateGame(notYetCleared, 0.01);
  const later = updateGame(cleared, 0.01);

  assert.equal(notYetCleared.score, 0);
  assert.equal(cleared.score, 1);
  assert.equal(cleared.pipe.scored, true);
  assert.equal(later.score, 1);

  const collidingPipeState = withState(activeState, {
    pipe: {
      x: ghostLeft - activeState.pipe.width + 1,
      gapTop: activeState.ghost.y,
      gapHeight: 20,
    },
  });
  const collision = updateGame(collidingPipeState, 0.001);

  assert.equal(collision.status, 'gameOver');
  assert.equal(collision.score, 0);
});
