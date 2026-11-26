const WORLD_WIDTH = 960;
const WORLD_HEIGHT = 540;
const FLOOR_HEIGHT = 54;
const GHOST_WIDTH = 42;
const GHOST_HEIGHT = 42;
const PIPE_WIDTH = 80;
const PIPE_GAP_TOP = 170;
const PIPE_GAP_HEIGHT = 180;
const GRAVITY = 900;
const FLAP_IMPULSE = -320;
const PIPE_SPEED = 180;

export function createInitialState() {
  return {
    status: 'ready',
    score: 0,
    world: {
      width: WORLD_WIDTH,
      height: WORLD_HEIGHT,
      floorTop: WORLD_HEIGHT - FLOOR_HEIGHT,
    },
    ghost: {
      x: WORLD_WIDTH * 0.2,
      y: WORLD_HEIGHT * 0.5,
      velocityY: 0,
      width: GHOST_WIDTH,
      height: GHOST_HEIGHT,
    },
    pipe: {
      x: WORLD_WIDTH * 0.68,
      width: PIPE_WIDTH,
      gapTop: PIPE_GAP_TOP,
      gapHeight: PIPE_GAP_HEIGHT,
      scored: false,
    },
  };
}

export function flap(state) {
  if (
    state.status !== 'ready' &&
    state.status !== 'gameOver' &&
    state.status !== 'playing'
  ) {
    throw new TypeError(`Unknown game status: ${state.status}`);
  }

  const activeState =
    state.status === 'playing' ? state : createInitialState();

  return {
    ...activeState,
    status: 'playing',
    ghost: {
      ...activeState.ghost,
      velocityY: FLAP_IMPULSE,
    },
  };
}

export function updateGame(state, deltaSeconds) {
  if (!Number.isFinite(deltaSeconds) || deltaSeconds < 0) {
    throw new RangeError('deltaSeconds must be a finite, non-negative number.');
  }

  if (state.status === 'ready' || state.status === 'gameOver') {
    return state;
  }
  if (state.status !== 'playing') {
    throw new TypeError(`Unknown game status: ${state.status}`);
  }

  const velocityY = state.ghost.velocityY + GRAVITY * deltaSeconds;
  const ghost = {
    ...state.ghost,
    y: state.ghost.y + velocityY * deltaSeconds,
    velocityY,
  };
  const pipe = {
    ...state.pipe,
    x: state.pipe.x - PIPE_SPEED * deltaSeconds,
  };
  const nextState = { ...state, ghost, pipe };

  if (hasCollision(nextState)) {
    return { ...nextState, status: 'gameOver' };
  }

  const ghostLeft = ghost.x - ghost.width / 2;
  const pipeRight = pipe.x + pipe.width;
  let score = state.score;
  let scored = pipe.scored;

  if (!scored && ghostLeft > pipeRight) {
    score += 1;
    scored = true;
  }

  if (pipe.x + pipe.width < 0) {
    return {
      ...nextState,
      score,
      pipe: {
        ...pipe,
        x: state.world.width,
        gapTop: PIPE_GAP_TOP,
        gapHeight: PIPE_GAP_HEIGHT,
        scored: false,
      },
    };
  }

  return {
    ...nextState,
    score,
    pipe: { ...pipe, scored },
  };
}

function hasCollision(state) {
  const { ghost, pipe, world } = state;
  const ghostLeft = ghost.x - ghost.width / 2;
  const ghostRight = ghost.x + ghost.width / 2;
  const ghostTop = ghost.y - ghost.height / 2;
  const ghostBottom = ghost.y + ghost.height / 2;

  if (ghostTop <= 0 || ghostBottom >= world.floorTop) {
    return true;
  }

  const pipeLeft = pipe.x;
  const pipeRight = pipe.x + pipe.width;
  const upperPipeCollision = rectanglesTouch(
    ghostLeft,
    ghostTop,
    ghostRight,
    ghostBottom,
    pipeLeft,
    0,
    pipeRight,
    pipe.gapTop,
  );
  const lowerPipeCollision = rectanglesTouch(
    ghostLeft,
    ghostTop,
    ghostRight,
    ghostBottom,
    pipeLeft,
    pipe.gapTop + pipe.gapHeight,
    pipeRight,
    world.height,
  );

  return upperPipeCollision || lowerPipeCollision;
}

function rectanglesTouch(
  firstLeft,
  firstTop,
  firstRight,
  firstBottom,
  secondLeft,
  secondTop,
  secondRight,
  secondBottom,
) {
  return (
    firstLeft <= secondRight &&
    firstRight >= secondLeft &&
    firstTop <= secondBottom &&
    firstBottom >= secondTop
  );
}

export { flap as flapGhost };
