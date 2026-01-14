import { useEffect, useRef, useState } from 'react';

const MusicPlayer = () => {
  const audioContextRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const gainNodeRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize Web Audio API
  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContextRef.current = new AudioContext();
    gainNodeRef.current = audioContextRef.current.createGain();
    gainNodeRef.current.connect(audioContextRef.current.destination);
    gainNodeRef.current.gain.value = 0.2; // 20% volume

    return () => {
      stopMusic();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Create ambient space music using oscillators
  const startMusic = () => {
    if (!audioContextRef.current || isPlaying) return;

    const context = audioContextRef.current;
    const now = context.currentTime;

    // Create multiple oscillators for ambient pad sound
    const frequencies = [
      { freq: 110, type: 'sine', detune: 0 },      // A2
      { freq: 146.83, type: 'sine', detune: 5 },   // D3
      { freq: 174.61, type: 'sine', detune: -5 },  // F3
      { freq: 220, type: 'sine', detune: 3 }       // A3
    ];

    frequencies.forEach((config, index) => {
      const osc = context.createOscillator();
      const oscGain = context.createGain();
      
      osc.type = config.type;
      osc.frequency.value = config.freq;
      osc.detune.value = config.detune;
      
      // Gentle fade in
      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.linearRampToValueAtTime(0.15, now + 2);
      
      // Create subtle variations
      const lfo = context.createOscillator();
      const lfoGain = context.createGain();
      lfo.frequency.value = 0.1 + (index * 0.05);
      lfoGain.gain.value = 2;
      
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      
      osc.connect(oscGain);
      oscGain.connect(gainNodeRef.current);
      
      osc.start(now);
      lfo.start(now);
      
      oscillatorsRef.current.push({ osc, oscGain, lfo });
    });

    setIsPlaying(true);
  };

  const stopMusic = () => {
    if (!audioContextRef.current || !isPlaying) return;

    const now = audioContextRef.current.currentTime;

    oscillatorsRef.current.forEach(({ osc, oscGain, lfo }) => {
      // Fade out
      oscGain.gain.linearRampToValueAtTime(0, now + 0.5);
      
      setTimeout(() => {
        try {
          osc.stop();
          lfo.stop();
        } catch (e) {
          // Already stopped
        }
      }, 600);
    });

    oscillatorsRef.current = [];
    setIsPlaying(false);
  };

  // Handle music toggle events
  useEffect(() => {
    const handleMusicToggle = (event) => {
      const prefs = JSON.parse(localStorage.getItem('stellarStep_progress') || '{}');
      const enabled = prefs.preferences?.musicEnabled !== false;

      if (enabled) {
        startMusic();
      } else {
        stopMusic();
      }
    };

    // Check initial state
    const prefs = JSON.parse(localStorage.getItem('stellarStep_progress') || '{}');
    if (prefs.preferences?.musicEnabled !== false) {
      setTimeout(startMusic, 1000); // Start after 1 second
    }

    window.addEventListener('musicToggle', handleMusicToggle);
    
    return () => {
      window.removeEventListener('musicToggle', handleMusicToggle);
    };
  }, []);

  // Handle sensory nebula pause
  useEffect(() => {
    const handleNebulaPause = (event) => {
      if (event.detail.pause) {
        stopMusic();
      } else {
        const prefs = JSON.parse(localStorage.getItem('stellarStep_progress') || '{}');
        if (prefs.preferences?.musicEnabled !== false) {
          startMusic();
        }
      }
    };

    window.addEventListener('sensoryNebulaPause', handleNebulaPause);
    
    return () => {
      window.removeEventListener('sensoryNebulaPause', handleNebulaPause);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default MusicPlayer;
