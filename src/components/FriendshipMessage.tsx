import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface FriendshipMessageProps {
  message: string;
}

export default function FriendshipMessage({ message }: FriendshipMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="relative bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-6 mt-4"
    >
      <Quote className="absolute top-4 left-4 w-6 h-6 text-purple-200" />
      <p className="text-purple-700 text-center italic leading-relaxed pt-2 text-sm sm:text-base">
        {message}
      </p>
    </motion.div>
  );
}
