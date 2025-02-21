import React, { useState, useEffect } from 'react';
import { Timer, Trophy, RefreshCw } from 'lucide-react';
import { dinosaurs } from './data';
import type { GameState } from './types';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 0,
    startTime: null,
    bestTimes: {},
    score: 0
  });

  const currentDino = dinosaurs[gameState.currentLevel];

  useEffect(() => {
    if (gameState.currentLevel < dinosaurs.length && !gameState.startTime) {
      setGameState(prev => ({ ...prev, startTime: Date.now() }));
    }
  }, [gameState.currentLevel]);

  const handleGuess = (choice: string) => {
    if (choice === currentDino.name) {
      const endTime = Date.now();
      const levelTime = endTime - (gameState.startTime || endTime);
      
      setGameState(prev => ({
        ...prev,
        currentLevel: prev.currentLevel + 1,
        startTime: null,
        score: prev.score + 1,
        bestTimes: {
          ...prev.bestTimes,
          [prev.currentLevel]: Math.min(levelTime, prev.bestTimes[prev.currentLevel] || Infinity)
        }
      }));
    }
  };

  const resetGame = () => {
    setGameState({
      currentLevel: 0,
      startTime: null,
      bestTimes: gameState.bestTimes,
      score: 0
    });
  };

  if (gameState.currentLevel >= dinosaurs.length) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-6">
            クリアおめでとう！
          </h1>
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-16 h-16 text-yellow-500" />
          </div>
          <p className="text-center text-xl mb-4">
            正解数: {gameState.score}/{dinosaurs.length}
          </p>
          <div className="space-y-2 mb-6">
            {Object.entries(gameState.bestTimes).map(([level, time]) => (
              <div key={level} className="flex justify-between items-center">
                <span>ステージ {Number(level) + 1}:</span>
                <span>{(time / 1000).toFixed(1)}秒</span>
              </div>
            ))}
          </div>
          <button
            onClick={resetGame}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            もう一度チャレンジ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-semibold">
            ステージ: {gameState.currentLevel + 1}/{dinosaurs.length}
          </div>
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-gray-600" />
            <span>
              {gameState.startTime
                ? ((Date.now() - gameState.startTime) / 1000).toFixed(1)
                : '0.0'}秒
            </span>
          </div>
        </div>

        <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
          <img
            src={currentDino.image}
            alt="恐竜の画像"
            className="w-full h-full object-cover"
          />
        </div>

        <p className="text-lg text-center mb-4">この恐竜の名前は？</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {currentDino.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleGuess(choice)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {choice}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;