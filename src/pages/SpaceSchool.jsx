import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, ChevronLeft, Volume2 } from 'lucide-react';
import { useVoice } from '../contexts/VoiceContext';

const SpaceSchool = () => {
  const { speak, registerCommand } = useVoice();
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [factsRead, setFactsRead] = useState([]);

  const spaceFacts = [
    {
      title: "The Sun",
      fact: "The Sun is a big, bright star at the center of our solar system. It gives us light and warmth every day!",
      emoji: "☀️",
      color: "from-yellow-400 to-orange-500"
    },
    {
      title: "The Moon",
      fact: "The Moon is Earth's special friend in space. It goes around our planet and makes the night sky beautiful!",
      emoji: "🌙",
      color: "from-gray-300 to-gray-500"
    },
    {
      title: "Stars",
      fact: "Stars are giant balls of hot, glowing gas far away in space. They twinkle and shine at night!",
      emoji: "⭐",
      color: "from-yellow-300 to-white"
    },
    {
      title: "Planets",
      fact: "Planets are round worlds that go around the Sun. Earth is a planet, and so are Mars, Jupiter, and Saturn!",
      emoji: "🪐",
      color: "from-purple-500 to-blue-500"
    },
    {
      title: "Astronauts",
      fact: "Astronauts are brave people who travel to space! They wear special suits and float because there's no gravity up there.",
      emoji: "👨‍🚀",
      color: "from-blue-400 to-cyan-500"
    },
    {
      title: "Rockets",
      fact: "Rockets are powerful machines that blast off into space! They go very fast and carry astronauts and equipment.",
      emoji: "🚀",
      color: "from-red-500 to-orange-600"
    },
    {
      title: "Milky Way",
      fact: "The Milky Way is our galaxy - a huge collection of billions of stars! It looks like a river of milk in the night sky.",
      emoji: "🌌",
      color: "from-indigo-600 to-purple-700"
    },
    {
      title: "Comets",
      fact: "Comets are space snowballs made of ice and dust! When they get close to the Sun, they grow a bright, glowing tail.",
      emoji: "☄️",
      color: "from-cyan-400 to-blue-600"
    },
    {
      title: "Black Holes",
      fact: "Black holes are super strong spots in space where gravity is so powerful that even light can't escape!",
      emoji: "⚫",
      color: "from-gray-800 to-black"
    },
    {
      title: "Space Station",
      fact: "The International Space Station is like a house in space where astronauts live and do experiments!",
      emoji: "🛰️",
      color: "from-gray-400 to-blue-500"
    }
  ];

  useEffect(() => {
    speak('Welcome to Space School! Listen and learn amazing facts about space. Say next or previous to navigate.');
    readCurrentFact();
  }, []);

  useEffect(() => {
    const unregister = registerCommand('space-school', (cmd) => {
      if (cmd.includes('next')) {
        handleNext();
      } else if (cmd.includes('previous') || cmd.includes('back')) {
        handlePrevious();
      } else if (cmd.includes('repeat') || cmd.includes('again')) {
        readCurrentFact();
      }
    });
    return unregister;
  }, [currentFactIndex, registerCommand]);

  const readCurrentFact = () => {
    const fact = spaceFacts[currentFactIndex];
    speak(`${fact.title}. ${fact.fact}`);
    
    // Track read facts
    if (!factsRead.includes(currentFactIndex)) {
      const newFactsRead = [...factsRead, currentFactIndex];
      setFactsRead(newFactsRead);
      
      // Award badge if 10 facts read
      if (newFactsRead.length >= 10) {
        const prefs = JSON.parse(localStorage.getItem('stellarStep_progress') || '{}');
        prefs.badges = [...(prefs.badges || []), 'space-scholar'];
        localStorage.setItem('stellarStep_progress', JSON.stringify(prefs));
        
        setTimeout(() => {
          speak('Amazing! You read 10 space facts! You earned the Space Scholar badge!');
        }, 2000);
      }
    }
  };

  const handleNext = () => {
    const nextIndex = (currentFactIndex + 1) % spaceFacts.length;
    setCurrentFactIndex(nextIndex);
    setTimeout(readCurrentFact, 300);
  };

  const handlePrevious = () => {
    const prevIndex = currentFactIndex === 0 ? spaceFacts.length - 1 : currentFactIndex - 1;
    setCurrentFactIndex(prevIndex);
    setTimeout(readCurrentFact, 300);
  };

  const currentFact = spaceFacts[currentFactIndex];

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <BookOpen className="w-20 h-20 text-cosmic-blue" />
          </motion.div>
          <h1 className="text-5xl font-bold mb-4 text-white font-friendly">
            📚 Space School
          </h1>
          <p className="text-xl text-white/80 font-friendly">
            Learn Amazing Space Facts!
          </p>
          <div className="mt-4 text-lg text-white/60 font-friendly">
            Fact {currentFactIndex + 1} of {spaceFacts.length}
          </div>
        </div>

        {/* Fact Card */}
        <motion.div
          key={currentFactIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className={`relative p-12 rounded-3xl bg-gradient-to-br ${currentFact.color} overflow-hidden`}
          style={{ minHeight: '400px' }}
        >
          {/* Decorative elements */}
          <div className="absolute top-8 right-8 text-8xl opacity-20">
            {currentFact.emoji}
          </div>

          <div className="relative z-10">
            {/* Title */}
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="mb-8"
            >
              <div className="text-7xl mb-4">{currentFact.emoji}</div>
              <h2 className="text-4xl font-bold text-white font-friendly mb-4">
                {currentFact.title}
              </h2>
            </motion.div>

            {/* Fact */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl text-white leading-relaxed font-friendly mb-8"
            >
              {currentFact.fact}
            </motion.p>

            {/* Read Aloud Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={readCurrentFact}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-full text-white font-friendly text-lg flex items-center space-x-2"
              style={{ minHeight: '56px' }}
            >
              <Volume2 className="w-6 h-6" />
              <span>Read Aloud</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            onMouseEnter={() => speak('Previous fact')}
            className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full text-white font-friendly text-lg flex items-center space-x-2"
            style={{ minHeight: '56px' }}
          >
            <ChevronLeft className="w-6 h-6" />
            <span>Previous</span>
          </motion.button>

          {/* Progress Indicator */}
          <div className="flex space-x-2">
            {spaceFacts.map((_, index) => (
              <motion.div
                key={index}
                animate={{
                  scale: index === currentFactIndex ? 1.2 : 1,
                  opacity: index === currentFactIndex ? 1 : 0.4
                }}
                className="w-3 h-3 rounded-full bg-white"
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            onMouseEnter={() => speak('Next fact')}
            className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full text-white font-friendly text-lg flex items-center space-x-2"
            style={{ minHeight: '56px' }}
          >
            <span>Next</span>
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Facts Read Counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-block px-8 py-4 bg-cosmic-purple/20 rounded-full">
            <p className="text-xl text-white font-friendly">
              📖 You've read {factsRead.length} fact{factsRead.length !== 1 ? 's' : ''}!
              {factsRead.length >= 10 && " 🏆"}
            </p>
          </div>
          <p className="mt-4 text-white/60 font-friendly">
            💬 Say "Next" or "Previous" to navigate
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SpaceSchool;
