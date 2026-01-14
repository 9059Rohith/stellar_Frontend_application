import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, X, Mic, MicOff, 
  Music, Music2, Settings, Volume2 
} from 'lucide-react';
import { useVoice } from '../contexts/VoiceContext';
import rocketLogo from '/assets/blue_rocket_logo_stellar.png';
import moonIcon from '/assets/moon.png';

const Navbar = ({ currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { 
    isVoiceEnabled, 
    setIsVoiceEnabled, 
    isListening, 
    recognizedText,
    speak 
  } = useVoice();

  const [musicEnabled, setMusicEnabled] = useState(() => {
    const prefs = JSON.parse(localStorage.getItem('stellarStep_progress') || '{}');
    return prefs.preferences?.musicEnabled !== false;
  });

  const pageNames = {
    'mission-hub': 'Mission Hub',
    'planet-matcher': 'Planet Matcher',
    'alien-emotions': 'Alien Emotions',
    'sensory-nebula': 'Sensory Nebula',
    'stellar-gallery': 'Stellar Gallery',
    'space-school': 'Space School',
    'focus-trainer': 'Focus Trainer',
    'dress-up-station': 'Dress-Up Station',
    'visual-timeline': 'Visual Timeline'
  };

  const missions = [
    { id: 'mission-hub', name: 'Mission Hub', icon: '🎯' },
    { id: 'planet-matcher', name: 'Planet Matcher', icon: '🪐' },
    { id: 'alien-emotions', name: 'Alien Emotions', icon: '👽' },
    { id: 'sensory-nebula', name: 'Sensory Nebula', icon: '✨' },
    { id: 'stellar-gallery', name: 'Stellar Gallery', icon: '🏆' },
    { id: 'space-school', name: 'Space School', icon: '📚' },
    { id: 'focus-trainer', name: 'Focus Trainer', icon: '☄️' },
    { id: 'dress-up-station', name: 'Dress-Up Station', icon: '👨‍🚀' },
    { id: 'visual-timeline', name: 'Visual Timeline', icon: '📅' }
  ];

  const handleNavigation = (pageId, pageName) => {
    speak(`Navigating to ${pageName}`);
    onNavigate(pageId);
    setIsMenuOpen(false);
  };

  const handleSafetyMoon = () => {
    speak('Taking you to your safe space');
    onNavigate('sensory-nebula');
  };

  const toggleVoice = () => {
    const newState = !isVoiceEnabled;
    setIsVoiceEnabled(newState);
    if (newState) {
      speak('Voice navigation enabled');
    }
  };

  const toggleMusic = () => {
    const newState = !musicEnabled;
    setMusicEnabled(newState);
    
    const prefs = JSON.parse(localStorage.getItem('stellarStep_progress') || '{}');
    prefs.preferences = {
      ...prefs.preferences,
      musicEnabled: newState
    };
    localStorage.setItem('stellarStep_progress', JSON.stringify(prefs));
    
    window.dispatchEvent(new CustomEvent('musicToggle', { detail: { enabled: newState } }));
    
    if (isVoiceEnabled) {
      speak(newState ? 'Background music enabled' : 'Background music disabled');
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-midnight-700/95 backdrop-blur-md border-b border-white/10"
        style={{ minHeight: '64px' }}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavigation('mission-hub', 'Mission Hub')}
            onMouseEnter={() => speak('Go to Mission Hub')}
            className="flex items-center space-x-2 hover:scale-105 transition-transform focus:outline-none"
            style={{ minWidth: '48px', minHeight: '48px' }}
          >
            <img src={rocketLogo} alt="StellarStep" className="w-10 h-10 object-contain" />
            <span className="hidden md:block text-xl font-bold text-white font-friendly">
              StellarStep
            </span>
          </button>

          {/* Current Mission Title */}
          <div className="hidden lg:block text-lg text-white/90 font-friendly">
            {pageNames[currentPage] || 'Mission Hub'}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-2">
            {/* Safety Moon Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSafetyMoon}
              onMouseEnter={() => speak('Safety Moon - Go to calm space')}
              className="p-2 rounded-full bg-cosmic-purple/20 hover:bg-cosmic-purple/40 transition-colors"
              style={{ minWidth: '48px', minHeight: '48px' }}
              aria-label="Safety Moon"
            >
              <img src={moonIcon} alt="Safety Moon" className="w-8 h-8 object-contain" />
            </motion.button>

            {/* Voice Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleVoice}
              onMouseEnter={() => speak('Toggle voice navigation')}
              className={`p-3 rounded-full transition-colors relative ${
                isVoiceEnabled ? 'bg-green-500/20 hover:bg-green-500/40' : 'bg-red-500/20 hover:bg-red-500/40'
              }`}
              style={{ minWidth: '48px', minHeight: '48px' }}
              aria-label="Toggle Voice"
            >
              {isVoiceEnabled ? (
                <>
                  <Mic className="w-6 h-6 text-green-400" />
                  {isListening && (
                    <motion.span
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-green-400/30"
                    />
                  )}
                </>
              ) : (
                <MicOff className="w-6 h-6 text-red-400" />
              )}
            </motion.button>

            {/* Music Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMusic}
              onMouseEnter={() => speak('Toggle background music')}
              className={`hidden md:flex p-3 rounded-full transition-colors ${
                musicEnabled ? 'bg-cosmic-blue/20 hover:bg-cosmic-blue/40' : 'bg-gray-500/20 hover:bg-gray-500/40'
              }`}
              style={{ minWidth: '48px', minHeight: '48px' }}
              aria-label="Toggle Music"
            >
              {musicEnabled ? (
                <Music className="w-6 h-6 text-cosmic-blue" />
              ) : (
                <Music2 className="w-6 h-6 text-gray-400" />
              )}
            </motion.button>

            {/* Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              onMouseEnter={() => speak('Open navigation menu')}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              style={{ minWidth: '48px', minHeight: '48px' }}
              aria-label="Navigation Menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Voice Recognition Feedback */}
        {recognizedText && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2 bg-cosmic-purple/90 rounded-lg text-white text-sm"
          >
            Heard: "{recognizedText}"
          </motion.div>
        )}
      </motion.nav>

      {/* Navigation Menu Dropdown */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed top-16 right-0 w-full md:w-96 h-[calc(100vh-4rem)] bg-midnight-800/98 backdrop-blur-lg z-40 overflow-y-auto border-l border-white/10"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-white font-friendly">
              Mission Control
            </h2>
            <div className="space-y-3">
              {missions.map((mission) => (
                <motion.button
                  key={mission.id}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavigation(mission.id, mission.name)}
                  onMouseEnter={() => speak(`Go to ${mission.name}`)}
                  className={`w-full p-4 rounded-xl text-left transition-colors flex items-center space-x-3 ${
                    currentPage === mission.id
                      ? 'bg-cosmic-purple/40 border-2 border-cosmic-purple'
                      : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
                  }`}
                  style={{ minHeight: '56px' }}
                >
                  <span className="text-3xl">{mission.icon}</span>
                  <span className="text-lg font-friendly text-white">{mission.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Navbar;
