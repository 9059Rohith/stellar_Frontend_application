import React from 'react';
import { motion } from 'framer-motion';
import rocketLogo from '/assets/blue_rocket_logo_stellar.png';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-900 to-midnight-800 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8 inline-block"
        >
          <img src={rocketLogo} alt="StellarStep Rocket" className="w-32 h-32 object-contain drop-shadow-2xl" />
        </motion.div>
        
        <h1 className="text-5xl font-bold mb-4 text-white font-friendly">
          StellarStep
        </h1>
        <p className="text-2xl text-cosmic-purple font-friendly">
          The Sensory Space Odyssey™
        </p>
        
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mt-8 text-white/70"
        >
          Loading your mission...
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
