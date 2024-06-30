import React, { useState, useEffect, useCallback } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from './AlertDialog';
import { DinoGif, ManGif, SnakeGif } from './gameGraphics';
import { GAME_HEIGHT, GAME_WIDTH, DINO_HEIGHT } from './gameSettings';
import { initializeGameState, jump, updateGameState } from './gameLogic';

const EvansDinoJumpingGame = () => {
  const [gameState, setGameState] = useState(initializeGameState());

  const startGame = useCallback(() => {
    setGameState(prevState => ({
      ...initializeGameState(),
      highScore: prevState.highScore,
      gameStarted: true
    }));
  }, []);

  const handleJump = useCallback(() => {
    if (gameState.gameStarted) {
      setGameState(prevState => jump(prevState));
    }
  }, [gameState.gameStarted]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        handleJump();
      } else if (e.code === 'Enter') {
        if (gameState.gameOver) {
          startGame();
        }
      }
    };

    const handleMouseClick = () => {
      handleJump();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseClick);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseClick);
    };
  }, [handleJump, gameState.gameOver, startGame]);

  useEffect(() => {
    if (!gameState.gameStarted) return;

    const gameLoop = setInterval(() => {
      setGameState(prevState => updateGameState(prevState));
    }, 20);

    return () => clearInterval(gameLoop);
  }, [gameState.gameStarted]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f3f4f6'
    }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem' }}>Dino Jump</h1>
      <div
        style={{
          position: 'relative',
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          backgroundColor: 'white',
          border: '4px solid #3b82f6'
        }}
      >
        {gameState.gameStarted && (
          <>
            <div
              style={{
                position: 'absolute',
                top: 10,
                left: 10,
                fontSize: '0.875rem',
                fontWeight: 'bold',
                color: '#4b5563',
                zIndex: 10,
              }}
            >
              <p>Double Jump: {gameState.canDoubleJump ? 'Ready' : `${Math.ceil(gameState.doubleJumpCooldown / 1000)}s`}</p>
            </div>
            <div
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                fontSize: '0.875rem',
                fontWeight: 'bold',
                color: '#4b5563',
                textAlign: 'right',
                zIndex: 10,
              }}
            >
              <p style={{ fontWeight: 'bold' }}>Score: {gameState.score} | High Score: {gameState.highScore}</p>
              <p>Level: {gameState.level}</p>
              <p>Coins: {gameState.coins}</p>
              <p>Lives: {gameState.lives}</p>
            </div>
            <div
              style={{
                position: 'absolute',
                left: 50,
                bottom: GAME_HEIGHT - gameState.dinoY - DINO_HEIGHT,
                transition: 'bottom 0.1s ease-out',
              }}
            >
              <DinoGif />
            </div>
            <div
              style={{
                position: 'absolute',
                left: gameState.manPosition,
                bottom: 0,
              }}
            >
              <ManGif />
            </div>
            {gameState.snakes.map((snake, index) => (
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
        {!gameState.gameStarted && !gameState.gameOver && (
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
      <AlertDialog open={gameState.gameOver}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Game Over!</AlertDialogTitle>
            <AlertDialogDescription>
              Your score: {gameState.score}
              <br />
              High score: {gameState.highScore}
              <br />
              Coins collected: {gameState.coins}
              <br />
              Levels completed: {gameState.level - 1}
              <br />
              Max lives reached: {gameState.maxLives}
            </AlertDialogDescription>
            <button
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                color: 'white',
                backgroundColor: '#3b82f6',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}
              onClick={startGame}
            >
              Play Again
            </button>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EvansDinoJumpingGame;