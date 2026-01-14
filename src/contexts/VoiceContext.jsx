import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const VoiceContext = createContext();

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};

export const VoiceProvider = ({ children, onNavigate, currentPage }) => {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [lastSpoken, setLastSpoken] = useState('');
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const commandHandlersRef = useRef(new Map());

  // Voice settings
  const voiceSettings = {
    rate: 0.9,
    pitch: 1.1,
    volume: 1.0,
    lang: 'en-US'
  };

  // Load preferences from localStorage
  useEffect(() => {
    const prefs = JSON.parse(localStorage.getItem('stellarStep_progress') || '{}');
    if (prefs.preferences) {
      setIsVoiceEnabled(prefs.preferences.voiceEnabled !== false);
    }
  }, []);

  // Save voice preference
  useEffect(() => {
    const prefs = JSON.parse(localStorage.getItem('stellarStep_progress') || '{}');
    prefs.preferences = {
      ...prefs.preferences,
      voiceEnabled: isVoiceEnabled
    };
    localStorage.setItem('stellarStep_progress', JSON.stringify(prefs));
  }, [isVoiceEnabled]);

  // Text-to-speech function
  const speak = useCallback((text, options = {}) => {
    if (!isVoiceEnabled || !text) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || voiceSettings.rate;
    utterance.pitch = options.pitch || voiceSettings.pitch;
    utterance.volume = options.volume || voiceSettings.volume;
    utterance.lang = voiceSettings.lang;

    setLastSpoken(text);
    synthRef.current.speak(utterance);
  }, [isVoiceEnabled]);

  // Initialize speech recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript.toLowerCase().trim();
      
      setRecognizedText(text);

      if (event.results[last].isFinal) {
        handleVoiceCommand(text);
        setTimeout(() => setRecognizedText(''), 2000);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech' || event.error === 'audio-capture') {
        // Silently handle these common errors
        return;
      }
    };

    recognition.onend = () => {
      if (isListening && isVoiceEnabled) {
        try {
          recognition.start();
        } catch (e) {
          console.error('Error restarting recognition:', e);
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Start listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isVoiceEnabled) return;
    
    try {
      setIsListening(true);
      recognitionRef.current.start();
    } catch (e) {
      if (e.message.includes('already started')) {
        // Already listening, ignore
        return;
      }
      console.error('Error starting recognition:', e);
    }
  }, [isVoiceEnabled]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    setIsListening(false);
    recognitionRef.current.stop();
  }, []);

  // Auto start/stop listening based on voice enabled state
  useEffect(() => {
    if (isVoiceEnabled) {
      startListening();
    } else {
      stopListening();
    }
  }, [isVoiceEnabled, startListening, stopListening]);

  // Handle voice commands
  const handleVoiceCommand = (command) => {
    const cmd = command.toLowerCase().trim();

    // Navigation commands
    const pageMap = {
      'mission hub': 'mission-hub',
      'home': 'mission-hub',
      'hub': 'mission-hub',
      'planet matcher': 'planet-matcher',
      'alien emotions': 'alien-emotions',
      'emotions': 'alien-emotions',
      'sensory nebula': 'sensory-nebula',
      'nebula': 'sensory-nebula',
      'calm down': 'sensory-nebula',
      'relax': 'sensory-nebula',
      'stellar gallery': 'stellar-gallery',
      'gallery': 'stellar-gallery',
      'badges': 'stellar-gallery',
      'space school': 'space-school',
      'school': 'space-school',
      'focus trainer': 'focus-trainer',
      'trainer': 'focus-trainer',
      'dress up station': 'dress-up-station',
      'dress up': 'dress-up-station',
      'visual timeline': 'visual-timeline',
      'timeline': 'visual-timeline',
      'schedule': 'visual-timeline'
    };

    // Check for navigation commands
    for (const [key, page] of Object.entries(pageMap)) {
      if (cmd.includes(key) || cmd.includes(`go to ${key}`) || cmd.includes(`open ${key}`)) {
        speak(`Navigating to ${key}`);
        onNavigate(page);
        return;
      }
    }

    // Help command
    if (cmd.includes('help') || cmd.includes('what can i do')) {
      const helpText = 'You can say: go to mission hub, planet matcher, alien emotions, sensory nebula, stellar gallery, space school, focus trainer, dress up station, or visual timeline. Say calm down to relax, or repeat to hear again.';
      speak(helpText);
      return;
    }

    // Repeat last instruction
    if (cmd.includes('repeat')) {
      if (lastSpoken) {
        speak(lastSpoken);
      }
      return;
    }

    // Quiet mode
    if (cmd.includes('quiet') || cmd.includes('mute')) {
      setIsVoiceEnabled(false);
      return;
    }

    // Custom command handlers
    commandHandlersRef.current.forEach((handler) => {
      handler(cmd);
    });
  };

  // Register custom command handler
  const registerCommand = useCallback((id, handler) => {
    commandHandlersRef.current.set(id, handler);
    return () => commandHandlersRef.current.delete(id);
  }, []);

  // Welcome message on app start
  useEffect(() => {
    const hasPlayedWelcome = sessionStorage.getItem('welcomePlayed');
    if (!hasPlayedWelcome && isVoiceEnabled && currentPage === 'landing') {
      setTimeout(() => {
        speak('Welcome to StellarStep! I am your Mission Commander. I will guide you through your cosmic journey. You can navigate using your voice or by clicking.');
        sessionStorage.setItem('welcomePlayed', 'true');
      }, 1000);
    }
  }, [isVoiceEnabled, currentPage, speak]);

  const value = {
    isVoiceEnabled,
    setIsVoiceEnabled,
    isListening,
    recognizedText,
    speak,
    startListening,
    stopListening,
    registerCommand,
    lastSpoken
  };

  return (
    <VoiceContext.Provider value={value}>
      {children}
    </VoiceContext.Provider>
  );
};
