// GameInfo.js
import React from 'react';

const GameInfo = ({ gameState }) => {
    return (
        <>
            <div className="game-info top-left">
                <p>Double Jump: {gameState.canDoubleJump ? 'Ready' : `${Math.ceil(gameState.doubleJumpCooldown / 1000)}s`}</p>
                <p>Jump again for 10 coins!</p>
            </div>
            <div className="game-info top-right">
                <p style={{ fontWeight: 'bold' }}>
                    Score: <span style={{ color: '#2563EB' }}>{gameState.score}</span> | High Score: <span style={{ color: '#2563EB' }}>{gameState.highScore}</span>
                </p>
                <p>
                    Level: <span style={{ color: '#2563EB' }}>{gameState.level}</span> | Coins: <span style={{ color: '#2563EB' }}>{gameState.coinCount}</span> | Lives: <span style={{ color: '#2563EB' }}>{gameState.lives}</span>
                </p>
            </div>
        </>
    );
};

export default GameInfo;