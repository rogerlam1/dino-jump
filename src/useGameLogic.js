// useGameLogic.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { initializeGameState, jump, updateGameState } from './gameLogic';
import { GAME_HEIGHT, GAME_WIDTH } from './gameSettings';

const useGameLogic = () => {
    const [gameState, setGameState] = useState(initializeGameState());
    const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);
    const [scale, setScale] = useState(1);
    const gameContainerRef = useRef(null);
    const requestRef = useRef();

    const startGame = useCallback(() => {
        setGameState(prevState => ({
            ...initializeGameState(),
            highScore: prevState.highScore,
            gameStarted: true
        }));
    }, []);

    const handleJump = useCallback(() => {
        if (gameState.isPaused || gameState.showBossFight) {
            setGameState(prevState => ({
                ...prevState,
                isPaused: false,
                showBossFight: false,
            }));
        } else if (gameState.gameStarted && (isLandscape || window.innerWidth >= 768)) {
            setGameState(prevState => jump(prevState));
        }
    }, [gameState.gameStarted, gameState.isPaused, gameState.showBossFight, isLandscape]);

    const resumeGame = useCallback(() => {
        setGameState(prevState => ({
            ...prevState,
            isPaused: false,
            showBossFight: false,
        }));
    }, []);

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

        const handleTouchStart = (e) => {
            e.preventDefault();
            handleJump();
        };

        const handleMouseDown = (e) => {
            e.preventDefault();
            handleJump();
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('mousedown', handleMouseDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('mousedown', handleMouseDown);
        };
    }, [handleJump, gameState.gameOver, startGame]);

    const gameLoop = useCallback(() => {
        if (!gameState.isPaused) {
            setGameState(prevState => updateGameState(prevState));
        }
        requestRef.current = requestAnimationFrame(gameLoop);
    }, [gameState.isPaused]);

    useEffect(() => {
        if (gameState.gameStarted && (isLandscape || window.innerWidth >= 768)) {
            requestRef.current = requestAnimationFrame(gameLoop);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [gameState.gameStarted, isLandscape, gameLoop]);

    const shouldShowGame = isLandscape || window.innerWidth >= 768;
    
    return {
        gameState,
        startGame,
        handleJump,
        gameContainerRef,
        shouldShowGame,
        scale,
        resumeGame,
    };
};

export default useGameLogic;