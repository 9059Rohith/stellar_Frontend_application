import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Pause, Play, Award } from 'lucide-react';
import { useVoice } from '../contexts/VoiceContext';

const FocusTrainer = () => {
  const { speak, registerCommand } = useVoice();
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [score, setScore] = useState(0);
  const [cometPosition, setCometPosition] = useState({ x: 100, y: 100 });
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    speak('Welcome to Focus Trainer! Follow the glowing comet with your finger or mouse. Say slower or faster to adjust speed. Say pause to stop.');
  }, [speak]);

  useEffect(() => {
    const unregister = registerCommand('focus-trainer', (cmd) => {
      if (cmd.includes('slower') || cmd.includes('slow down')) {
        handleSpeedChange('slower');
      } else if (cmd.includes('faster') || cmd.includes('speed up')) {
        handleSpeedChange('faster');
      } else if (cmd.includes('pause') || cmd.includes('stop')) {
        handlePause();
      } else if (cmd.includes('play') || cmd.includes('start')) {
        handlePlay();
      }
    });
    return unregister;
  }, [registerCommand, speed]);

  const handleSpeedChange = (direction) => {
    setSpeed(prev => {
      const newSpeed = direction === 'faster' 
        ? Math.min(prev + 0.25, 2.5) 
        : Math.max(prev - 0.25, 0.5);
      speak(`Speed set to ${newSpeed === 0.5 ? 'very slow' : newSpeed === 1 ? 'normal' : newSpeed === 2 ? 'fast' : newSpeed > 2 ? 'very fast' : 'slow'}`);
      return newSpeed;
    });
  };

  const handlePlay = () => {
    setIsPlaying(true);
    speak('Starting comet');
  };

  const handlePause = () => {
    setIsPlaying(false);
    speak('Paused');
  };

  useEffect(() => {
    if (!isPlaying) return;

    const animate = () => {
      if (!containerRef.current) return;

      const container = containerRef.current.getBoundingClientRect();
      const padding = 100;
      const maxX = container.width - padding;
      const maxY = container.height - padding;

      timeRef.current += 0.02 * speed;

      // Create smooth figure-8 pattern
      const x = padding + (maxX / 2) * (1 + Math.sin(timeRef.current));
      const y = padding + (maxY / 2) * (1 + Math.sin(timeRef.current * 2) / 2);

      setCometPosition({ x, y });

      // Increment score
      setScore(prev => prev + 1);

      // Complete after 30 seconds
      if (score >= 1800) {
        setIsPlaying(false);
        setShowComplete(true);
        speak('Amazing focus! You followed the comet perfectly! You earned the Focus Champion badge!');
        
        const prefs = JSON.parse(localStorage.getItem('stellarStep_progress') || '{}');
        prefs.badges = [...(prefs.badges || []), 'focus-champion'];
        prefs.completedMissions = [...(prefs.completedMissions || []), 'focus-trainer'];
        localStorage.setItem('stellarStep_progress', JSON.stringify(prefs));
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed, score]);

  const resetGame = () => {
    setScore(0);
    timeRef.current = 0;
    setShowComplete(false);
    setIsPlaying(false);
    speak('Ready to start again!');
  };

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Zap className="w-16 h-16 text-yellow-400" />
          </motion.div>
          <h1 className="text-5xl font-bold mb-4 text-white font-friendly">
            ☄️ Focus Trainer
          </h1>
          <p className="text-xl text-white/80 font-friendly">
            Follow the glowing comet!
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isPlaying ? handlePause : handlePlay}
            className={`px-8 py-4 rounded-full text-white font-friendly text-lg flex items-center space-x-3 ${
              isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}
            style={{ minHeight: '56px' }}
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            <span>{isPlaying ? 'Pause' : 'Start'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSpeedChange('slower')}
            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-full text-white font-friendly text-lg"
            style={{ minHeight: '56px' }}
          >
            Slower
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSpeedChange('faster')}
            className="px-8 py-4 bg-purple-500 hover:bg-purple-600 rounded-full text-white font-friendly text-lg"
            style={{ minHeight: '56px' }}
          >
            Faster
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="px-8 py-4 bg-orange-500 hover:bg-orange-600 rounded-full text-white font-friendly text-lg"
            style={{ minHeight: '56px' }}
          >
            Reset
          </motion.button>
        </div>

        {/* Speed & Score Display */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="px-6 py-3 bg-white/10 rounded-full">
            <p className="text-lg text-white font-friendly">
              Speed: {speed.toFixed(2)}x
            </p>
          </div>
          <div className="px-6 py-3 bg-white/10 rounded-full">
            <p className="text-lg text-white font-friendly">
              Time: {Math.floor(score / 60)}s
            </p>
          </div>
        </div>

        {/* Comet Container */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-midnight-800/50 rounded-3xl overflow-hidden border-2 border-white/10"
          style={{ height: '500px' }}
        >
          {/* Background stars */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}

          {/* Comet */}
          {isPlaying && (
            <motion.div
              className="absolute"
              style={{
                left: cometPosition.x,
                top: cometPosition.y,
                x: '-50%',
                y: '-50%'
              }}
            >
              {/* Comet trail */}
              <motion.div
                className="absolute w-32 h-32 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(0, 180, 216, 0.4), transparent)',
                  x: '-50%',
                  y: '-50%'
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 0.3, 0.6]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity
                }}
              />
              
              {/* Comet core */}
              <motion.div
                className="relative w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
                animate={{
                  scale: [1, 1.3, 1],
                  boxShadow: [
                    '0 0 20px rgba(255, 200, 0, 0.8)',
                    '0 0 40px rgba(255, 200, 0, 1)',
                    '0 0 20px rgba(255, 200, 0, 0.8)'
                  ]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity
                }}
              >
                <div className="absolute inset-0 rounded-full bg-white/50" />
              </motion.div>
            </motion.div>
          )}

          {/* Start message */}
          {!isPlaying && !showComplete && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl text-white font-friendly mb-4">
                  Click Start to Begin! ☄️
                </p>
                <p className="text-lg text-white/60 font-friendly">
                  Follow the comet with your eyes or finger
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-white/60 font-friendly"
        >
          <p className="text-lg">
            💬 Say "Slower", "Faster", or "Pause" to control the comet
          </p>
        </motion.div>

        {/* Completion Modal */}
        {showComplete && (
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
                Amazing Focus! 🎉
              </h2>
              <p className="text-xl text-white/80 font-friendly">
                You're a Focus Champion!
              </p>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default FocusTrainer;
