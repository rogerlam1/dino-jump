// gameLogic.js
import {
    GAME_HEIGHT,
    GAME_WIDTH,
    DINO_WIDTH,
    DINO_HEIGHT,
    SNAKE_WIDTH,
    SNAKE_HEIGHT,
    SNAKE_HITBOX_REDUCTION,
    GRAVITY,
    JUMP_INITIAL_VELOCITY,
    DOUBLE_JUMP_COOLDOWN,
    MIN_SNAKE_DISTANCE,
    SECOND_DOUBLE_JUMP_COST,
    INITIAL_MAN_POSITION,
    INITIAL_LIVES,
    COIN_SIZE,
    COIN_SPAWN_RATE,
    MAX_JUMP_HEIGHT,
} from './gameSettings';

export const initializeGameState = () => ({
    dinoY: GAME_HEIGHT - DINO_HEIGHT,
    dinoVelocityY: 0,
    canDoubleJump: true,
    doubleJumpCooldown: 0,
    isInAir: false,
    snakes: [],
    coins: [],
    score: 0,
    highScore: 0,
    level: 1,
    gameOver: false,
    gameStarted: false,
    coinCount: 0,
    lives: INITIAL_LIVES,
    maxLives: INITIAL_LIVES,
    manPosition: INITIAL_MAN_POSITION,
    targetManPosition: INITIAL_MAN_POSITION,
});

export const jump = (state) => {
    let newState = { ...state };

    if (state.dinoY === GAME_HEIGHT - DINO_HEIGHT) {
        newState.dinoVelocityY = -JUMP_INITIAL_VELOCITY;
        newState.isInAir = true;
        newState.targetManPosition = Math.max(0, state.targetManPosition - 20);
    } else if (state.isInAir) {
        if (state.canDoubleJump) {
            newState.dinoVelocityY = -JUMP_INITIAL_VELOCITY;
            newState.canDoubleJump = false;
            newState.doubleJumpCooldown = DOUBLE_JUMP_COOLDOWN;
            newState.targetManPosition = Math.max(0, state.targetManPosition - 15);
        } else if (state.coinCount >= SECOND_DOUBLE_JUMP_COST) {
            newState.dinoVelocityY = -JUMP_INITIAL_VELOCITY;
            newState.coinCount -= SECOND_DOUBLE_JUMP_COST;
            newState.targetManPosition = Math.max(0, state.targetManPosition - 10);
        }
    }

    return newState;
};

export const updateGameState = (state) => {
    let newState = { ...state };

    // Dino jumping and falling logic
    newState.dinoY += newState.dinoVelocityY;
    if (newState.dinoY > GAME_HEIGHT - DINO_HEIGHT) {
        newState.dinoY = GAME_HEIGHT - DINO_HEIGHT;
        newState.dinoVelocityY = 0;
        newState.isInAir = false;
    } else {
        newState.dinoVelocityY += GRAVITY;
    }

    // Double jump cooldown logic
    if (newState.doubleJumpCooldown > 0) {
        newState.doubleJumpCooldown -= 20;
        if (newState.doubleJumpCooldown <= 0) {
            newState.canDoubleJump = true;
            newState.doubleJumpCooldown = 0;
        }
    }

    // Snake movement and collision detection
    newState.snakes = newState.snakes
        .map(snake => ({
            ...snake,
            x: snake.x - (2.5 + newState.level * 0.5 + Math.random()),
        }))
        .filter(snake => snake.x >= 0);

    const dinoHitbox = {
        x: 50,
        y: newState.dinoY,
        width: DINO_WIDTH,
        height: DINO_HEIGHT,
    };

    let collisions = 0;
    newState.snakes = newState.snakes.filter(snake => {
        const snakeHitbox = {
            x: snake.x + SNAKE_WIDTH * (1 - SNAKE_HITBOX_REDUCTION) / 2,
            y: snake.y + SNAKE_HEIGHT * (1 - SNAKE_HITBOX_REDUCTION) / 2,
            width: SNAKE_WIDTH * SNAKE_HITBOX_REDUCTION,
            height: SNAKE_HEIGHT * SNAKE_HITBOX_REDUCTION,
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
        newState.lives = Math.max(0, newState.lives - collisions);
    }

    // Coin movement and collection
    newState.coins = newState.coins
        .map(coin => ({
            ...coin,
            x: coin.x - (2 + newState.level * 0.3),
        }))
        .filter(coin => {
            const coinHitbox = {
                x: coin.x,
                y: coin.y,
                width: COIN_SIZE,
                height: COIN_SIZE,
            };

            if (
                dinoHitbox.x < coinHitbox.x + coinHitbox.width &&
                dinoHitbox.x + dinoHitbox.width > coinHitbox.x &&
                dinoHitbox.y < coinHitbox.y + coinHitbox.height &&
                dinoHitbox.y + dinoHitbox.height > coinHitbox.y
            ) {
                newState.coinCount++;
                newState.score += 10;
                return false; // Remove the collected coin
            }
            return coin.x >= -COIN_SIZE; // Remove coins that have left the screen
        });

    // Spawn new snakes
    if (Math.random() < 0.01 + newState.level * 0.002) {
        const lastSnake = newState.snakes[newState.snakes.length - 1];
        if (!lastSnake || GAME_WIDTH - lastSnake.x >= MIN_SNAKE_DISTANCE) {
            newState.snakes.push({ x: GAME_WIDTH, y: GAME_HEIGHT - SNAKE_HEIGHT });
        }
    }

    // Spawn new coins
    if (Math.random() < COIN_SPAWN_RATE) {
        const lastCoin = newState.coins[newState.coins.length - 1];
        if (!lastCoin || GAME_WIDTH - lastCoin.x >= GAME_WIDTH / 2) {
            const coinY = GAME_HEIGHT - DINO_HEIGHT - MAX_JUMP_HEIGHT + Math.random() * (MAX_JUMP_HEIGHT / 2);
            newState.coins.push({ x: GAME_WIDTH, y: coinY });
        }
    }

    // Update score and level
    newState.score += 1;
    newState.highScore = Math.max(newState.highScore, newState.score);
    if (newState.score > 0 && newState.score % 500 === 0) {
        newState.level += 1;
    }

    // Smooth man movement
    if (newState.manPosition !== newState.targetManPosition) {
        const diff = newState.targetManPosition - newState.manPosition;
        const step = Math.sign(diff) * Math.min(Math.abs(diff), 2); // Adjust 2 to control speed
        newState.manPosition += step;
    }

    // Check if dino caught the man
    if (newState.manPosition <= 50 + DINO_WIDTH) {
        newState.lives += 1;
        newState.maxLives = Math.max(newState.maxLives, newState.lives);
        newState.manPosition = INITIAL_MAN_POSITION;
        newState.targetManPosition = INITIAL_MAN_POSITION;
    }

    // Check for game over
    if (newState.lives <= 0) {
        newState.gameOver = true;
        newState.gameStarted = false;
    }

    return newState;
};