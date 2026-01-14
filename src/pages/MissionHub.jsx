import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useVoice } from '../contexts/VoiceContext';
import saturn from '/assets/saturn.png';
import uranus from '/assets/uranus.png';
import earth from '/assets/earth.png';
import moon from '/assets/moon.png';
import star1 from '/assets/star1.png';
import purpleCrystal from '/assets/purple crystal.png';
import blueCrystal from '/assets/blue_crystal.png';
import greenCrystal from '/assets/green_crystal.png';

const MissionHub = ({ onNavigate }) => {
  const { speak } = useVoice();

  const missions = [
    { id: 'planet-matcher', name: 'Planet Matcher', icon: saturn, description: 'Sort colorful planets and stars', color: 'from-purple-500 to-pink-500' },
    { id: 'alien-emotions', name: 'Alien Emotions', icon: uranus, description: 'Build faces and learn feelings', color: 'from-green-500 to-teal-500' },
    { id: 'sensory-nebula', name: 'Sensory Nebula', icon: star1, description: 'Calm space with gentle stars', color: 'from-blue-500 to-cyan-500' },
    { id: 'stellar-gallery', name: 'Stellar Gallery', icon: purpleCrystal, description: 'Your amazing achievements', color: 'from-yellow-500 to-orange-500' },
    { id: 'space-school', name: 'Space School', icon: earth, description: 'Learn cool space facts', color: 'from-indigo-500 to-purple-500' },
    { id: 'focus-trainer', name: 'Focus Trainer', icon: blueCrystal, description: 'Follow the glowing comet', color: 'from-red-500 to-pink-500' },
    { id: 'dress-up-station', name: 'Dress-Up Station', icon: greenCrystal, description: 'Design your space suit', color: 'from-cyan-500 to-blue-500' },
    { id: 'visual-timeline', name: 'Visual Timeline', icon: moon, description: 'Plan your daily journey', color: 'from-teal-500 to-green-500' },
  ];

  useEffect(() => {
    speak('Welcome to Mission Hub! Choose any mission to begin your adventure.');
  }, [speak]);

  const handleMissionClick = (mission) => {
    speak(`Launching ${mission.name}`);
    onNavigate(mission.id);
  };

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white font-friendly">
            Mission Control Hub
          </h1>
          <p className="text-xl md:text-2xl text-white/80 font-friendly">
            Choose your adventure, Space Explorer! 🚀
          </p>
        </div>

        {/* Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {missions.map((mission, index) => (
            <motion.button
              key={mission.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                rotate: [0, 2, -2, 0],
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMissionClick(mission)}
              onMouseEnter={() => speak(mission.name)}
              className={`relative p-8 rounded-2xl bg-gradient-to-br ${mission.color} text-white overflow-hidden group`}
              style={{ minHeight: '220px' }}
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />

              <div className="relative z-10">
                <div className="mb-4 flex justify-center">
                  <img src={mission.icon} alt={mission.name} className="w-20 h-20 object-contain drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-bold mb-2 font-friendly">
                  {mission.name}
                </h3>
                <p className="text-white/90 text-base font-friendly leading-relaxed">
                  {mission.description}
                </p>
              </div>

              {/* Sparkle decoration */}
              <motion.div
                className="absolute top-4 right-4 text-2xl"
                animate={{
                  rotate: 360,
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              >
                ✨
              </motion.div>
            </motion.button>
          ))}
        </div>

        {/* Helper Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center text-white/60 text-lg font-friendly"
        >
          💬 Say "Go to [Mission Name]" or click any mission to start
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MissionHub;
