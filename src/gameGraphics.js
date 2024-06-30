import React from 'react';
import { DINO_WIDTH, DINO_HEIGHT, SNAKE_WIDTH, SNAKE_HEIGHT } from './gameSettings';
import dinoGif from './img/dino.gif';
import personGif from './img/person.gif';
import snakeGif from './img/snake.gif';

export const DinoGif = () => (
  <img src={dinoGif} alt="Dino" style={{ width: DINO_WIDTH, height: DINO_HEIGHT }} />
);

export const ManGif = () => (
  <img src={personGif} alt="Person" style={{ width: 30, height: 50 }} />
);

export const SnakeGif = () => (
  <img src={snakeGif} alt="Snake" style={{ width: SNAKE_WIDTH, height: SNAKE_HEIGHT }} />
);