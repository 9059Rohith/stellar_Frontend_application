# StellarStep – The Sensory Space Odyssey™

A neuro-inclusive web application designed specifically for children with Autism Spectrum Disorder (ASD), featuring voice navigation, background music, and 10 interactive sensory-friendly modules.

live link:https://cozy-puppy-2ed405.netlify.app/
## 🚀 Features

- **Voice Navigation**: Full Web Speech API integration for hands-free navigation
- **Background Music**: Calming ambient space music using Web Audio API
- **Persistent Navbar**: Always-accessible navigation with Safety Moon quick access
- **10 Interactive Modules**:
  - 🏠 Landing Page - Welcome screen
  - 🎯 Mission Hub - Central dashboard
  - 🪐 Planet Matcher - Color/shape sorting game
  - 👽 Alien Emotions - Emotional recognition builder
  - ✨ Sensory Nebula - Calming interactive canvas
  - 🏆 Stellar Gallery - Achievement badges
  - 📚 Space School - Educational space facts
  - ☄️ Focus Trainer - Joint attention exercise
  - 👨‍🚀 Dress-Up Station - Avatar customization
  - 📅 Visual Timeline - Daily routine scheduler

## 🛠️ Technology Stack

- **React 18** - Modern functional components with hooks
- **Vite** - Fast development and build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth, accessible animations
- **Lucide React** - Consistent icon system
- **Web Speech API** - Voice recognition and text-to-speech
- **Web Audio API** - Background music generation
- **LocalStorage** - Progress persistence

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Design Philosophy

### Sensory-Friendly
- Calming color palette (midnight blues, soft purples)
- No bright reds or jarring contrasts
- Slow, organic animations (max 0.8s duration)
- No flashing or rapid movements

### Accessibility
- 48px minimum touch targets
- Dyslexia-friendly typography (Comic Sans MS, 18px+ size)
- High contrast text on dark backgrounds
- Voice alternatives for all interactions
- Zero-failure design (no timers, no game overs)

### Neuro-Inclusive Features
- Predictable spatial layout
- Clear visual and voice feedback
- Quiet Mode option
- Safety Moon instant calm space access
- Self-paced progression

## 🗂️ Project Structure

```
src/
├── components/
│   ├── LoadingScreen.jsx
│   ├── Navbar.jsx
│   └── MusicPlayer.jsx
├── contexts/
│   └── VoiceContext.jsx
├── pages/
│   ├── LandingPage.jsx
│   ├── MissionHub.jsx
│   ├── PlanetMatcher.jsx
│   ├── AlienEmotions.jsx
│   ├── SensoryNebula.jsx
│   ├── StellarGallery.jsx
│   ├── SpaceSchool.jsx
│   ├── FocusTrainer.jsx
│   ├── DressUpStation.jsx
│   └── VisualTimeline.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## 🎮 Voice Commands

### Global Commands
- "Go to [Page Name]" - Navigate to any module
- "Mission Hub" / "Home" - Return to dashboard
- "Help" - List available commands
- "Calm down" / "Relax" - Open Sensory Nebula
- "Repeat" - Repeat last instruction
- "Quiet" - Mute voice guidance

### Page-Specific Commands
- **Planet Matcher**: "Give me a hint", "Start over"
- **Alien Emotions**: "Show happy face", "Make sad alien"
- **Focus Trainer**: "Slower", "Faster", "Pause"
- **Space School**: "Next", "Previous", "Repeat"
- **Visual Timeline**: "What's next?", "Mark complete"

## 💾 Data Persistence

All progress is saved in localStorage under `stellarStep_progress`:

```javascript
{
  completedMissions: [],
  badges: [],
  timeline: [],
  preferences: {
    voiceEnabled: true,
    musicEnabled: true,
    musicVolume: 0.2,
    voiceRate: 0.9
  }
}
```

## 🏆 Achievement Badges

- First Steps - Complete first mission
- Planet Master - Complete Planet Matcher
- Emotion Expert - Try all emotions
- Calm Explorer - Visit Sensory Nebula
- Space Scholar - Read 10 space facts
- Focus Champion - Complete Focus Trainer
- Style Star - Customize avatar
- Time Keeper - Organize timeline
- Mission Master - Complete all missions

## 🌐 Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support (webkitSpeechRecognition polyfill)
- Safari: Partial support (Web Speech API limited)

## 📱 Responsive Design

- Mobile (<640px): Hamburger menu, single column
- Tablet (640-1024px): Full navbar, 2-column grid
- Desktop (>1024px): Full features, 3-column grid

## 🤝 Contributing

This application is designed with specific accessibility needs in mind. When contributing:

1. Maintain 48px minimum touch targets
2. Use calm color palette
3. Keep animations slow and predictable
4. Test voice commands thoroughly
5. Ensure zero-failure design principles

## 📄 License

MIT License - feel free to use and adapt for educational and therapeutic purposes.

## 🙏 Acknowledgments

Designed for children with Autism Spectrum Disorder, with input from occupational therapists, special education teachers, and families.

---

**Built with ❤️ for neurodivergent children to explore, learn, and thrive in a safe, sensory-friendly space environment.**
