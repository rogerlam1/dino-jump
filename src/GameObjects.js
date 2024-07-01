// GameObjects.js
import React from 'react';
import { DinoGif, ManGif, SnakeGif, CoinGif } from './gameGraphics';
import { GAME_HEIGHT, DINO_HEIGHT } from './gameSettings';

const GameObjects = ({ gameState, handleJump }) => {
    return (
        <>
            <div
                className="dino"
                style={{ left: 50, bottom: `${GAME_HEIGHT - DINO_HEIGHT - gameState.dinoY}px` }}
                onMouseDown={handleJump}
                onTouchStart={handleJump}
            >
                <DinoGif />
            </div>
            <div className="man" style={{ left: gameState.manPosition, bottom: 0 }}>
                <ManGif />
            </div>
            {gameState.snakes.map((snake, index) => (
                <div key={`snake-${index}`} className="snake" style={{ left: snake.x, bottom: 0 }}>
                    <SnakeGif />
                </div>
            ))}
            {gameState.coins.map((coin, index) => (
                <div key={`coin-${index}`} className="coin game-object" style={{ left: coin.x, top: coin.y }}>
                    <CoinGif />
                </div>
            ))}
        </>
    );
};

export default GameObjects;