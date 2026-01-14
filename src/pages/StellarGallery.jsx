import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Trophy, Sparkles, Crown, Rocket } from 'lucide-react';
import { useVoice } from '../contexts/VoiceContext';

const StellarGallery = () => {
  const { speak } = useVoice();
  const [earnedBadges, setEarnedBadges] = useState([]);

  const allBadges = [
    { 
      id: 'first-mission', 
      name: 'First Steps', 
      icon: Rocket, 
      description: 'Completed your first mission!',
      color: 'from-blue-500 to-cyan-500',
      requirement: 'Complete any mission'
    },
    { 
      id: 'planet-master', 
      name: 'Planet Master', 
      icon: Star, 
      description: 'Matched all the planets!',
      color: 'from-purple-500 to-pink-500',
      requirement: 'Complete Planet Matcher'
    },
    { 
      id: 'emotion-expert', 
      name: 'Emotion Expert', 
      icon: Sparkles, 
      description: 'Learned about all feelings!',
      color: 'from-green-500 to-teal-500',
      requirement: 'Try all emotions in Alien Emotions'
    },
    { 
      id: 'calm-explorer', 
      name: 'Calm Explorer', 
      icon: Star, 
      description: 'Visited the Sensory Nebula!',
      color: 'from-cyan-500 to-blue-500',
      requirement: 'Visit Sensory Nebula'
    },
    { 
      id: 'space-scholar', 
      name: 'Space Scholar', 
      icon: Award, 
      description: 'Read 10 space facts!',
      color: 'from-indigo-500 to-purple-500',
      requirement: 'Read 10 facts in Space School'
    },
    { 
      id: 'focus-champion', 
      name: 'Focus Champion', 
      icon: Trophy, 
      description: 'Followed the comet perfectly!',
      color: 'from-red-500 to-orange-500',
      requirement: 'Complete Focus Trainer'
    },
    { 
      id: 'style-star', 
      name: 'Style Star', 
      icon: Crown, 
      description: 'Designed an awesome space suit!',
      color: 'from-pink-500 to-purple-500',
      requirement: 'Customize avatar in Dress-Up Station'
    },
    { 
      id: 'time-keeper', 
      name: 'Time Keeper', 
      icon: Award, 
      description: 'Organized your daily schedule!',
      color: 'from-teal-500 to-green-500',
      requirement: 'Complete Visual Timeline'
    },
    { 
      id: 'mission-master', 
      name: 'Mission Master', 
      icon: Crown, 
      description: 'Completed all missions!',
      color: 'from-yellow-500 to-orange-500',
      requirement: 'Complete all 8 missions'
    },
  ];

  useEffect(() => {
    // Load earned badges from localStorage
    const prefs = JSON.parse(localStorage.getItem('stellarStep_progress') || '{}');
    const badges = prefs.badges || [];
    setEarnedBadges(badges);

    const count = badges.length;
    speak(`Welcome to your Stellar Gallery! You have earned ${count} badge${count !== 1 ? 's' : ''}. Amazing work!`);
  }, [speak]);

  const isBadgeEarned = (badgeId) => {
    return earnedBadges.includes(badgeId);
  };

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Trophy className="w-20 h-20 text-yellow-400" />
          </motion.div>
          <h1 className="text-5xl font-bold mb-4 text-white font-friendly">
            🏆 Stellar Gallery
          </h1>
          <p className="text-xl text-white/80 font-friendly">
            Your Amazing Achievements
          </p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="mt-6 inline-block px-8 py-4 bg-gradient-to-r from-cosmic-purple to-cosmic-blue rounded-full"
          >
            <p className="text-2xl font-bold text-white font-friendly">
              {earnedBadges.length} / {allBadges.length} Badges Earned
            </p>
          </motion.div>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allBadges.map((badge, index) => {
            const Icon = badge.icon;
            const earned = isBadgeEarned(badge.id);

            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: earned ? 1.05 : 1 }}
                onMouseEnter={() => earned && speak(badge.name)}
                className={`relative p-8 rounded-2xl overflow-hidden ${
                  earned
                    ? `bg-gradient-to-br ${badge.color}`
                    : 'bg-white/5 border-2 border-dashed border-white/20'
                }`}
                style={{ minHeight: '280px' }}
              >
                {/* Locked overlay */}
                {!earned && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🔒</div>
                      <p className="text-white/60 font-friendly text-sm px-4">
                        {badge.requirement}
                      </p>
                    </div>
                  </div>
                )}

                {/* Badge Content */}
                <div className="relative z-10 text-center">
                  <motion.div
                    animate={earned ? {
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={{
                      duration: 2,
                      repeat: earned ? Infinity : 0,
                      repeatDelay: 3
                    }}
                    className="mb-6"
                  >
                    <Icon className="w-20 h-20 mx-auto text-white drop-shadow-lg" />
                  </motion.div>

                  <h3 className="text-2xl font-bold mb-3 text-white font-friendly">
                    {badge.name}
                  </h3>
                  
                  <p className="text-white/90 font-friendly leading-relaxed">
                    {badge.description}
                  </p>

                  {earned && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="mt-6"
                    >
                      <div className="inline-block px-4 py-2 bg-white/20 rounded-full">
                        <span className="text-white font-friendly font-bold">
                          ⭐ Earned!
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Sparkle effects for earned badges */}
                {earned && (
                  <>
                    <motion.div
                      animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity
                      }}
                      className="absolute top-4 right-4 text-2xl"
                    >
                      ✨
                    </motion.div>
                    <motion.div
                      animate={{
                        rotate: -360,
                        scale: [1, 1.3, 1]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity
                      }}
                      className="absolute bottom-4 left-4 text-2xl"
                    >
                      ⭐
                    </motion.div>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Encouragement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <p className="text-xl text-white/70 font-friendly">
            {earnedBadges.length === 0 && "Start exploring to earn your first badge! 🚀"}
            {earnedBadges.length > 0 && earnedBadges.length < 3 && "Keep going! You're doing great! 🌟"}
            {earnedBadges.length >= 3 && earnedBadges.length < 6 && "Wow! You're an amazing space explorer! ✨"}
            {earnedBadges.length >= 6 && earnedBadges.length < allBadges.length && "Incredible! You're almost there! 🎉"}
            {earnedBadges.length === allBadges.length && "You've earned all badges! You're a true StellarStep Champion! 👑"}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StellarGallery;
