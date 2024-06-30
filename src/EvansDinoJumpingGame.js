import React, { useState, useEffect, useCallback } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from './AlertDialog';
import { DinoGif, ManGif, SnakeGif } from './gameGraphics';
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
} from './gameSettings';

const EvansDinoJumpingGame = () => {
  const [dinoY, setDinoY] = useState(GAME_HEIGHT - DINO_HEIGHT);
  const [dinoVelocityY, setDinoVelocityY] = useState(0);
  const [canDoubleJump, setCanDoubleJump] = useState(true);
  const [doubleJumpCooldown, setDoubleJumpCooldown] = useState(0);
  const [isInAir, setIsInAir] = useState(false);
  const [snakes, setSnakes] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [coins, setCoins] = useState(0);
  const [jumps, setJumps] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [maxLives, setMaxLives] = useState(INITIAL_LIVES);
  const [manPosition, setManPosition] = useState(INITIAL_MAN_POSITION);

  const startGame = useCallback(() => {
    setGameStarted(true);
    setScore(0);
    setLevel(1);
    setSnakes([]);
    setGameOver(false);
    setDinoY(GAME_HEIGHT - DINO_HEIGHT);
    setDinoVelocityY(0);
    setCanDoubleJump(true);
    setDoubleJumpCooldown(0);
    setIsInAir(false);
    setCoins(0);
    setJumps(0);
    setLives(INITIAL_LIVES);
    setMaxLives(INITIAL_LIVES);
    setManPosition(INITIAL_MAN_POSITION);
  }, []);

  const jump = useCallback(() => {
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
  }, [dinoY, isInAir, canDoubleJump, coins]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (gameStarted) {
          jump();
        }
      } else if (e.code === 'Enter') {
        if (gameOver) {
          startGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump, gameStarted, gameOver, startGame]);

  useEffect(() => {
    if (!gameStarted) return;

    const gameLoop = setInterval(() => {
      // Dino jumping and falling logic
      setDinoY(prevY => {
        const newY = prevY + dinoVelocityY;
        if (newY > GAME_HEIGHT - DINO_HEIGHT) {
          setDinoVelocityY(0);
          setIsInAir(false);
          return GAME_HEIGHT - DINO_HEIGHT;
        }
        setDinoVelocityY(prevVelocity => prevVelocity + GRAVITY);
        return newY;
      });

      // Double jump cooldown logic
      if (doubleJumpCooldown > 0) {
        setDoubleJumpCooldown(prevCooldown => {
          const newCooldown = prevCooldown - 20;
          if (newCooldown <= 0) {
            setCanDoubleJump(true);
            return 0;
          }
          return newCooldown;
        });
      }

      // Snake movement and collision detection
      setSnakes(prevSnakes => {
        const newSnakes = prevSnakes.map(snake => ({
          ...snake,
          x: snake.x - (3 + level * 0.5 + Math.random()), // Snakes move at varying speeds
        })).filter(snake => snake.x + SNAKE_WIDTH > 0);

        const dinoHitbox = {
          x: 50,
          y: dinoY,
          width: DINO_WIDTH,
          height: DINO_HEIGHT
        };

        let collisions = 0;
        const survivingSnakes = newSnakes.filter(snake => {
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

        return survivingSnakes;
      });

      // Spawn new snakes
      if (Math.random() < 0.01 + level * 0.002) {
        const lastSnake = snakes[snakes.length - 1];
        if (!lastSnake || GAME_WIDTH - lastSnake.x >= MIN_SNAKE_DISTANCE) {
          setSnakes(prevSnakes => [...prevSnakes, { x: GAME_WIDTH, y: GAME_HEIGHT - SNAKE_HEIGHT }]);
        }
      }

      setScore(prevScore => {
        const newScore = prevScore + 1;
        setHighScore(prevHighScore => Math.max(prevHighScore, newScore));
        return newScore;
      });

      if (score > 0 && score % 500 === 0) {
        setLevel(prevLevel => prevLevel + 1);
      }

      // Check if dino caught the man
      if (manPosition <= DINO_WIDTH) {
        setLives(prevLives => {
          const newLives = prevLives + 1;
          setMaxLives(prevMaxLives => Math.max(prevMaxLives, newLives));
          return newLives;
        });
        setManPosition(INITIAL_MAN_POSITION);
      }

      // Check for game over
      if (lives <= 0) {
        setGameOver(true);
        setGameStarted(false);
      }
    }, 20);

    return () => clearInterval(gameLoop);
  }, [level, score, gameStarted, dinoY, dinoVelocityY, doubleJumpCooldown, snakes, manPosition, lives]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f3f4f6'
    }}>
      <div style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Evan's Dino Jumping Game</h1>
        <p style={{ fontSize: '1.25rem' }}>Score: {score} | High Score: {highScore} | Level: {level}</p>
        <p style={{ fontSize: '1.125rem' }}>Coins: {coins} | Jumps: {jumps} | Lives: {lives}</p>
        <p style={{ fontSize: '1.125rem' }}>
          Double Jump: {canDoubleJump ? 'Ready' : `Cooldown: ${Math.ceil(doubleJumpCooldown / 1000)}s`} | 
          Second Double Jump Cost: {SECOND_DOUBLE_JUMP_COST} coins
        </p>
        <p style={{ fontSize: '1.125rem' }}>Distance to Man: {manPosition}</p>
      </div>
      <div
        style={{
          position: 'relative',
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          backgroundColor: 'white',
          border: '4px solid #3b82f6'
        }}
      >
        {gameStarted && (
          <>
            <div
              style={{
                position: 'absolute',
                left: 50,
                bottom: GAME_HEIGHT - dinoY - DINO_HEIGHT,
                transition: 'bottom 0.1s ease-out',
              }}
            >
              <DinoGif />
            </div>
            <div
              style={{
                position: 'absolute',
                left: manPosition,
                bottom: 0,
              }}
            >
              <ManGif />
            </div>
            {snakes.map((snake, index) => (
              <div
                key={`snake-${index}`}
                style={{
                  position: 'absolute',
                  left: snake.x,
                  bottom: 0,
                }}
              >
                <SnakeGif />
              </div>
            ))}
          </>
        )}
        {!gameStarted && !gameOver && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}>
            <button
              style={{
                padding: '0.5rem 1rem',
                color: 'white',
                backgroundColor: '#3b82f6',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}
              onClick={startGame}
            >
              Start Game
            </button>
          </div>
        )}
      </div>
      <AlertDialog open={gameOver}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Game Over!</AlertDialogTitle>
            <AlertDialogDescription>
              Your score: {score}
              <br />
              High score: {highScore}
              <br />
              Coins collected: {coins}
              <br />
              Total jumps: {jumps}
              <br />
              Levels completed: {level - 1}
              <br />
              Max lives reached: {maxLives}
              <br />
              Press Enter to play again
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EvansDinoJumpingGame;