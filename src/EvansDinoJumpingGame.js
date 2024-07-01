// EvansDinoJumpingGame.js
import React from 'react';
import GameContainer from './GameContainer';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from './AlertDialog';
import useGameLogic from './useGameLogic';
import './EvansDinoJumpingGame.css';

const EvansDinoJumpingGame = () => {
    const { gameState, startGame, handleJump, gameContainerRef, shouldShowGame, scale } = useGameLogic();

    return (
        <div 
            ref={gameContainerRef}
            className="game-container"
            onMouseDown={handleJump}
            onTouchStart={handleJump}
        >
            {shouldShowGame ? (
                <GameContainer 
                    gameState={gameState} 
                    scale={scale} 
                    handleJump={handleJump} 
                    startGame={startGame}
                />
            ) : (
                <div className="rotate-device-message">
                    <h2>Please rotate your device to landscape mode</h2>
                    <p>The game is paused and will resume when you rotate your device.</p>
                </div>
            )}
            <AlertDialog open={gameState.gameOver}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Game Over!</AlertDialogTitle>
                        <br/>
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
                        <br />
                        <button className="play-again-button" onClick={startGame}>Play Again</button>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default EvansDinoJumpingGame;