export const GRID_SIZE = 20;

export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

export const OPPOSITE = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

export const createInitialState = (gridSize = GRID_SIZE, rng = Math.random) => {
  const mid = Math.floor(gridSize / 2);
  const snake = [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ];

  return {
    gridSize,
    snake,
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    food: placeFood(snake, gridSize, rng),
    score: 0,
    status: 'running', // running | gameover | won
  };
};

export const isSameCell = (a, b) => a.x === b.x && a.y === b.y;

export const isOutOfBounds = (pos, gridSize) =>
  pos.x < 0 || pos.y < 0 || pos.x >= gridSize || pos.y >= gridSize;

export const getNextDirection = (current, requested) => {
  if (!requested) return current;
  if (OPPOSITE[current] === requested) return current;
  return requested;
};

export const placeFood = (snake, gridSize, rng = Math.random) => {
  const occupied = new Set(snake.map((c) => `${c.x},${c.y}`));
  const available = [];

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) available.push({ x, y });
    }
  }

  if (available.length === 0) return null;
  const idx = Math.floor(rng() * available.length);
  return available[idx];
};

export const stepState = (state, rng = Math.random) => {
  if (state.status !== 'running') return state;

  const direction = getNextDirection(state.direction, state.nextDirection);
  const delta = DIRECTIONS[direction];
  const head = state.snake[0];
  const nextHead = { x: head.x + delta.x, y: head.y + delta.y };

  if (isOutOfBounds(nextHead, state.gridSize)) {
    return { ...state, status: 'gameover', direction };
  }

  const body = state.snake.slice(0, -1);
  const hitSelf = body.some((cell) => isSameCell(cell, nextHead));
  if (hitSelf) {
    return { ...state, status: 'gameover', direction };
  }

  const eatsFood = state.food && isSameCell(nextHead, state.food);
  const nextSnake = [nextHead, ...state.snake];
  if (!eatsFood) nextSnake.pop();

  let nextFood = state.food;
  let nextScore = state.score;
  let nextStatus = state.status;

  if (eatsFood) {
    nextScore += 1;
    nextFood = placeFood(nextSnake, state.gridSize, rng);
    if (!nextFood) nextStatus = 'won';
  }

  return {
    ...state,
    snake: nextSnake,
    direction,
    food: nextFood,
    score: nextScore,
    status: nextStatus,
  };
};

export const enqueueDirection = (state, requested) => ({
  ...state,
  nextDirection: getNextDirection(state.direction, requested),
});
