import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useVoice } from '../contexts/VoiceContext';

const SensoryNebula = () => {
  const { speak } = useVoice();
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [breathingPhase, setBreathingPhase] = useState('inhale');

  useEffect(() => {
    speak('Welcome to your safe space. Take a deep breath. Touch the screen to interact with the stars. You are safe here.');
    
    // Pause background music when entering
    window.dispatchEvent(new CustomEvent('sensoryNebulaPause', { detail: { pause: true } }));

    return () => {
      // Resume music when leaving
      window.dispatchEvent(new CustomEvent('sensoryNebulaPause', { detail: { pause: false } }));
    };
  }, [speak]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize particles
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = this.getRandomColor();
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      getRandomColor() {
        const colors = [
          'rgba(157, 78, 221, ',  // cosmic purple
          'rgba(0, 180, 216, ',   // cosmic blue
          'rgba(255, 255, 255, ', // white
          'rgba(6, 255, 165, ',   // green
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }

      update(mouseX, mouseY) {
        // Move particles
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const force = (100 - distance) / 100;
          this.x -= dx * force * 0.05;
          this.y -= dy * force * 0.05;
        }

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color + '0.8)';
      }
    }

    // Create particles
    particlesRef.current = [];
    for (let i = 0; i < 150; i++) {
      particlesRef.current.push(new Particle());
    }

    // Animation loop
    function animate() {
      ctx.fillStyle = 'rgba(26, 26, 46, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(particle => {
        particle.update(mouseRef.current.x, mouseRef.current.y);
        particle.draw();
      });

      // Draw connections
      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.strokeStyle = `rgba(157, 78, 221, ${(1 - distance / 120) * 0.15})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    // Mouse/touch tracking
    const handleMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX || e.touches?.[0]?.clientX) - rect.left,
        y: (e.clientY || e.touches?.[0]?.clientY) - rect.top
      };
    };

    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('touchmove', handleMove);

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('touchmove', handleMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Breathing guide animation
  useEffect(() => {
    const breathingCycle = setInterval(() => {
      setBreathingPhase(prev => {
        if (prev === 'inhale') return 'hold-in';
        if (prev === 'hold-in') return 'exhale';
        if (prev === 'exhale') return 'hold-out';
        return 'inhale';
      });
    }, 4000);

    return () => clearInterval(breathingCycle);
  }, []);

  const getBreathingText = () => {
    switch (breathingPhase) {
      case 'inhale': return 'Breathe In...';
      case 'hold-in': return 'Hold...';
      case 'exhale': return 'Breathe Out...';
      case 'hold-out': return 'Hold...';
      default: return 'Breathe...';
    }
  };

  const getBreathingScale = () => {
    switch (breathingPhase) {
      case 'inhale': return 1.3;
      case 'hold-in': return 1.3;
      case 'exhale': return 1;
      case 'hold-out': return 1;
      default: return 1;
    }
  };

  return (
    <div className="fixed inset-0 bg-midnight-900 overflow-hidden">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-pointer"
      />

      {/* Overlay Controls */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* Breathing Guide */}
        <motion.div
          animate={{ scale: getBreathingScale() }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="text-center"
        >
          <motion.div
            className="w-32 h-32 rounded-full border-4 border-white/40 mx-auto mb-6"
            style={{
              background: 'radial-gradient(circle, rgba(157, 78, 221, 0.3), transparent)'
            }}
          />
          <p className="text-3xl text-white/90 font-friendly">
            {getBreathingText()}
          </p>
        </motion.div>
      </div>

      {/* Info Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-12 left-0 right-0 text-center pointer-events-none"
      >
        <p className="text-xl text-white/60 font-friendly">
          Touch or move your cursor to interact with the stars ✨
        </p>
        <p className="text-lg text-white/50 font-friendly mt-2">
          This is your safe space. Stay as long as you need.
        </p>
      </motion.div>
    </div>
  );
};

export default SensoryNebula;
