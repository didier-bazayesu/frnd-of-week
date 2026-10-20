import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Users, Calendar, ArrowRight } from 'lucide-react';
import ParticipantForm from '../components/ParticipantForm';
import Footer from '../components/Footer';
import { findParticipant } from '../services/participantStorage';
import { syncFromCloudToLocal } from '../services/jsonbin';

// Fixed floating heart configurations for deterministic animation
const HEARTS = [
  { id: 0, left: 8,  top: 12, size: 18, delay: 0,   dur: 8  },
  { id: 1, left: 22, top: 65, size: 14, delay: 1.2, dur: 11 },
  { id: 2, left: 38, top: 30, size: 22, delay: 2.5, dur: 9  },
  { id: 3, left: 55, top: 80, size: 12, delay: 0.8, dur: 13 },
  { id: 4, left: 68, top: 20, size: 20, delay: 3.1, dur: 10 },
  { id: 5, left: 80, top: 55, size: 16, delay: 1.7, dur: 8  },
  { id: 6, left: 92, top: 10, size: 14, delay: 4.2, dur: 12 },
  { id: 7, left: 15, top: 85, size: 10, delay: 2.0, dur: 9  },
  { id: 8, left: 48, top: 5,  size: 24, delay: 0.5, dur: 11 },
  { id: 9, left: 75, top: 90, size: 18, delay: 3.8, dur: 10 },
];

const HOW_IT_WORKS = [
  { icon: Users,    step: '1', text: 'Enter your name and phone number as registered.' },
  { icon: Sparkles, step: '2', text: 'Our algorithm matches you with someone special.' },
  { icon: Heart,    step: '3', text: 'Reach out and begin a new friendship this week!' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sync latest cloud state in background on page load
  useEffect(() => {
    syncFromCloudToLocal().catch(() => {});
  }, []);

  function handleSearch(firstName: string, lastName: string, phone: string) {
    setIsLoading(true);
    setGlobalError('');

    // Small timeout for UX feel
    setTimeout(() => {
      const participant = findParticipant(firstName, lastName, phone);
      setIsLoading(false);

      if (!participant) {
        setGlobalError(
          "We couldn't find you in our friendship community yet. ❤️ Please contact the administrator to register you and become part of next week's connections!",
        );
        return;
      }

      navigate(`/match/${participant.id}`);
    }, 400);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-900 flex flex-col relative overflow-hidden">
      {/* Floating hearts */}
      {HEARTS.map(h => (
        <motion.div
          key={h.id}
          className="absolute pointer-events-none select-none"
          style={{ left: `${h.left}%`, top: `${h.top}%` }}
          animate={{ y: [0, -20, 0], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: h.dur, delay: h.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Heart
            style={{ width: h.size, height: h.size }}
            className="text-pink-400 fill-pink-400"
          />
        </motion.div>
      ))}

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 relative z-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 max-w-2xl"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-pink-400 fill-pink-300" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Friend of the Week
            </h1>
            <Heart className="w-8 h-8 text-pink-400 fill-pink-300" />
          </div>
          <p className="text-purple-200 text-lg sm:text-xl font-medium mb-3">
            One week. One new connection. A friendship that could last forever.
          </p>
          <p className="text-purple-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Every week, we match community members with someone they've never connected with before.
            Enter your details below to discover your friend for this week.
          </p>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 w-full max-w-2xl"
        >
          {HOW_IT_WORKS.map(({ icon: Icon, step, text }) => (
            <div key={step} className="flex flex-col items-center text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="w-9 h-9 bg-pink-500/20 border border-pink-400/30 rounded-xl flex items-center justify-center mb-2">
                <Icon className="w-4 h-4 text-pink-300" />
              </div>
              <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Step {step}</p>
              <p className="text-purple-100 text-sm leading-snug">{text}</p>
            </div>
          ))}
        </motion.div>

        {/* Search card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-7 border border-white/30"
        >
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-pink-500" />
            <h2 className="text-lg font-bold text-purple-900">Discover Your Friend</h2>
          </div>
          <p className="text-purple-400 text-xs mb-5">Enter your details exactly as registered.</p>
          <ParticipantForm
            onSubmit={handleSearch}
            isLoading={isLoading}
            globalError={globalError}
          />
        </motion.div>

        {/* CTA below card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 flex items-center gap-2 text-purple-300 text-sm"
        >
          <Calendar className="w-4 h-4" />
          <span>New matches every week</span>
          <ArrowRight className="w-3.5 h-3.5" />
          <span>Start a conversation today!</span>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
