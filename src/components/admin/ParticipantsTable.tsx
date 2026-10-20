import { useState, useMemo } from 'react';
import { Search, Filter, AlertTriangle, CheckCircle, Pencil } from 'lucide-react';
import type { Participant } from '../../types/participant';

interface ParticipantsTableProps {
  participants: Participant[];
  onEdit?: (participant: Participant) => void;
}

const YEAR_OPTIONS = ['All', 'Y1', 'Y2', 'Y3', 'Btech'];

export default function ParticipantsTable({ participants, onEdit }: ParticipantsTableProps) {
  const [query, setQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('All');

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return participants.filter(p => {
      const nameMatch =
        !q ||
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.phone.includes(q);
      const yearMatch = yearFilter === 'All' || p.year === yearFilter;
      return nameMatch && yearMatch;
    });
  }, [participants, query, yearFilter]);

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            type="search"
            placeholder="Search by name or phone…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <select
            value={yearFilter}
            onChange={e => setYearFilter(e.target.value)}
            className="pl-9 pr-8 py-2 rounded-xl border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 appearance-none bg-white"
          >
            {YEAR_OPTIONS.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-purple-100">
        <table className="w-full text-sm">
          <thead className="bg-purple-50 text-purple-700">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Year</th>
              <th className="px-4 py-3 text-left font-semibold">Phone</th>
              <th className="px-4 py-3 text-center font-semibold">Status</th>
              {onEdit && <th className="px-4 py-3 text-right font-semibold">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50 bg-white">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={onEdit ? 5 : 4} className="px-4 py-8 text-center text-purple-300">
                  No participants match your search.
                </td>
              </tr>
            ) : (
              filtered.map(p => (
                <tr key={p.id} className="hover:bg-purple-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-purple-900">
                    {p.firstName} {p.lastName}
                    {p.adminNote && (
                      <p className="text-xs text-amber-600 mt-0.5">{p.adminNote}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-purple-600">
                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">
                      {p.year}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-purple-600">
                    {p.phone || <span className="text-red-400 italic">missing</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {p.incomplete ? (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3" />
                        Incomplete
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Ready
                      </span>
                    )}
                  </td>
                  {onEdit && (
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onEdit(p)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors"
                        title="Edit participant"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-purple-400 text-right">
        Showing {filtered.length} of {participants.length} participants
      </p>
    </div>
  );
}
