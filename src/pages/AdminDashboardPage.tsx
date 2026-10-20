import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, CheckCircle, AlertTriangle, Heart,
  RefreshCw, LogOut, Calendar, Shuffle, ChevronDown, ChevronUp,
} from 'lucide-react';
import StatsCard from '../components/admin/StatsCard';
import ParticipantsTable from '../components/admin/ParticipantsTable';
import CsvImport from '../components/admin/CsvImport';
import {
  getParticipants,
  saveParticipants,
  clearImportedParticipants,
  isUsingImportedData,
} from '../services/participantStorage';
import {
  getWeeklyMatches,
  saveWeeklyMatches,
  clearWeeklyMatches,
  getMatchForParticipant,
} from '../services/matchingStorage';
import { generateMatches } from '../utils/matching';
import { getCurrentWeekId } from '../utils/week';
import { STORAGE_KEYS } from '../config/admin';
import type { Participant } from '../types/participant';
import type { WeeklyMatches } from '../types/matching';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [matches, setMatches] = useState<WeeklyMatches | null>(null);
  const [usingImported, setUsingImported] = useState(false);
  const [confirmRegen, setConfirmRegen] = useState(false);
  const [showMatchPreview, setShowMatchPreview] = useState(false);
  const [regenError, setRegenError] = useState('');

  const refresh = useCallback(() => {
    setParticipants(getParticipants());
    setMatches(getWeeklyMatches());
    setUsingImported(isUsingImportedData());
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const eligible = participants.filter(p => !p.incomplete);
  const incomplete = participants.filter(p => p.incomplete);
  const weekId = getCurrentWeekId();

  function handleLogout() {
    sessionStorage.removeItem(STORAGE_KEYS.adminSession);
    navigate('/admin/login', { replace: true });
  }

  function handleGenerateMatches() {
    if (!confirmRegen) { setConfirmRegen(true); return; }
    setRegenError('');
    try {
      clearWeeklyMatches();
      const pairs = generateMatches(eligible, weekId);
      saveWeeklyMatches(weekId, pairs);
      refresh();
      setConfirmRegen(false);
    } catch (err) {
      setRegenError(err instanceof Error ? err.message : 'Failed to generate matches.');
    }
  }

  function handleImport(newList: Participant[]) {
    saveParticipants(newList);
    clearWeeklyMatches(); // Invalidate matches when list changes
    refresh();
  }

  function handleResetList() {
    clearImportedParticipants();
    clearWeeklyMatches();
    refresh();
  }

  function formatName(p: Participant): string {
    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    const fmt = (s: string) => s.split(' ').map(cap).join(' ');
    return `${fmt(p.firstName)} ${fmt(p.lastName)}`;
  }

  return (
    <div className="min-h-screen bg-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-purple-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500 fill-pink-400" />
            <span className="font-bold text-purple-900">Friend of the Week</span>
            <span className="text-purple-300 mx-1">·</span>
            <span className="text-purple-500 text-sm">Admin Dashboard</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-purple-500 hover:text-purple-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <section>
          <h2 className="text-lg font-bold text-purple-900 mb-4">Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatsCard label="Total Participants" value={participants.length} icon={Users} accent="purple" />
            <StatsCard label="Ready for Matching" value={eligible.length} icon={CheckCircle} accent="green" />
            <StatsCard label="Incomplete Records" value={incomplete.length} icon={AlertTriangle} accent="amber" />
            <StatsCard label="Matches This Week" value={matches ? matches.pairs.length / 2 : 0} icon={Heart} accent="pink" />
          </div>
        </section>

        {/* Current week */}
        <section className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-purple-500" />
            <h2 className="font-semibold text-purple-900">Current Week</h2>
          </div>
          <p className="text-purple-400 text-sm mb-4">
            Week identifier: <span className="font-mono text-purple-700">{weekId}</span>
            {matches && (
              <> · Generated: <span className="text-purple-600">{new Date(matches.generatedAt).toLocaleString()}</span></>
            )}
          </p>

          {/* Generate / Regen */}
          <div className="space-y-3">
            {confirmRegen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800"
              >
                ⚠️ This will replace all current weekly assignments. Participants will be matched with different friends.
                <div className="flex gap-2 mt-2">
                  <button onClick={handleGenerateMatches} className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium">
                    Yes, Regenerate
                  </button>
                  <button onClick={() => setConfirmRegen(false)} className="border border-amber-300 text-amber-700 px-3 py-1.5 rounded-lg text-xs">
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            {regenError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{regenError}</p>
            )}

            <button
              onClick={handleGenerateMatches}
              disabled={eligible.length < 2}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
            >
              <Shuffle className="w-4 h-4" />
              {matches ? 'Regenerate Matches' : 'Generate Matches'}
            </button>
            {eligible.length < 2 && (
              <p className="text-xs text-purple-400">Need at least 2 complete participants to generate matches.</p>
            )}
          </div>

          {/* Match preview */}
          {matches && matches.pairs.length > 0 && (
            <div className="mt-4">
              <button
                onClick={() => setShowMatchPreview(v => !v)}
                className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-800 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {showMatchPreview ? 'Hide' : 'Preview'} current matches
                {showMatchPreview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {showMatchPreview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 overflow-x-auto rounded-xl border border-purple-100 max-h-64 overflow-y-auto"
                >
                  <table className="w-full text-xs">
                    <thead className="bg-purple-50 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left text-purple-700">Participant</th>
                        <th className="px-3 py-2 text-center text-purple-400">→</th>
                        <th className="px-3 py-2 text-left text-purple-700">Friend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-50 bg-white">
                      {participants
                        .filter(p => !p.incomplete)
                        .map(p => {
                          const fId = getMatchForParticipant(p.id);
                          const f = participants.find(x => x.id === fId);
                          return f ? (
                            <tr key={p.id}>
                              <td className="px-3 py-2 font-medium text-purple-900">{formatName(p)}</td>
                              <td className="px-3 py-2 text-center text-pink-400">
                                <Heart className="w-3 h-3 inline fill-pink-300" />
                              </td>
                              <td className="px-3 py-2 text-purple-700">{formatName(f)}</td>
                            </tr>
                          ) : null;
                        })}
                    </tbody>
                  </table>
                </motion.div>
              )}
            </div>
          )}
        </section>

        {/* Participants table */}
        <section className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h2 className="font-semibold text-purple-900">Participants</h2>
              {usingImported && (
                <p className="text-xs text-purple-400 mt-0.5">
                  Using admin-imported list.{' '}
                  <button onClick={handleResetList} className="text-purple-600 underline hover:text-purple-800">
                    Reset to built-in data
                  </button>
                </p>
              )}
            </div>
          </div>
          <ParticipantsTable participants={participants} />
        </section>

        {/* CSV Import */}
        <section className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5">
          <h2 className="font-semibold text-purple-900 mb-1">Import / Export</h2>
          <p className="text-xs text-purple-400 mb-4">
            Import a CSV with columns: <span className="font-mono">id, firstName, lastName, year, phone</span>.
            Importing replaces the current list and clears weekly matches.
          </p>
          <CsvImport currentParticipants={participants} onImport={handleImport} />
        </section>

        {/* Privacy note */}
        <p className="text-xs text-center text-purple-300 pb-4">
          ⚠️ All data is stored in your browser's localStorage. Anyone with access to this browser can view or modify it.
          This is a frontend-only demo and is not a secure system.
        </p>
      </main>
    </div>
  );
}
