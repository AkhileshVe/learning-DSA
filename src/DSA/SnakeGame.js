import { useEffect, useMemo, useState } from 'react';
import {
  GRID_SIZE,
  createInitialState,
  enqueueDirection,
  stepState,
} from './snakeLogic';

const TICK_MS = 140;

const KEY_TO_DIR = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  w: 'UP',
  a: 'LEFT',
  s: 'DOWN',
  d: 'RIGHT',
  W: 'UP',
  A: 'LEFT',
  S: 'DOWN',
  D: 'RIGHT',
};

const SnakeGame = () => {
  const [state, setState] = useState(() => createInitialState(GRID_SIZE));

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === ' ' || event.key === 'p' || event.key === 'P') {
        event.preventDefault();
        setState((prev) => ({
          ...prev,
          status: prev.status === 'running' ? 'paused' : 'running',
        }));
        return;
      }
      const dir = KEY_TO_DIR[event.key];
      if (!dir) return;
      event.preventDefault();
      setState((prev) => enqueueDirection(prev, dir));
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setState((prev) => stepState(prev));
    }, TICK_MS);

    return () => clearInterval(timer);
  }, []);

  const cells = useMemo(() => {
    const set = new Set(state.snake.map((c) => `${c.x},${c.y}`));
    return set;
  }, [state.snake]);

  const restart = () => setState(createInitialState(GRID_SIZE));
  const togglePause = () =>
    setState((prev) => ({
      ...prev,
      status: prev.status === 'running' ? 'paused' : 'running',
    }));

  const statusText =
    state.status === 'won'
      ? 'You filled the grid.'
      : state.status === 'gameover'
      ? 'Game over.'
      : state.status === 'paused'
      ? 'Paused.'
      : 'Eat the food and keep moving.';

  return (
    <section className="snake">
      <div className="snake-header">
        <div>
          <h2>Snake</h2>
          <p className="snake-subtitle">{statusText}</p>
        </div>
        <div className="snake-score">
          <span>Score</span>
          <strong>{state.score}</strong>
        </div>
      </div>

      <div
        className="snake-grid"
        style={{
          gridTemplateColumns: `repeat(${state.gridSize}, 16px)`,
          gridTemplateRows: `repeat(${state.gridSize}, 16px)`,
        }}
        role="grid"
        aria-label="Snake game board"
      >
        {Array.from({ length: state.gridSize * state.gridSize }).map((_, idx) => {
          const x = idx % state.gridSize;
          const y = Math.floor(idx / state.gridSize);
          const key = `${x},${y}`;
          const isSnake = cells.has(key);
          const isFood = state.food && state.food.x === x && state.food.y === y;

          return (
            <div
              key={key}
              className={
                isSnake
                  ? 'snake-cell snake-cell--snake'
                  : isFood
                  ? 'snake-cell snake-cell--food'
                  : 'snake-cell'
              }
            />
          );
        })}
      </div>

      <div className="snake-controls">
        <div className="snake-controls-row">
          <button type="button" onClick={restart} className="snake-button">
            Restart
          </button>
          <button type="button" onClick={togglePause} className="snake-button">
            {state.status === 'paused' ? 'Resume' : 'Pause'}
          </button>
        </div>
        <div className="snake-pad">
          <button
            type="button"
            className="snake-button"
            onClick={() => setState((prev) => enqueueDirection(prev, 'UP'))}
          >
            Up
          </button>
          <div className="snake-pad-row">
            <button
              type="button"
              className="snake-button"
              onClick={() => setState((prev) => enqueueDirection(prev, 'LEFT'))}
            >
              Left
            </button>
            <button
              type="button"
              className="snake-button"
              onClick={() => setState((prev) => enqueueDirection(prev, 'DOWN'))}
            >
              Down
            </button>
            <button
              type="button"
              className="snake-button"
              onClick={() => setState((prev) => enqueueDirection(prev, 'RIGHT'))}
            >
              Right
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SnakeGame;
