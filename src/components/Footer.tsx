import { Lock, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto py-6 px-4 text-center">
      <p className="flex items-center justify-center gap-1.5 text-xs text-purple-300 mb-2">
        <Info className="w-3.5 h-3.5" />
        Participant data is stored locally in your browser for this demo. No data is sent to a server.
      </p>
      <Link
        to="/admin/login"
        className="inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-purple-100 transition-colors"
      >
        <Lock className="w-3 h-3" />
        Admin Login
      </Link>
    </footer>
  );
}
