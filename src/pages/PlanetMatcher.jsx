import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, RotateCcw } from 'lucide-react';
import { useVoice } from '../contexts/VoiceContext';
import saturn from '/assets/saturn.png';
import uranus from '/assets/uranus.png';
import earth from '/assets/earth.png';
import moon from '/assets/moon.png';
import star1 from '/assets/star1.png';

const PlanetMatcher = () => {
  const { speak, registerCommand } = useVoice();

  const planets = [
    { id: 1, color: '#9d4edd', name: 'Saturn', image: saturn },
    { id: 2, color: '#00b4d8', name: 'Uranus', image: uranus },
    { id: 3, color: '#ffd60a', name: 'Earth', image: earth },
    { id: 4, color: '#06ffa5', name: 'Moon', image: moon },
  ];

  const [stars, setStars] = useState([]);
  const [draggedStar, setDraggedStar] = useState(null);
  const [matches, setMatches] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    speak('Welcome to Planet Matcher! Drag each star to its matching colored planet. Say give me a hint if you need help.');
    initializeStars();
  }, [speak]);

  useEffect(() => {
    const unregister = registerCommand('planet-matcher', (cmd) => {
      if (cmd.includes('hint')) {
        speak('Look at the colors! Match each star with the planet of the same color.');
      } else if (cmd.includes('start over') || cmd.includes('reset')) {
        resetGame();
      }
    });
    return unregister;
  }, [registerCommand]);

  const initializeStars = () => {
    const newStars = planets.map((planet, index) => ({
      id: planet.id,
      color: planet.color,
      name: planet.name,
      matched: false,
      position: { x: 0, y: 0 }
    }));
    
    // Shuffle stars
    const shuffled = [...newStars].sort(() => Math.random() - 0.5);
    setStars(shuffled);
    setMatches([]);
    setShowCelebration(false);
  };

  const resetGame = () => {
    speak('Starting a new game!');
    initializeStars();
  };

  const handleDragStart = (star) => {
    setDraggedStar(star);
  };

  const handleDrop = (planet) => {
    if (!draggedStar) return;

    if (draggedStar.color === planet.color) {
      speak(`Perfect match! The ${planet.name} accepts its star!`);
      
      setStars(prev => prev.map(s => 
        s.id === draggedStar.id ? { ...s, matched: true } : s
      ));
      
      setMatches(prev => [...prev, draggedStar.id]);

      // Check if all matched
      if (matches.length + 1 === planets.length) {
        setTimeout(() => {
          speak('Mission complete! You matched all the stars! You earned the Planet Master badge!');
          setShowCelebration(true);
          
          // Save achievement
          const prefs = JSON.parse(localStorage.getItem('stellarStep_progress') || '{}');
          prefs.completedMissions = [...(prefs.completedMissions || []), 'planet-matcher'];
          prefs.badges = [...(prefs.badges || []), 'planet-master'];
          localStorage.setItem('stellarStep_progress', JSON.stringify(prefs));
        }, 500);
      }
    } else {
      speak('Not quite! Try a different planet. You can do it!');
    }

    setDraggedStar(null);
  };

  return (
    <div className="min-h-screen p-8 relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-white font-friendly">
            🪐 Planet Matcher
          </h1>
          <p className="text-xl text-white/80 font-friendly">
            Drag each star to its matching planet!
          </p>
          <div className="mt-4 text-lg text-white/60 font-friendly">
            Matched: {matches.length} / {planets.length}
          </div>
        </div>

        {/* Game Area */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Stars (Left) */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white font-friendly mb-4">
              ⭐ Stars to Sort
            </h2>
            {stars.map((star) => (
              !star.matched && (
                <motion.div
                  key={star.id}
                  draggable
                  onDragStart={() => handleDragStart(star)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-6 rounded-2xl cursor-move flex items-center space-x-4 bg-white/10 backdrop-blur-sm border-2 border-white/20"
                  style={{ 
                    backgroundColor: `${star.color}30`,
                    borderColor: star.color,
                    minHeight: '80px'
                  }}
                >
                  <img src={star1} alt="Star" className="w-12 h-12 object-contain drop-shadow-lg" />
                  <span className="text-xl font-friendly text-white">
                    {star.name} Star
                  </span>
                </motion.div>
              )
            ))}
          </div>

          {/* Planets (Right) */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white font-friendly mb-4">
              🌍 Planets
            </h2>
            {planets.map((planet) => (
              <motion.div
                key={planet.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(planet)}
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-2xl flex items-center justify-between bg-white/5 border-4 border-dashed"
                style={{ 
                  borderColor: planet.color,
                  minHeight: '80px'
                }}
              >
                <div className="flex items-center space-x-4">
                  <img src={planet.image} alt={planet.name} className="w-16 h-16 object-contain drop-shadow-lg" />
                  <span className="text-xl font-friendly text-white">
                    {planet.name}
                  </span>
                </div>
                
                {matches.includes(planet.id) && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                  >
                    <img src={star1} alt="Match" className="w-12 h-12 object-contain drop-shadow-lg" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <div className="text-center mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            onMouseEnter={() => speak('Start over')}
            className="px-8 py-4 bg-cosmic-purple rounded-full text-white text-lg font-friendly flex items-center space-x-3 mx-auto"
            style={{ minHeight: '56px' }}
          >
            <RotateCcw className="w-6 h-6" />
            <span>Start Over</span>
          </motion.button>
        </div>

        {/* Celebration */}
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center"
            >
              <Award className="w-32 h-32 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-white font-friendly mb-2">
                Mission Complete! 🎉
              </h2>
              <p className="text-xl text-white/80 font-friendly">
                You're a Planet Master!
              </p>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default PlanetMatcher;
