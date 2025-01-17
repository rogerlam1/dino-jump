// gameSettings.js
export const GAME_HEIGHT = 400;
export const GAME_WIDTH = 720;
export const DINO_WIDTH = 70; 
export const DINO_HEIGHT = 90; 
export const SNAKE_WIDTH = 40;
export const SNAKE_HEIGHT = 15;
export const SNAKE_HITBOX_REDUCTION = 0.6;
export const GRAVITY = 0.5;
export const JUMP_INITIAL_VELOCITY = 13;
export const DOUBLE_JUMP_COOLDOWN = 10000;
export const MIN_SNAKE_DISTANCE = 200;
export const SECOND_DOUBLE_JUMP_COST = 10;
export const INITIAL_MAN_POSITION = 600;
export const INITIAL_LIVES = 1;
export const COIN_SIZE = 30;
export const COIN_SPAWN_RATE = 0.01;
export const MAX_JUMP_HEIGHT = JUMP_INITIAL_VELOCITY * JUMP_INITIAL_VELOCITY / (2 * GRAVITY);