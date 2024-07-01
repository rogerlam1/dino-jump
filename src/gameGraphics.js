// gameGraphics.js
import React from 'react';
import { DINO_WIDTH, DINO_HEIGHT, SNAKE_WIDTH, SNAKE_HEIGHT, COIN_SIZE } from './gameSettings';
import dinoGif from './img/dino.gif';
import personGif from './img/person.gif';
import snakeGif from './img/snake.gif';
import coinGif from './img/coin.gif';

export const DinoGif = () => (
    <img src={dinoGif} alt="Dino" style={{ width: DINO_WIDTH, height: DINO_HEIGHT }} />
);

export const ManGif = () => (
    <img src={personGif} alt="Person" style={{ width: 30, height: 50 }} />
);

export const SnakeGif = () => (
    <img src={snakeGif} alt="Snake" style={{ width: SNAKE_WIDTH, height: SNAKE_HEIGHT }} />
);

export const CoinGif = () => (
    <div style={{ width: COIN_SIZE, height: COIN_SIZE, backgroundColor: 'yellow', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img 
            src={coinGif} 
            alt="Coin" 
            style={{ width: '100%', height: '100%' }} 
            onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentNode.textContent = 'Coin';
            }}
        />
    </div>
);