import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-purple-800 font-bold text-lg hover:text-purple-600 transition-colors"
        >
          <Heart className="w-5 h-5 text-pink-500 fill-pink-400" />
          Friend of the Week
        </Link>
      </div>
    </nav>
  );
}
