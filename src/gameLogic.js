// gameLogic.js
import {
    GAME_HEIGHT,
    DINO_HEIGHT,
    DINO_WIDTH,
    SNAKE_WIDTH,
    SNAKE_HEIGHT,
    SNAKE_HITBOX_REDUCTION,
    JUMP_INITIAL_VELOCITY,
    DOUBLE_JUMP_COOLDOWN,
    SECOND_DOUBLE_JUMP_COST
  } from './gameSettings';
  
  export const performJump = (dinoY, isInAir, canDoubleJump, coins, setDinoVelocityY, setIsInAir, setCoins, setJumps, setCanDoubleJump, setDoubleJumpCooldown, setManPosition) => {
    if (dinoY === GAME_HEIGHT - DINO_HEIGHT) {
      // Regular jump
      setDinoVelocityY(-JUMP_INITIAL_VELOCITY);
      setIsInAir(true);
      setCoins(prevCoins => prevCoins + 1);
      setJumps(prevJumps => prevJumps + 1);
      setManPosition(prevPosition => Math.max(0, prevPosition - 20));
    } else if (isInAir) {
      if (canDoubleJump) {
        // First double jump
        setDinoVelocityY(-JUMP_INITIAL_VELOCITY);
        setCanDoubleJump(false);
        setDoubleJumpCooldown(DOUBLE_JUMP_COOLDOWN);
        setCoins(prevCoins => prevCoins + 1);
        setManPosition(prevPosition => Math.max(0, prevPosition - 15));
      } else if (coins >= SECOND_DOUBLE_JUMP_COST) {
        // Second double jump
        setDinoVelocityY(-JUMP_INITIAL_VELOCITY);
        setCoins(prevCoins => prevCoins - SECOND_DOUBLE_JUMP_COST);
        setManPosition(prevPosition => Math.max(0, prevPosition - 10));
      }
    }
  };
  
  export const checkCollisions = (dinoY, snakes, setLives, setSnakes) => {
    let collisions = 0;
    const survivingSnakes = snakes.filter(snake => {
      const dinoHitbox = {
        x: 50,
        y: dinoY,
        width: DINO_WIDTH,
        height: DINO_HEIGHT
      };
      const snakeHitbox = {
        x: snake.x + SNAKE_WIDTH * (1 - SNAKE_HITBOX_REDUCTION) / 2,
        y: snake.y + SNAKE_HEIGHT * (1 - SNAKE_HITBOX_REDUCTION) / 2,
        width: SNAKE_WIDTH * SNAKE_HITBOX_REDUCTION,
        height: SNAKE_HEIGHT * SNAKE_HITBOX_REDUCTION
      };
  
      if (
        dinoHitbox.x < snakeHitbox.x + snakeHitbox.width &&
        dinoHitbox.x + dinoHitbox.width > snakeHitbox.x &&
        dinoHitbox.y < snakeHitbox.y + snakeHitbox.height &&
        dinoHitbox.y + dinoHitbox.height > snakeHitbox.y
      ) {
        collisions++;
        return false; // Remove the snake
      }
      return true; // Keep the snake
    });
  
    if (collisions > 0) {
      setLives(prevLives => Math.max(0, prevLives - collisions));
    }
  
    setSnakes(survivingSnakes);
  };