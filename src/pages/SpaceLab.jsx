import React, { useState, useEffect, useReducer, useMemo, useCallback, Fragment } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useVoice } from '../contexts/VoiceContext';
import { Beaker, Send, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

// ============================================
// HIGHER-ORDER COMPONENT (HOC)
// ============================================
const withSpaceTheme = (Component) => {
  return function ThemedComponent(props) {
    const theme = {
      primary: 'cosmic-purple',
      secondary: 'cosmic-blue',
      background: 'midnight-700'
    };
    return <Component {...props} theme={theme} />;
  };
};

// ============================================
// CLASS COMPONENT - Astronaut Form
// ============================================
class AstronautRegistrationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      age: '',
      rank: 'cadet',
      skills: [],
      bio: '',
      errors: {},
      submitted: false
    };
  }

  componentDidMount() {
    console.log('AstronautRegistrationForm mounted');
    if (this.props.onMount) {
      this.props.onMount();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.submitted !== this.state.submitted && this.state.submitted) {
      console.log('Form submitted successfully');
    }
  }

  componentWillUnmount() {
    console.log('AstronautRegistrationForm unmounting');
  }

  validateForm = () => {
    const errors = {};
    const { name, age, skills, bio } = this.state;

    if (!name.trim()) {
      errors.name = 'Astronaut name is required';
    } else if (name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!age) {
      errors.age = 'Age is required';
    } else if (age < 8 || age > 100) {
      errors.age = 'Age must be between 8 and 100';
    }

    if (skills.length === 0) {
      errors.skills = 'Select at least one skill';
    }

    if (!bio.trim()) {
      errors.bio = 'Bio is required';
    } else if (bio.length < 10) {
      errors.bio = 'Bio must be at least 10 characters';
    }

    return errors;
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value, errors: {} });
  };

  handleSkillChange = (e) => {
    const { value, checked } = e.target;
    this.setState(prevState => {
      const skills = checked
        ? [...prevState.skills, value]
        : prevState.skills.filter(skill => skill !== value);
      return { skills, errors: {} };
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validateForm();

    if (Object.keys(errors).length === 0) {
      const astronaut = {
        name: this.state.name,
        age: this.state.age,
        rank: this.state.rank,
        skills: this.state.skills,
        bio: this.state.bio,
        id: Date.now()
      };
      this.props.onSubmit(astronaut);
      this.setState({
        name: '',
        age: '',
        rank: 'cadet',
        skills: [],
        bio: '',
        errors: {},
        submitted: true
      });
      setTimeout(() => this.setState({ submitted: false }), 3000);
    } else {
      this.setState({ errors });
    }
  };

  handleReset = () => {
    this.setState({
      name: '',
      age: '',
      rank: 'cadet',
      skills: [],
      bio: '',
      errors: {},
      submitted: false
    });
  };

  render() {
    const { name, age, rank, skills, bio, errors, submitted } = this.state;
    const { theme } = this.props;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 bg-${theme.background}/30 backdrop-blur-md rounded-2xl border-2 border-white/10`}
      >
        <div className="flex items-center space-x-3 mb-6">
          <Beaker className="w-8 h-8 text-cosmic-purple" />
          <h2 className="text-3xl font-bold text-white font-friendly">
            Astronaut Registration (Class Component)
          </h2>
        </div>

        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-xl flex items-center space-x-2"
          >
            <CheckCircle className="w-6 h-6 text-green-400" />
            <span className="text-green-100 font-friendly">Astronaut registered successfully!</span>
          </motion.div>
        )}

        <form onSubmit={this.handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-white font-friendly text-lg mb-2">
              Astronaut Name *
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={this.handleInputChange}
              placeholder="Enter astronaut name"
              className={`w-full px-4 py-3 bg-white/10 border-2 ${
                errors.name ? 'border-red-500' : 'border-white/20'
              } rounded-xl text-white font-friendly text-lg focus:outline-none focus:border-cosmic-blue placeholder-white/40`}
            />
            {errors.name && (
              <p className="mt-2 text-red-400 text-sm flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Age Input */}
          <div>
            <label className="block text-white font-friendly text-lg mb-2">
              Age *
            </label>
            <input
              type="number"
              name="age"
              value={age}
              onChange={this.handleInputChange}
              placeholder="Enter age"
              min="8"
              max="100"
              className={`w-full px-4 py-3 bg-white/10 border-2 ${
                errors.age ? 'border-red-500' : 'border-white/20'
              } rounded-xl text-white font-friendly text-lg focus:outline-none focus:border-cosmic-blue placeholder-white/40`}
            />
            {errors.age && (
              <p className="mt-2 text-red-400 text-sm flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.age}</span>
              </p>
            )}
          </div>

          {/* Rank Select */}
          <div>
            <label className="block text-white font-friendly text-lg mb-2">
              Rank
            </label>
            <select
              name="rank"
              value={rank}
              onChange={this.handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white font-friendly text-lg focus:outline-none focus:border-cosmic-blue"
            >
              <option value="cadet">Cadet</option>
              <option value="pilot">Pilot</option>
              <option value="commander">Commander</option>
              <option value="captain">Captain</option>
            </select>
          </div>

          {/* Skills Checkboxes */}
          <div>
            <label className="block text-white font-friendly text-lg mb-2">
              Skills *
            </label>
            <div className="space-y-2">
              {['Piloting', 'Engineering', 'Science', 'Medical', 'Navigation'].map(skill => (
                <label key={skill} className="flex items-center space-x-3 text-white/90 cursor-pointer">
                  <input
                    type="checkbox"
                    value={skill}
                    checked={skills.includes(skill)}
                    onChange={this.handleSkillChange}
                    className="w-5 h-5 rounded border-2 border-white/20 bg-white/10 text-cosmic-purple focus:ring-cosmic-purple"
                  />
                  <span className="font-friendly">{skill}</span>
                </label>
              ))}
            </div>
            {errors.skills && (
              <p className="mt-2 text-red-400 text-sm flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.skills}</span>
              </p>
            )}
          </div>

          {/* Bio Textarea */}
          <div>
            <label className="block text-white font-friendly text-lg mb-2">
              Bio *
            </label>
            <textarea
              name="bio"
              value={bio}
              onChange={this.handleInputChange}
              placeholder="Tell us about yourself..."
              rows="4"
              className={`w-full px-4 py-3 bg-white/10 border-2 ${
                errors.bio ? 'border-red-500' : 'border-white/20'
              } rounded-xl text-white font-friendly text-lg focus:outline-none focus:border-cosmic-blue placeholder-white/40 resize-none`}
            />
            {errors.bio && (
              <p className="mt-2 text-red-400 text-sm flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.bio}</span>
              </p>
            )}
          </div>

          {/* Submit and Reset Buttons */}
          <div className="flex space-x-4">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cosmic-purple to-cosmic-blue rounded-xl text-white font-friendly text-lg font-bold flex items-center justify-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>Register Astronaut</span>
            </motion.button>
            <motion.button
              type="button"
              onClick={this.handleReset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500 rounded-xl text-white font-friendly text-lg font-bold flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-5 h-5" />
              <span>Reset</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    );
  }
}

// PropTypes for Class Component
AstronautRegistrationForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onMount: PropTypes.func,
  theme: PropTypes.shape({
    primary: PropTypes.string,
    secondary: PropTypes.string,
    background: PropTypes.string
  })
};

AstronautRegistrationForm.defaultProps = {
  onMount: () => {},
  theme: {
    primary: 'cosmic-purple',
    secondary: 'cosmic-blue',
    background: 'midnight-700'
  }
};

// Apply HOC
const ThemedAstronautForm = withSpaceTheme(AstronautRegistrationForm);

// ============================================
// REDUCER for Mission Planning (useReducer)
// ============================================
const missionReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_MISSION':
      return {
        ...state,
        missions: [...state.missions, action.payload],
        totalMissions: state.totalMissions + 1
      };
    case 'DELETE_MISSION':
      return {
        ...state,
        missions: state.missions.filter(m => m.id !== action.payload),
        totalMissions: state.totalMissions - 1
      };
    case 'TOGGLE_COMPLETE':
      return {
        ...state,
        missions: state.missions.map(m =>
          m.id === action.payload ? { ...m, completed: !m.completed } : m
        )
      };
    case 'UPDATE_MISSION':
      return {
        ...state,
        missions: state.missions.map(m =>
          m.id === action.payload.id ? { ...m, ...action.payload.updates } : m
        )
      };
    case 'RESET':
      return {
        missions: [],
        totalMissions: 0
      };
    default:
      return state;
  }
};

// ============================================
// STATELESS FUNCTIONAL COMPONENT with PropTypes
// ============================================
const MissionCard = ({ mission, onToggle, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`p-4 rounded-xl border-2 ${
        mission.completed
          ? 'bg-green-500/10 border-green-500'
          : 'bg-white/5 border-white/10'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <input
            type="checkbox"
            checked={mission.completed}
            onChange={() => onToggle(mission.id)}
            className="w-5 h-5 rounded border-2 border-white/20 bg-white/10"
          />
          <div>
            <h3 className={`text-lg font-friendly ${
              mission.completed ? 'line-through text-white/50' : 'text-white'
            }`}>
              {mission.title}
            </h3>
            <p className="text-sm text-white/60 font-friendly">{mission.description}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(mission.id)}
          className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg"
        >
          <Trash2 className="w-5 h-5 text-red-400" />
        </motion.button>
      </div>
    </motion.div>
  );
};

MissionCard.propTypes = {
  mission: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

// ============================================
// MAIN FUNCTIONAL COMPONENT with Hooks
// ============================================
const SpaceLab = () => {
  const { speak } = useVoice();
  const [astronauts, setAstronauts] = useState([]);
  const [missionState, dispatch] = useReducer(missionReducer, {
    missions: [],
    totalMissions: 0
  });
  const [newMission, setNewMission] = useState({ title: '', description: '' });

  useEffect(() => {
    speak('Welcome to the Space Lab! Here you can register astronauts and plan missions.');
  }, []);

  // useMemo - Calculate statistics
  const stats = useMemo(() => {
    const totalAstronauts = astronauts.length;
    const completedMissions = missionState.missions.filter(m => m.completed).length;
    const pendingMissions = missionState.missions.filter(m => !m.completed).length;
    const avgAge = astronauts.length > 0
      ? Math.round(astronauts.reduce((sum, a) => sum + parseInt(a.age), 0) / astronauts.length)
      : 0;

    return { totalAstronauts, completedMissions, pendingMissions, avgAge };
  }, [astronauts, missionState.missions]);

  // useCallback - Memoized handlers
  const handleAstronautSubmit = useCallback((astronaut) => {
    setAstronauts(prev => [...prev, astronaut]);
    speak(`${astronaut.name} registered as ${astronaut.rank}`);
  }, [speak]);

  const handleAddMission = useCallback((e) => {
    e.preventDefault();
    if (newMission.title.trim() && newMission.description.trim()) {
      dispatch({
        type: 'ADD_MISSION',
        payload: {
          id: Date.now(),
          title: newMission.title,
          description: newMission.description,
          completed: false
        }
      });
      setNewMission({ title: '', description: '' });
      speak('Mission added successfully');
    }
  }, [newMission, speak]);

  const handleToggleMission = useCallback((id) => {
    dispatch({ type: 'TOGGLE_COMPLETE', payload: id });
  }, []);

  const handleDeleteMission = useCallback((id) => {
    dispatch({ type: 'DELETE_MISSION', payload: id });
    speak('Mission deleted');
  }, [speak]);

  const handleDeleteAstronaut = useCallback((id) => {
    setAstronauts(prev => prev.filter(a => a.id !== id));
    speak('Astronaut removed');
  }, [speak]);

  return (
    <div className="min-h-screen p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white font-friendly mb-4">
            🔬 Space Lab
          </h1>
          <p className="text-xl text-white/80 font-friendly">
            All React Concepts Demonstration - Forms, Hooks, Class Components & More!
          </p>
        </motion.div>

        {/* Statistics Dashboard - Using useMemo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Fragment>
            <div className="p-4 bg-cosmic-purple/20 rounded-xl border border-cosmic-purple text-center">
              <div className="text-3xl font-bold text-white font-friendly">{stats.totalAstronauts}</div>
              <div className="text-sm text-white/70 font-friendly">Astronauts</div>
            </div>
            <div className="p-4 bg-cosmic-blue/20 rounded-xl border border-cosmic-blue text-center">
              <div className="text-3xl font-bold text-white font-friendly">{stats.completedMissions}</div>
              <div className="text-sm text-white/70 font-friendly">Completed</div>
            </div>
            <div className="p-4 bg-yellow-500/20 rounded-xl border border-yellow-500 text-center">
              <div className="text-3xl font-bold text-white font-friendly">{stats.pendingMissions}</div>
              <div className="text-sm text-white/70 font-friendly">Pending</div>
            </div>
            <div className="p-4 bg-green-500/20 rounded-xl border border-green-500 text-center">
              <div className="text-3xl font-bold text-white font-friendly">{stats.avgAge || '-'}</div>
              <div className="text-sm text-white/70 font-friendly">Avg Age</div>
            </div>
          </Fragment>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Astronaut Registration (Class Component with Forms) */}
          <div>
            <ThemedAstronautForm
              onSubmit={handleAstronautSubmit}
              onMount={() => console.log('Form mounted')}
            />

            {/* Registered Astronauts List */}
            {astronauts.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-6 bg-midnight-700/30 backdrop-blur-md rounded-2xl border-2 border-white/10"
              >
                <h3 className="text-2xl font-bold text-white font-friendly mb-4">
                  Registered Astronauts ({astronauts.length})
                </h3>
                <div className="space-y-3">
                  {astronauts.map(astronaut => (
                    <div
                      key={astronaut.id}
                      className="p-4 bg-white/5 rounded-xl border border-white/10 flex justify-between items-start"
                    >
                      <div>
                        <h4 className="text-lg font-bold text-white font-friendly">{astronaut.name}</h4>
                        <p className="text-sm text-white/70 font-friendly">
                          {astronaut.rank.toUpperCase()} • Age: {astronaut.age}
                        </p>
                        <p className="text-sm text-cosmic-blue font-friendly">
                          Skills: {astronaut.skills.join(', ')}
                        </p>
                        <p className="text-sm text-white/60 font-friendly mt-1">{astronaut.bio}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteAstronaut(astronaut.id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </motion.button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Mission Planning (useReducer) */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-midnight-700/30 backdrop-blur-md rounded-2xl border-2 border-white/10"
            >
              <h2 className="text-3xl font-bold text-white font-friendly mb-6">
                Mission Planning (useReducer)
              </h2>

              {/* Add Mission Form */}
              <form onSubmit={handleAddMission} className="space-y-4 mb-6">
                <input
                  type="text"
                  value={newMission.title}
                  onChange={(e) => setNewMission(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Mission title"
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white font-friendly text-lg focus:outline-none focus:border-cosmic-blue placeholder-white/40"
                />
                <input
                  type="text"
                  value={newMission.description}
                  onChange={(e) => setNewMission(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Mission description"
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white font-friendly text-lg focus:outline-none focus:border-cosmic-blue placeholder-white/40"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-cosmic-purple to-cosmic-blue rounded-xl text-white font-friendly text-lg font-bold"
                >
                  Add Mission
                </motion.button>
              </form>

              {/* Missions List */}
              <div className="space-y-3">
                {missionState.missions.length === 0 ? (
                  <p className="text-center text-white/50 font-friendly py-8">
                    No missions planned yet. Add your first mission!
                  </p>
                ) : (
                  missionState.missions.map(mission => (
                    <MissionCard
                      key={mission.id}
                      mission={mission}
                      onToggle={handleToggleMission}
                      onDelete={handleDeleteMission}
                    />
                  ))
                )}
              </div>

              {missionState.missions.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => dispatch({ type: 'RESET' })}
                  className="w-full mt-4 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500 rounded-xl text-white font-friendly text-lg font-bold"
                >
                  Reset All Missions
                </motion.button>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceLab;
