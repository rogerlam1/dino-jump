// GameContainer.js
import React from 'react';
import GameInfo from './GameInfo';
import GameObjects from './GameObjects';

const GameContainer = ({ gameState, scale, handleJump, startGame }) => {
    return (
        <div className="game-area" style={{ transform: `scale(${scale})` }}>
            {gameState.gameStarted ? (
                <>
                    <GameInfo gameState={gameState} />
                    <GameObjects 
                        gameState={gameState} 
                        handleJump={handleJump}
                    />
                </>
            ) : (
                !gameState.gameOver && (
                    <div className="start-overlay">
                        <button className="start-button" onClick={startGame}>Start Game</button>
                    </div>
                )
            )}
        </div>
    );
};

export default GameContainer;