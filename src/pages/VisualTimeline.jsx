import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Check, Plus, Trash2 } from 'lucide-react';
import { useVoice } from '../contexts/VoiceContext';

const VisualTimeline = () => {
  const { speak, registerCommand } = useVoice();

  const defaultActivities = [
    { id: 1, time: '08:00', activity: 'Wake Up', emoji: '☀️', completed: false, color: 'from-yellow-400 to-orange-500' },
    { id: 2, time: '08:30', activity: 'Breakfast', emoji: '🍳', completed: false, color: 'from-orange-400 to-red-500' },
    { id: 3, time: '09:00', activity: 'Learning Time', emoji: '📚', completed: false, color: 'from-blue-500 to-cyan-500' },
    { id: 4, time: '10:30', activity: 'Play Time', emoji: '🎮', completed: false, color: 'from-purple-500 to-pink-500' },
    { id: 5, time: '12:00', activity: 'Lunch', emoji: '🍽️', completed: false, color: 'from-green-500 to-teal-500' },
    { id: 6, time: '13:00', activity: 'Quiet Time', emoji: '🛋️', completed: false, color: 'from-indigo-500 to-purple-500' },
    { id: 7, time: '15:00', activity: 'Snack Time', emoji: '🍎', completed: false, color: 'from-red-400 to-pink-500' },
    { id: 8, time: '16:00', activity: 'Outdoor Play', emoji: '⚽', completed: false, color: 'from-green-400 to-cyan-500' },
    { id: 9, time: '18:00', activity: 'Dinner', emoji: '🍝', completed: false, color: 'from-orange-500 to-yellow-500' },
    { id: 10, time: '19:30', activity: 'Bath Time', emoji: '🛁', completed: false, color: 'from-cyan-400 to-blue-500' },
    { id: 11, time: '20:00', activity: 'Story Time', emoji: '📖', completed: false, color: 'from-purple-400 to-indigo-500' },
    { id: 12, time: '21:00', activity: 'Bedtime', emoji: '🌙', completed: false, color: 'from-indigo-600 to-purple-700' }
  ];

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('stellarStep_timeline');
    return saved ? JSON.parse(saved) : defaultActivities;
  });

  const [newActivity, setNewActivity] = useState({ time: '', activity: '', emoji: '⭐' });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const completed = activities.filter(a => a.completed).length;
    speak(`Welcome to Visual Timeline! You have ${activities.length} activities planned. ${completed} completed so far. Great job staying organized!`);
  }, []);

  useEffect(() => {
    const unregister = registerCommand('visual-timeline', (cmd) => {
      if (cmd.includes('what') && cmd.includes('next')) {
        const next = activities.find(a => !a.completed);
        if (next) {
          speak(`Next activity: ${next.activity} at ${next.time}`);
        } else {
          speak('All activities completed! Great job!');
        }
      } else if (cmd.includes('mark complete') || cmd.includes('done')) {
        const next = activities.find(a => !a.completed);
        if (next) {
          handleToggleComplete(next.id);
        }
      }
    });
    return unregister;
  }, [activities, registerCommand]);

  // Save to localStorage whenever activities change
  useEffect(() => {
    localStorage.setItem('stellarStep_timeline', JSON.stringify(activities));
    
    const prefs = JSON.parse(localStorage.getItem('stellarStep_progress') || '{}');
    prefs.timeline = activities;
    localStorage.setItem('stellarStep_progress', JSON.stringify(prefs));
  }, [activities]);

  const handleToggleComplete = (id) => {
    setActivities(prev => prev.map(activity => {
      if (activity.id === id) {
        const newCompleted = !activity.completed;
        if (newCompleted) {
          speak(`${activity.activity} marked as complete! Great job!`);
        }
        return { ...activity, completed: newCompleted };
      }
      return activity;
    }));
  };

  const handleDeleteActivity = (id) => {
    const activity = activities.find(a => a.id === id);
    speak(`Removing ${activity.activity}`);
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  const handleAddActivity = () => {
    if (!newActivity.time || !newActivity.activity) {
      speak('Please fill in time and activity name');
      return;
    }

    const activity = {
      id: Date.now(),
      time: newActivity.time,
      activity: newActivity.activity,
      emoji: newActivity.emoji || '⭐',
      completed: false,
      color: 'from-cosmic-purple to-cosmic-blue'
    };

    setActivities(prev => [...prev, activity].sort((a, b) => a.time.localeCompare(b.time)));
    speak(`Added ${newActivity.activity} at ${newActivity.time}`);
    setNewActivity({ time: '', activity: '', emoji: '⭐' });
    setShowAddForm(false);
  };

  const getCurrentActivity = () => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    for (let i = 0; i < activities.length; i++) {
      if (activities[i].time > currentTime) {
        return i > 0 ? activities[i - 1] : null;
      }
    }
    return activities[activities.length - 1];
  };

  const currentActivity = getCurrentActivity();
  const completedCount = activities.filter(a => a.completed).length;
  const progressPercentage = (completedCount / activities.length) * 100;

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Calendar className="w-16 h-16 text-cosmic-blue" />
          </motion.div>
          <h1 className="text-5xl font-bold mb-4 text-white font-friendly">
            📅 Visual Timeline
          </h1>
          <p className="text-xl text-white/80 font-friendly">
            Plan Your Day!
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg text-white font-friendly">
              Progress Today
            </span>
            <span className="text-lg text-white font-friendly">
              {completedCount} / {activities.length} completed
            </span>
          </div>
          <div className="h-6 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-green-500 to-cyan-500"
            />
          </div>
        </div>

        {/* Current Activity Highlight */}
        {currentActivity && (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={`mb-8 p-6 rounded-2xl bg-gradient-to-r ${currentActivity.color}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-5xl">{currentActivity.emoji}</span>
                <div>
                  <p className="text-sm text-white/80 font-friendly">Current Activity</p>
                  <h3 className="text-3xl font-bold text-white font-friendly">
                    {currentActivity.activity}
                  </h3>
                  <p className="text-white/90 font-friendly">{currentActivity.time}</p>
                </div>
              </div>
              <Clock className="w-12 h-12 text-white/50" />
            </div>
          </motion.div>
        )}

        {/* Add Activity Button */}
        <div className="mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full p-4 bg-cosmic-purple/20 hover:bg-cosmic-purple/30 rounded-2xl text-white font-friendly text-lg flex items-center justify-center space-x-2 border-2 border-dashed border-cosmic-purple"
            style={{ minHeight: '64px' }}
          >
            <Plus className="w-6 h-6" />
            <span>Add New Activity</span>
          </motion.button>
        </div>

        {/* Add Activity Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 p-6 bg-white/5 rounded-2xl"
          >
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="time"
                value={newActivity.time}
                onChange={(e) => setNewActivity(prev => ({ ...prev, time: e.target.value }))}
                className="px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white font-friendly text-lg focus:outline-none focus:border-cosmic-blue"
                style={{ minHeight: '56px' }}
              />
              <input
                type="text"
                placeholder="Activity name"
                value={newActivity.activity}
                onChange={(e) => setNewActivity(prev => ({ ...prev, activity: e.target.value }))}
                className="px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white font-friendly text-lg focus:outline-none focus:border-cosmic-blue placeholder-white/40"
                style={{ minHeight: '56px' }}
              />
              <input
                type="text"
                placeholder="Emoji"
                value={newActivity.emoji}
                onChange={(e) => setNewActivity(prev => ({ ...prev, emoji: e.target.value }))}
                className="px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white font-friendly text-lg text-center focus:outline-none focus:border-cosmic-blue placeholder-white/40"
                style={{ minHeight: '56px' }}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddActivity}
              className="w-full mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl text-white font-friendly text-lg font-bold"
              style={{ minHeight: '56px' }}
            >
              Add Activity
            </motion.button>
          </motion.div>
        )}

        {/* Timeline Activities */}
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative p-6 rounded-2xl transition-all ${
                activity.completed
                  ? 'bg-green-500/20 border-2 border-green-500/50'
                  : 'bg-white/5 border-2 border-white/10 hover:bg-white/10'
              }`}
              style={{ minHeight: '96px' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Time */}
                  <div className="bg-white/10 px-4 py-2 rounded-xl min-w-[80px] text-center">
                    <p className="text-white font-friendly font-bold">{activity.time}</p>
                  </div>

                  {/* Emoji */}
                  <div className="text-4xl">{activity.emoji}</div>

                  {/* Activity Name */}
                  <div className="flex-1">
                    <h3 className={`text-2xl font-bold font-friendly ${
                      activity.completed ? 'text-white line-through' : 'text-white'
                    }`}>
                      {activity.activity}
                    </h3>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleToggleComplete(activity.id)}
                    onMouseEnter={() => speak(activity.completed ? 'Mark incomplete' : 'Mark complete')}
                    className={`p-3 rounded-full transition-colors ${
                      activity.completed
                        ? 'bg-green-500 text-white'
                        : 'bg-white/10 hover:bg-green-500/30 text-white'
                    }`}
                    style={{ minWidth: '48px', minHeight: '48px' }}
                  >
                    <Check className="w-6 h-6" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteActivity(activity.id)}
                    onMouseEnter={() => speak('Delete activity')}
                    className="p-3 rounded-full bg-white/10 hover:bg-red-500/30 text-white transition-colors"
                    style={{ minWidth: '48px', minHeight: '48px' }}
                  >
                    <Trash2 className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              {/* Completion Animation */}
              {activity.completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2"
                >
                  <span className="text-2xl">✨</span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Voice Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center text-white/60 font-friendly"
        >
          <p className="text-lg">
            💬 Say "What's next?" or "Mark complete" to use voice commands
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VisualTimeline;
