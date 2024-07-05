// gameGraphics.js
import React from 'react';
import { DINO_WIDTH, DINO_HEIGHT, SNAKE_WIDTH, SNAKE_HEIGHT, COIN_SIZE } from './gameSettings';

// Import images
import dinoGif from './img/dino.gif';
import personGif from './img/person.gif';
import snakeGif from './img/snake.gif';
import coinGif from './img/coin.gif';

const ImageComponent = ({ src, alt, style, fallbackText }) => {
    const [error, setError] = React.useState(false);

    if (error) {
        return <div style={style}>{fallbackText}</div>;
    }

    return (
        <img
            src={src}
            alt={alt}
            style={style}
            onError={() => setError(true)}
        />
    );
};

export const DinoGif = () => (
    <ImageComponent
        src={dinoGif}
        alt="Dino"
        style={{ width: DINO_WIDTH, height: DINO_HEIGHT }}
        fallbackText="🦖"
    />
);

export const ManGif = () => (
    <ImageComponent
        src={personGif}
        alt="Person"
        style={{ width: 30, height: 50 }}
        fallbackText="🏃"
    />
);

export const SnakeGif = () => (
    <ImageComponent
        src={snakeGif}
        alt="Snake"
        style={{ width: SNAKE_WIDTH, height: SNAKE_HEIGHT }}
        fallbackText="🐍"
    />
);

export const CoinGif = () => (
    <div style={{ width: COIN_SIZE, height: COIN_SIZE, backgroundColor: 'yellow', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ImageComponent
            src={coinGif}
            alt="Coin"
            style={{ width: '100%', height: '100%' }}
            fallbackText="🪙"
        />
    </div>
);