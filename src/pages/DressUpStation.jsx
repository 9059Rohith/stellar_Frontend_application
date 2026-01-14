import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useVoice } from '../contexts/VoiceContext';
import rocketIcon from '/assets/rocket.png';

const DressUpStation = () => {
  const { speak, registerCommand } = useVoice();

  const [avatar, setAvatar] = useState({
    helmet: 'classic',
    suit: 'blue',
    accessory: 'none'
  });

  const helmets = [
    { id: 'classic', name: 'Classic Helmet', emoji: '🪖', color: '#ffffff' },
    { id: 'bubble', name: 'Bubble Helmet', emoji: '⚪', color: '#e0f7fa' },
    { id: 'visor', name: 'Visor Helmet', emoji: '🔵', color: '#00b4d8' },
    { id: 'star', name: 'Star Helmet', emoji: '⭐', color: '#ffd60a' }
  ];

  const suits = [
    { id: 'blue', name: 'Blue Suit', color: '#00b4d8' },
    { id: 'purple', name: 'Purple Suit', color: '#9d4edd' },
    { id: 'green', name: 'Green Suit', color: '#06ffa5' },
    { id: 'orange', name: 'Orange Suit', color: '#ff6b35' },
    { id: 'pink', name: 'Pink Suit', color: '#ff006e' }
  ];

  const accessories = [
    { id: 'none', name: 'No Accessory', emoji: '' },
    { id: 'jetpack', name: 'Jetpack', emoji: '🎒' },
    { id: 'flag', name: 'Space Flag', emoji: '🚩' },
    { id: 'tool', name: 'Space Tool', emoji: '🔧' },
    { id: 'badge', name: 'Mission Badge', emoji: '⭐' }
  ];

  useEffect(() => {
    speak('Welcome to the Dress-Up Station! Design your own space suit by choosing a helmet, suit color, and accessories!');
  }, [speak]);

  useEffect(() => {
    const unregister = registerCommand('dress-up-station', (cmd) => {
      if (cmd.includes('helmet')) {
        speak('Showing helmet options');
      } else if (cmd.includes('suit') || cmd.includes('color')) {
        speak('Showing suit colors');
      } else if (cmd.includes('accessory') || cmd.includes('accessories')) {
        speak('Showing accessories');
      }
    });
    return unregister;
  }, [registerCommand]);

  const handleHelmetChange = (helmet) => {
    setAvatar(prev => ({ ...prev, helmet: helmet.id }));
    speak(`${helmet.name} selected`);
  };

  const handleSuitChange = (suit) => {
    setAvatar(prev => ({ ...prev, suit: suit.id }));
    speak(`${suit.name} selected`);
  };

  const handleAccessoryChange = (accessory) => {
    setAvatar(prev => ({ ...prev, accessory: accessory.id }));
    speak(accessory.id === 'none' ? 'Accessory removed' : `${accessory.name} added`);
  };

  const saveDesign = () => {
    speak('Your space suit design has been saved! You look amazing!');
    
    const prefs = JSON.parse(localStorage.getItem('stellarStep_progress') || '{}');
    prefs.avatar = avatar;
    prefs.badges = [...(prefs.badges || []), 'style-star'];
    prefs.completedMissions = [...(prefs.completedMissions || []), 'dress-up-station'];
    localStorage.setItem('stellarStep_progress', JSON.stringify(prefs));
  };

  const selectedHelmet = helmets.find(h => h.id === avatar.helmet);
  const selectedSuit = suits.find(s => s.id === avatar.suit);
  const selectedAccessory = accessories.find(a => a.id === avatar.accessory);

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
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 10, -10, 0] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <img src={rocketIcon} alt="Rocket" className="w-20 h-20 object-contain drop-shadow-2xl" />
          </motion.div>
          <h1 className="text-5xl font-bold mb-4 text-white font-friendly">
            👨‍🚀 Dress-Up Station
          </h1>
          <p className="text-xl text-white/80 font-friendly">
            Design Your Space Suit!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Avatar Preview */}
          <div>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="sticky top-24"
            >
              <div className="bg-gradient-to-br from-midnight-800 to-midnight-700 rounded-3xl p-12 border-2 border-white/10">
                <h3 className="text-2xl font-bold text-white font-friendly mb-6 text-center">
                  Your Space Suit
                </h3>
                
                {/* Avatar Display */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="relative aspect-square max-w-sm mx-auto"
                >
                  {/* Suit Body */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{ 
                      backgroundColor: selectedSuit.color,
                      boxShadow: `0 0 60px ${selectedSuit.color}50`
                    }}
                  >
                    {/* Body details */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        {/* Chest panel */}
                        <div className="w-24 h-32 mx-auto mb-4 bg-white/20 rounded-lg border-2 border-white/40" />
                        
                        {/* Arms */}
                        <div className="flex justify-between absolute top-1/3 left-0 right-0 px-8">
                          <div 
                            className="w-12 h-32 rounded-full"
                            style={{ backgroundColor: selectedSuit.color }}
                          />
                          <div 
                            className="w-12 h-32 rounded-full"
                            style={{ backgroundColor: selectedSuit.color }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Helmet */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                    <div 
                      className="w-32 h-32 rounded-full flex items-center justify-center text-6xl border-4 border-white/30"
                      style={{ backgroundColor: selectedHelmet.color }}
                    >
                      {selectedHelmet.emoji}
                    </div>
                  </div>

                  {/* Accessory */}
                  {selectedAccessory.id !== 'none' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-6xl"
                    >
                      {selectedAccessory.emoji}
                    </motion.div>
                  )}
                </motion.div>

                {/* Save Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={saveDesign}
                  className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-cosmic-purple to-cosmic-blue rounded-full text-white font-friendly text-xl font-bold"
                  style={{ minHeight: '64px' }}
                >
                  Save Design ✨
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Customization Options */}
          <div className="space-y-8">
            {/* Helmets */}
            <div>
              <h3 className="text-2xl font-bold text-white font-friendly mb-4">
                🪖 Choose Helmet
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {helmets.map((helmet) => (
                  <motion.button
                    key={helmet.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleHelmetChange(helmet)}
                    onMouseEnter={() => speak(helmet.name)}
                    className={`p-6 rounded-2xl text-center transition-all ${
                      avatar.helmet === helmet.id
                        ? 'bg-cosmic-purple/40 border-2 border-cosmic-purple'
                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                    }`}
                    style={{ minHeight: '120px' }}
                  >
                    <div className="text-5xl mb-2">{helmet.emoji}</div>
                    <p className="text-white font-friendly">{helmet.name}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Suits */}
            <div>
              <h3 className="text-2xl font-bold text-white font-friendly mb-4">
                👔 Choose Suit Color
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {suits.map((suit) => (
                  <motion.button
                    key={suit.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSuitChange(suit)}
                    onMouseEnter={() => speak(suit.name)}
                    className={`p-6 rounded-2xl transition-all ${
                      avatar.suit === suit.id
                        ? 'ring-4 ring-white'
                        : 'ring-2 ring-white/20'
                    }`}
                    style={{ 
                      backgroundColor: suit.color,
                      minHeight: '80px'
                    }}
                  >
                    <p className="text-white font-friendly font-bold">
                      {suit.name.replace(' Suit', '')}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Accessories */}
            <div>
              <h3 className="text-2xl font-bold text-white font-friendly mb-4">
                ⭐ Add Accessories
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {accessories.map((accessory) => (
                  <motion.button
                    key={accessory.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAccessoryChange(accessory)}
                    onMouseEnter={() => speak(accessory.name)}
                    className={`p-6 rounded-2xl text-center transition-all ${
                      avatar.accessory === accessory.id
                        ? 'bg-cosmic-blue/40 border-2 border-cosmic-blue'
                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                    }`}
                    style={{ minHeight: '100px' }}
                  >
                    {accessory.emoji && (
                      <div className="text-4xl mb-2">{accessory.emoji}</div>
                    )}
                    <p className="text-white font-friendly text-sm">{accessory.name}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Voice Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center text-white/60 font-friendly"
        >
          <p className="text-lg">
            💬 Say "Show helmets" or "Change color" to use voice commands
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DressUpStation;
