import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smile, Frown, Angry, Sparkles } from 'lucide-react';
import { useVoice } from '../contexts/VoiceContext';

const AlienEmotions = () => {
  const { speak, registerCommand } = useVoice();

  const [selectedFeatures, setSelectedFeatures] = useState({
    eyes: 'happy',
    mouth: 'happy',
    color: '#9d4edd'
  });

  const emotions = [
    { id: 'happy', name: 'Happy', icon: Smile, description: 'This alien feels joyful and excited!' },
    { id: 'sad', name: 'Sad', icon: Frown, description: 'This alien feels a bit down today.' },
    { id: 'surprised', name: 'Surprised', icon: Sparkles, description: 'This alien is amazed!' },
    { id: 'calm', name: 'Calm', icon: Smile, description: 'This alien is peaceful and relaxed.' },
  ];

  const eyes = {
    happy: { shape: 'round', size: 'large' },
    sad: { shape: 'droopy', size: 'medium' },
    surprised: { shape: 'wide', size: 'xlarge' },
    calm: { shape: 'half', size: 'medium' }
  };

  const mouths = {
    happy: { curve: 'up', width: 'wide' },
    sad: { curve: 'down', width: 'normal' },
    surprised: { curve: 'o', width: 'small' },
    calm: { curve: 'straight', width: 'normal' }
  };

  const colors = [
    { value: '#9d4edd', name: 'Purple' },
    { value: '#00b4d8', name: 'Blue' },
    { value: '#06ffa5', name: 'Green' },
    { value: '#ffd60a', name: 'Yellow' },
    { value: '#ff006e', name: 'Pink' }
  ];

  useEffect(() => {
    speak('Welcome to Alien Emotions! Build an alien face by choosing eyes, mouth, and colors. Learn about different feelings!');
  }, [speak]);

  useEffect(() => {
    const unregister = registerCommand('alien-emotions', (cmd) => {
      const emotionMap = {
        'happy': 'happy',
        'sad': 'sad',
        'surprised': 'surprised',
        'calm': 'calm'
      };

      for (const [key, value] of Object.entries(emotionMap)) {
        if (cmd.includes(key)) {
          setSelectedFeatures(prev => ({
            ...prev,
            eyes: value,
            mouth: value
          }));
          speak(`Making a ${key} alien face!`);
          return;
        }
      }
    });
    return unregister;
  }, [registerCommand]);

  const handleEmotionSelect = (emotion) => {
    setSelectedFeatures({
      eyes: emotion.id,
      mouth: emotion.id,
      color: selectedFeatures.color
    });
    speak(`${emotion.name}! ${emotion.description}`);
  };

  const handleColorChange = (color) => {
    setSelectedFeatures(prev => ({ ...prev, color: color.value }));
    speak(`Changed to ${color.name} alien`);
  };

  const renderEyes = () => {
    const eyeType = eyes[selectedFeatures.eyes];
    const baseClass = "absolute bg-white rounded-full";
    
    const eyeConfigs = {
      happy: { left: '25%', top: '30%', width: '15%', height: '15%', pupilY: '40%' },
      sad: { left: '25%', top: '35%', width: '12%', height: '10%', pupilY: '60%' },
      surprised: { left: '22%', top: '28%', width: '18%', height: '18%', pupilY: '35%' },
      calm: { left: '25%', top: '32%', width: '14%', height: '7%', pupilY: '20%' }
    };

    const config = eyeConfigs[selectedFeatures.eyes];

    return (
      <>
        {/* Left Eye */}
        <div 
          className={baseClass}
          style={{
            left: config.left,
            top: config.top,
            width: config.width,
            height: config.height
          }}
        >
          <div 
            className="absolute bg-black rounded-full"
            style={{
              left: '30%',
              top: config.pupilY,
              width: '40%',
              height: '40%'
            }}
          />
        </div>
        
        {/* Right Eye */}
        <div 
          className={baseClass}
          style={{
            right: config.left,
            top: config.top,
            width: config.width,
            height: config.height
          }}
        >
          <div 
            className="absolute bg-black rounded-full"
            style={{
              right: '30%',
              top: config.pupilY,
              width: '40%',
              height: '40%'
            }}
          />
        </div>
      </>
    );
  };

  const renderMouth = () => {
    const mouthType = mouths[selectedFeatures.mouth];
    
    const mouthPaths = {
      happy: "M 30 55 Q 50 70 70 55",
      sad: "M 30 65 Q 50 50 70 65",
      surprised: "M 45 55 Q 50 60 55 55 Q 50 65 45 55",
      calm: "M 35 58 L 65 58"
    };

    return (
      <svg 
        className="absolute"
        style={{ left: '0', top: '0', width: '100%', height: '100%' }}
      >
        <path
          d={mouthPaths[selectedFeatures.mouth]}
          stroke="white"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-white font-friendly">
            👽 Alien Emotions
          </h1>
          <p className="text-xl text-white/80 font-friendly">
            Build an alien face and learn about feelings!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Alien Face Preview */}
          <div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative aspect-square max-w-md mx-auto rounded-full overflow-hidden"
              style={{ backgroundColor: selectedFeatures.color }}
            >
              {/* Alien Body */}
              <div className="absolute inset-0">
                {renderEyes()}
                {renderMouth()}
                
                {/* Antennae */}
                <div className="absolute left-1/4 top-5 w-1 h-12 bg-white/50 rounded-full transform -translate-x-1/2">
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rounded-full" />
                </div>
                <div className="absolute right-1/4 top-5 w-1 h-12 bg-white/50 rounded-full transform translate-x-1/2">
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rounded-full" />
                </div>
              </div>
            </motion.div>

            {/* Color Picker */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-white font-friendly mb-4 text-center">
                Choose Alien Color
              </h3>
              <div className="flex justify-center space-x-3">
                {colors.map((color) => (
                  <motion.button
                    key={color.value}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleColorChange(color)}
                    onMouseEnter={() => speak(color.name)}
                    className="w-16 h-16 rounded-full border-4 border-white/30 hover:border-white"
                    style={{ 
                      backgroundColor: color.value,
                      borderColor: selectedFeatures.color === color.value ? 'white' : 'rgba(255,255,255,0.3)'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Emotion Controls */}
          <div>
            <h3 className="text-2xl font-bold text-white font-friendly mb-6">
              Choose an Emotion
            </h3>
            <div className="space-y-4">
              {emotions.map((emotion) => {
                const Icon = emotion.icon;
                return (
                  <motion.button
                    key={emotion.id}
                    whileHover={{ scale: 1.03, x: 10 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleEmotionSelect(emotion)}
                    onMouseEnter={() => speak(emotion.name)}
                    className={`w-full p-6 rounded-2xl text-left transition-all flex items-center space-x-4 ${
                      selectedFeatures.eyes === emotion.id
                        ? 'bg-cosmic-purple/40 border-2 border-cosmic-purple'
                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                    }`}
                    style={{ minHeight: '80px' }}
                  >
                    <Icon className="w-12 h-12 text-white" />
                    <div>
                      <h4 className="text-2xl font-bold text-white font-friendly mb-1">
                        {emotion.name}
                      </h4>
                      <p className="text-white/70 font-friendly">
                        {emotion.description}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 p-4 bg-cosmic-blue/20 rounded-xl text-center"
            >
              <p className="text-white/80 font-friendly text-lg">
                💬 Say "Show happy face" or "Make sad alien" to use voice!
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AlienEmotions;
