import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, Sparkles } from 'lucide-react';
import FriendCard from '../components/FriendCard';
import FriendshipMessage from '../components/FriendshipMessage';
import { getParticipants } from '../services/participantStorage';
import { ensureMatchesForCurrentWeek, getMatchForParticipant } from '../services/matchingStorage';
import { friendshipMessages } from '../data/friendshipMessages';
import { messageIndexForParticipant } from '../utils/matching';
import { getCurrentWeekId } from '../utils/week';
import { syncFromCloudToLocal } from '../services/jsonbin';
import type { Participant } from '../types/participant';

// Simple confetti pieces — deterministic positions
const CONFETTI = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  x: (((i * 137.5) % 360) - 180) * 1.2,
  y: -((i * 53) % 300 + 80),
  color: ['#ec4899', '#a855f7', '#6366f1', '#f59e0b', '#10b981', '#f97316'][i % 6],
  rotate: (i * 47) % 360,
  size: 6 + (i % 5) * 2,
}));

type Status = 'loading' | 'error' | 'success';

export default function MatchPage() {
  const { participantId } = useParams<{ participantId: string }>();
  const navigate = useNavigate();

  const [status, setStatus] = useState<Status>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [friend, setFriend] = useState<Participant | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    async function loadMatch() {
      if (!participantId) {
        setErrorMsg('No participant specified.');
        setStatus('error');
        return;
      }

      // Try syncing cloud matches in case admin reshuffled
      await syncFromCloudToLocal().catch(() => {});

      const all = getParticipants();
    const found = all.find(p => p.id === participantId);

    if (!found) {
      setErrorMsg('Participant not found. Please search again from the home page.');
      setStatus('error');
      return;
    }

    // Ensure weekly matches exist (auto-generates if new week or missing)
    const eligible = all.filter(p => !p.incomplete);
    try {
      ensureMatchesForCurrentWeek(eligible);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Could not generate matches. Please contact the administrator.',
      );
      setStatus('error');
      return;
    }

    const friendId = getMatchForParticipant(participantId);
    if (!friendId) {
      setErrorMsg('No match found for you this week. Please contact the administrator.');
      setStatus('error');
      return;
    }

    const matchedFriend = all.find(p => p.id === friendId);
    if (!matchedFriend) {
      setErrorMsg('Your matched friend could not be found in the participant list.');
      setStatus('error');
      return;
    }

    setParticipant(found);
    setFriend(matchedFriend);
    setStatus('success');
    setTimeout(() => setShowConfetti(true), 300);
  }

  loadMatch();
}, [participantId]);

  const message = useMemo(() => {
    if (!participantId) return '';
    const idx = messageIndexForParticipant(participantId, getCurrentWeekId(), friendshipMessages.length);
    return friendshipMessages[idx];
  }, [participantId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-900 flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Confetti burst */}
      <AnimatePresence>
        {showConfetti && (
          <>
            {CONFETTI.map(p => (
              <motion.div
                key={p.id}
                className="absolute top-1/3 left-1/2 rounded-sm pointer-events-none"
                style={{ width: p.size, height: p.size, background: p.color, zIndex: 20 }}
                initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rotate }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: Math.random() * 0.2 }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => navigate('/')}
        className="absolute top-5 left-5 flex items-center gap-1.5 text-purple-200 hover:text-white transition-colors text-sm z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </motion.button>

      {/* Loading */}
      {status === 'loading' && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-4 border-purple-400 border-t-pink-400 rounded-full"
        />
      )}

      {/* Error */}
      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm text-center"
        >
          <p className="text-4xl mb-3">😔</p>
          <h2 className="text-lg font-bold text-purple-900 mb-2">Something went wrong</h2>
          <p className="text-purple-600 text-sm mb-5">{errorMsg}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold px-6 py-2.5 rounded-xl"
          >
            Return Home
          </button>
        </motion.div>
      )}

      {/* Success */}
      {status === 'success' && participant && friend && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-md space-y-4 z-10"
        >
          {/* Sparkle header */}
          <div className="text-center mb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="inline-flex items-center gap-2 bg-pink-500/20 border border-pink-400/30 rounded-full px-4 py-1.5 mb-2"
            >
              <Sparkles className="w-4 h-4 text-pink-300" />
              <span className="text-pink-200 text-sm font-medium">Your match is revealed!</span>
              <Sparkles className="w-4 h-4 text-pink-300" />
            </motion.div>
          </div>

          <FriendCard participant={participant} friend={friend} />
          <FriendshipMessage message={message} />

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <p className="text-purple-200 text-sm mb-4 flex items-center justify-center gap-1">
              <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
              Take the first step. Send a hello!
            </p>
            <button
              onClick={() => navigate('/')}
              className="text-purple-300 hover:text-white text-sm transition-colors underline underline-offset-2"
            >
              ← Return to home
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
