import { motion } from 'framer-motion';
import { Phone, GraduationCap, Heart, PhoneCall } from 'lucide-react';
import type { Participant } from '../types/participant';

interface FriendCardProps {
  participant: Participant;
  friend: Participant;
}

function getInitials(p: Participant): string {
  return `${p.firstName.charAt(0)}${p.lastName.charAt(0)}`.toUpperCase();
}

function formatName(p: Participant): string {
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  // Handle multi-word names
  const fmt = (s: string) => s.split(' ').map(cap).join(' ');
  return `${fmt(p.firstName)} ${fmt(p.lastName)}`;
}

export default function FriendCard({ participant, friend }: FriendCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.2 }}
      className="bg-white rounded-3xl shadow-xl border border-purple-100 overflow-hidden"
    >
      {/* Header banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-5 text-center">
        <p className="text-purple-100 text-sm mb-1">Hey {formatName(participant)}, your friend this week is…</p>
        <h2 className="text-white font-bold text-2xl tracking-tight">Your Friend of the Week Is...</h2>
      </div>

      {/* Avatar + Name */}
      <div className="flex flex-col items-center px-6 py-6 gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.35 }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg"
        >
          {getInitials(friend)}
        </motion.div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-purple-900">{formatName(friend)}</h3>
          <div className="flex items-center justify-center gap-1.5 mt-1 text-purple-500 text-sm">
            <GraduationCap className="w-4 h-4" />
            <span>{friend.year}</span>
          </div>
        </div>

        <Heart className="w-5 h-5 text-pink-400 fill-pink-300" />

        {/* Phone */}
        <div className="flex items-center gap-2 text-purple-700 text-sm bg-purple-50 rounded-xl px-4 py-2.5 w-full justify-center">
          <Phone className="w-4 h-4 text-purple-400" />
          <span className="font-mono">{friend.phone}</span>
        </div>

        {/* Contact button */}
        <motion.a
          href={`tel:${friend.phone}`}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
        >
          <PhoneCall className="w-4 h-4" />
          Contact Your Friend
        </motion.a>
      </div>
    </motion.div>
  );
}
