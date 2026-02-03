import {
  createInitialState,
  enqueueDirection,
  placeFood,
  stepState,
} from './snakeLogic';

const makeRng = (values) => {
  let idx = 0;
  return () => {
    const value = values[idx % values.length];
    idx += 1;
    return value;
  };
};

const headAt = (state) => state.snake[0];

it('moves the snake forward each tick', () => {
  const state = createInitialState(6, makeRng([0]));
  const next = stepState(state, makeRng([0]));
  expect(headAt(next)).toEqual({ x: headAt(state).x + 1, y: headAt(state).y });
});

it('prevents reversing direction', () => {
  const state = createInitialState(6, makeRng([0]));
  const withReverse = enqueueDirection(state, 'LEFT');
  const next = stepState(withReverse, makeRng([0]));
  expect(headAt(next)).toEqual({ x: headAt(state).x + 1, y: headAt(state).y });
});

it('grows when eating food', () => {
  const rng = makeRng([0]);
  const state = createInitialState(6, rng);
  const foodAhead = { x: headAt(state).x + 1, y: headAt(state).y };
  const withFood = { ...state, food: foodAhead };
  const next = stepState(withFood, rng);
  expect(next.snake.length).toBe(state.snake.length + 1);
  expect(next.score).toBe(1);
});

it('detects wall collision', () => {
  const state = createInitialState(4, makeRng([0]));
  const nearWall = {
    ...state,
    snake: [{ x: 3, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 0 }],
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
  };
  const next = stepState(nearWall, makeRng([0]));
  expect(next.status).toBe('gameover');
});

it('places food on an empty cell', () => {
  const state = createInitialState(4, makeRng([0]));
  const food = placeFood(state.snake, 4, makeRng([0.5]));
  const collision = state.snake.some((cell) => cell.x === food.x && cell.y === food.y);
  expect(collision).toBe(false);
});
