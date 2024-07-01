// EvansDinoJumpingGame.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from './AlertDialog';
import { DinoGif, ManGif, SnakeGif, CoinGif } from './gameGraphics';
import { GAME_HEIGHT, GAME_WIDTH, DINO_HEIGHT, COIN_SIZE } from './gameSettings';
import { initializeGameState, jump, updateGameState } from './gameLogic';
import './EvansDinoJumpingGame.css';

const EvansDinoJumpingGame = () => {
    const [gameState, setGameState] = useState(initializeGameState());
    const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);
    const [scale, setScale] = useState(1);
    const gameContainerRef = useRef(null);

    const startGame = useCallback(() => {
        setGameState(prevState => ({
            ...initializeGameState(),
            highScore: prevState.highScore,
            gameStarted: true
        }));
    }, []);

    const handleJump = useCallback(() => {
        if (gameState.gameStarted && (isLandscape || window.innerWidth >= 768)) {
            setGameState(prevState => jump(prevState));
        }
    }, [gameState.gameStarted, isLandscape]);

    const handleResize = useCallback(() => {
        const isLandscapeMode = window.innerWidth > window.innerHeight;
        setIsLandscape(isLandscapeMode);

        if (gameContainerRef.current) {
            const containerWidth = gameContainerRef.current.offsetWidth;
            const containerHeight = gameContainerRef.current.offsetHeight;
            const scaleX = containerWidth / GAME_WIDTH;
            const scaleY = containerHeight / GAME_HEIGHT;
            const newScale = Math.min(scaleX, scaleY, 1);
            setScale(newScale);
        }
    }, []);

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

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
        if (!gameState.gameStarted || (!isLandscape && window.innerWidth < 768)) return;

        const gameLoop = setInterval(() => {
            setGameState(prevState => updateGameState(prevState));
        }, 20);

        return () => clearInterval(gameLoop);
    }, [gameState.gameStarted, isLandscape]);

    const shouldShowGame = isLandscape || window.innerWidth >= 768;

    return (
        <div 
            ref={gameContainerRef}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100vw',
                height: '100vh',
                backgroundColor: '#f3f4f6',
                overflow: 'hidden'
            }}
        >
            {shouldShowGame ? (
                <div
                    style={{
                        position: 'relative',
                        width: GAME_WIDTH * scale,
                        height: GAME_HEIGHT * scale,
                        backgroundColor: 'white',
                        border: '4px solid gray', // Changed border color to gray
                        overflow: 'hidden'
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: GAME_WIDTH,
                        height: GAME_HEIGHT,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                    }}>
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
                                    <p style={{ fontWeight: 'bold' }}>
                                        Score: <span style={{ color: '#2563EB' }}>{gameState.score}</span> | High Score: <span style={{ color: '#2563EB' }}>{gameState.highScore}</span>
                                    </p>
                                    <p>
                                        Level: <span style={{ color: '#2563EB' }}>{gameState.level}</span> | Coins: <span style={{ color: '#2563EB' }}>{gameState.coinCount}</span> | Lives: <span style={{ color: '#2563EB' }}>{gameState.lives}</span>
                                    </p>
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
                                {gameState.coins.map((coin, index) => (
                                    <div
                                        key={`coin-${index}`}
                                        style={{
                                            position: 'absolute',
                                            left: coin.x,
                                            top: coin.y,
                                            width: COIN_SIZE,
                                            height: COIN_SIZE,
                                        }}
                                    >
                                        <CoinGif />
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
                </div>
            ) : (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '1rem',
                }}>
                    <h2>Please rotate your device to landscape mode</h2>
                    <p>The game is paused and will resume when you rotate your device.</p>
                </div>
            )}
            <AlertDialog open={gameState.gameOver}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Game Over!</AlertDialogTitle>
                        <AlertDialogDescription>
                            Your score: {gameState.score}
                            <br />
                            High score: {gameState.highScore}
                            <br />
                            Coins collected: {gameState.coinCount}
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