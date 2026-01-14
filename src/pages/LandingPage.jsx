import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useVoice } from '../contexts/VoiceContext';
import rocketLogo from '/assets/blue_rocket_logo_stellar.png';
import star1 from '/assets/star1.png';

const LandingPage = ({ onStart }) => {
  const { speak } = useVoice();

  useEffect(() => {
    // Welcome message handled by VoiceContext
  }, []);

  const handleStart = () => {
    speak('Starting your cosmic adventure!');
    onStart();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 max-w-4xl"
      >
        {/* Logo */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-8 inline-block"
        >
          <img src={rocketLogo} alt="StellarStep Rocket" className="w-40 h-40 object-contain drop-shadow-2xl" />
        </motion.div>

        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-bold mb-4 text-white font-friendly">
          StellarStep
        </h1>
        <p className="text-3xl md:text-4xl text-cosmic-purple mb-8 font-friendly">
          The Sensory Space Odyssey™
        </p>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <p className="text-xl md:text-2xl text-white/90 mb-4 font-friendly leading-relaxed">
            Welcome, Space Explorer! 🚀
          </p>
          <p className="text-lg md:text-xl text-white/70 font-friendly leading-relaxed max-w-2xl mx-auto">
            I am your Mission Commander, here to guide you through exciting space adventures.
            Use your voice or click to explore planets, learn emotions, and discover the cosmos!
          </p>
        </motion.div>

        {/* Start Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          onMouseEnter={() => speak('Click to start your mission')}
          className="px-12 py-6 bg-gradient-to-r from-cosmic-purple to-cosmic-blue rounded-full text-white text-2xl font-bold font-friendly shadow-2xl hover:shadow-cosmic-purple/50 transition-all"
          style={{ minWidth: '200px', minHeight: '72px' }}
        >
          <span className="flex items-center justify-center space-x-3">
            <Sparkles className="w-8 h-8" />
            <span>Start Mission</span>
            <Sparkles className="w-8 h-8" />
          </span>
        </motion.button>

        {/* Voice Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-white/60 text-lg font-friendly"
        >
          💬 Say "Start" or "Help" to use voice commands
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LandingPage;
