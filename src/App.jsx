import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceProvider } from './contexts/VoiceContext';
import Navbar from './components/Navbar';
import MusicPlayer from './components/MusicPlayer';
import LoadingScreen from './components/LoadingScreen';
import LandingPage from './pages/LandingPage';
import MissionHub from './pages/MissionHub';
import PlanetMatcher from './pages/PlanetMatcher';
import AlienEmotions from './pages/AlienEmotions';
import SensoryNebula from './pages/SensoryNebula';
import StellarGallery from './pages/StellarGallery';
import SpaceSchool from './pages/SpaceSchool';
import FocusTrainer from './pages/FocusTrainer';
import DressUpStation from './pages/DressUpStation';
import VisualTimeline from './pages/VisualTimeline';

function App() {
  const [currentPage, setCurrentPage] = useState('loading');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      setCurrentPage('landing');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const navigateToPage = (pageName) => {
    setCurrentPage(pageName);
  };

  const renderPage = () => {
    const pageVariants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    };

    const pages = {
      landing: <LandingPage onStart={() => navigateToPage('mission-hub')} />,
      'mission-hub': <MissionHub onNavigate={navigateToPage} />,
      'planet-matcher': <PlanetMatcher />,
      'alien-emotions': <AlienEmotions />,
      'sensory-nebula': <SensoryNebula />,
      'stellar-gallery': <StellarGallery />,
      'space-school': <SpaceSchool />,
      'focus-trainer': <FocusTrainer />,
      'dress-up-station': <DressUpStation />,
      'visual-timeline': <VisualTimeline />
    };

    return (
      <motion.div
        key={currentPage}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.5 }}
        className="min-h-screen"
      >
        {pages[currentPage]}
      </motion.div>
    );
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <VoiceProvider onNavigate={navigateToPage} currentPage={currentPage}>
      <div className="min-h-screen bg-gradient-to-br from-midnight-900 to-midnight-800">
        <MusicPlayer />
        
        {currentPage !== 'landing' && (
          <Navbar 
            currentPage={currentPage} 
            onNavigate={navigateToPage} 
          />
        )}
        
        <main className={currentPage !== 'landing' ? 'pt-20' : ''}>
          <AnimatePresence mode="wait">
            {renderPage()}
          </AnimatePresence>
        </main>
      </div>
    </VoiceProvider>
  );
}

export default App;
