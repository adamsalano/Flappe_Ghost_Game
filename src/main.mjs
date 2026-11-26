import { createInitialState, flap, updateGame } from './game-logic.mjs';

const canvas = document.getElementById('game-canvas');

if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error('The game canvas was not found.');
}

const context = canvas.getContext('2d');

if (!context) {
  throw new Error('A Canvas 2D context is not available.');
}

let state = createInitialState();
let previousTimestamp;

function render() {
  const { world, ghost, pipe, score, status } = state;

  context.fillStyle = '#87ceeb';
  context.fillRect(0, 0, world.width, world.height);

  context.fillStyle = '#38a34a';
  context.fillRect(pipe.x, 0, pipe.width, pipe.gapTop);
  context.fillRect(
    pipe.x,
    pipe.gapTop + pipe.gapHeight,
    pipe.width,
    world.height - pipe.gapTop - pipe.gapHeight,
  );

  context.fillStyle = '#333a40';
  context.fillRect(
    0,
    world.floorTop,
    world.width,
    world.height - world.floorTop,
  );

  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = `${ghost.height}px system-ui, sans-serif`;
  context.fillStyle = '#ffffff';
  context.fillText('👻', ghost.x, ghost.y);

  context.font = 'bold 32px system-ui, sans-serif';
  context.fillStyle = '#17324d';
  context.fillText(String(score), world.width / 2, 42);

  if (status === 'ready') {
    drawMessage('Flappy Ghost', 'Press Space or click to start', world);
  } else if (status === 'gameOver') {
    drawMessage('Game Over', 'Press Space or click to restart', world);
  }
}

function drawMessage(title, instruction, world) {
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = '#17324d';
  context.font = 'bold 36px system-ui, sans-serif';
  context.fillText(title, world.width / 2, world.height * 0.3);
  context.font = '20px system-ui, sans-serif';
  context.fillText(instruction, world.width / 2, world.height * 0.3 + 42);
}

function handleFlap() {
  state = flap(state);
  render();
}

window.addEventListener('keydown', (event) => {
  if (event.code !== 'Space') {
    return;
  }

  event.preventDefault();
  if (!event.repeat) {
    handleFlap();
  }
});

canvas.addEventListener('click', handleFlap);

function frame(timestamp) {
  const deltaSeconds =
    previousTimestamp === undefined
      ? 0
      : Math.min((timestamp - previousTimestamp) / 1000, 0.05);
  previousTimestamp = timestamp;

  state = updateGame(state, deltaSeconds);
  render();
  window.requestAnimationFrame(frame);
}

render();
window.requestAnimationFrame(frame);
