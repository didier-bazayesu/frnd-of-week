import { useState, useEffect } from 'react';
import { Cloud, CheckCircle, AlertCircle, RefreshCw, UploadCloud, DownloadCloud, Key, Trash2 } from 'lucide-react';
import {
  getJsonBinConfig,
  saveJsonBinConfig,
  clearJsonBinConfig,
  pushToCloud,
  syncFromCloudToLocal,
  type JsonBinConfig,
} from '../../services/jsonbin';
import { getParticipants } from '../../services/participantStorage';
import { getWeeklyMatches } from '../../services/matchingStorage';

interface CloudSyncSettingsProps {
  onSyncComplete: () => void;
}

export default function CloudSyncSettings({ onSyncComplete }: CloudSyncSettingsProps) {
  const [config, setConfig] = useState<JsonBinConfig | null>(null);
  const [binIdInput, setBinIdInput] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const existing = getJsonBinConfig();
    setConfig(existing);
    if (existing) {
      setBinIdInput(existing.binId);
      setApiKeyInput(existing.apiKey);
    }
  }, []);

  async function handleSaveConfig(e: React.FormEvent) {
    e.preventDefault();
    if (!binIdInput.trim() || !apiKeyInput.trim()) {
      setStatusMessage({ text: 'Please provide both Bin ID and Master API Key.', type: 'error' });
      return;
    }

    const newCfg: JsonBinConfig = {
      binId: binIdInput.trim(),
      apiKey: apiKeyInput.trim(),
    };

    saveJsonBinConfig(newCfg);
    setConfig(newCfg);
    setStatusMessage({ text: 'Cloud credentials saved! Testing connection...', type: 'success' });

    // Test connection by pushing current local data
    setIsSyncing(true);
    const success = await pushToCloud(getParticipants(), getWeeklyMatches());
    setIsSyncing(false);

    if (success) {
      setStatusMessage({ text: 'Connected and synchronized with JSONBin successfully!', type: 'success' });
      onSyncComplete();
    } else {
      setStatusMessage({
        text: 'Credentials saved, but failed to reach JSONBin. Please check your Bin ID and Master Key.',
        type: 'error',
      });
    }
  }

  function handleDisconnect() {
    clearJsonBinConfig();
    setConfig(null);
    setBinIdInput('');
    setApiKeyInput('');
    setStatusMessage({ text: 'Cloud sync disconnected. Operating in local-only mode.', type: 'success' });
  }

  async function handlePush() {
    setIsSyncing(true);
    setStatusMessage(null);
    const success = await pushToCloud(getParticipants(), getWeeklyMatches());
    setIsSyncing(false);
    if (success) {
      setStatusMessage({ text: 'Current participants and matches pushed to cloud successfully!', type: 'success' });
      onSyncComplete();
    } else {
      setStatusMessage({ text: 'Failed to push data to JSONBin. Check your network or credentials.', type: 'error' });
    }
  }

  async function handlePull() {
    setIsSyncing(true);
    setStatusMessage(null);
    const success = await syncFromCloudToLocal();
    setIsSyncing(false);
    if (success) {
      setStatusMessage({ text: 'Pulled latest participants and matches from cloud!', type: 'success' });
      onSyncComplete();
    } else {
      setStatusMessage({ text: 'Failed to pull data from JSONBin.', type: 'error' });
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Cloud className="w-5 h-5 text-indigo-600" />
          <h2 className="font-semibold text-purple-900">Live Cloud Sync (JSONBin)</h2>
        </div>
        {config ? (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            Connected
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            Local Device Only
          </span>
        )}
      </div>

      <p className="text-xs text-purple-500 leading-relaxed">
        Connecting JSONBin allows shuffles and participant updates made by the admin to instantly reflect for every visitor on the deployed site.
      </p>

      {statusMessage && (
        <div
          className={`flex items-center gap-2 text-xs p-3 rounded-xl border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {config ? (
        <div className="space-y-3 pt-1">
          <div className="flex flex-wrap items-center justify-between bg-purple-50/70 rounded-xl p-3 text-xs gap-2">
            <div>
              <p className="font-semibold text-purple-900">Active Bin ID:</p>
              <code className="text-purple-700 font-mono text-[11px]">{config.binId}</code>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePush}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                Push Local to Cloud
              </button>
              <button
                type="button"
                onClick={handlePull}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-purple-200 hover:border-purple-300 text-purple-700 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
              >
                <DownloadCloud className="w-3.5 h-3.5" />
                Pull Cloud
              </button>
              <button
                type="button"
                onClick={handleDisconnect}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs transition-colors"
                title="Disconnect JSONBin"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <p className="text-[11px] text-purple-400 italic">
            💡 Any new shuffle or participant edit you make will automatically update the cloud.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSaveConfig} className="space-y-3 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-purple-900 mb-1">
                JSONBin Bin ID
              </label>
              <input
                type="text"
                placeholder="e.g. 660f... or bin id"
                value={binIdInput}
                onChange={e => setBinIdInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-purple-900 mb-1">
                JSONBin Master API Key ($2a$10$...)
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-purple-400" />
                <input
                  type="password"
                  placeholder="Master Key from jsonbin.io"
                  value={apiKeyInput}
                  onChange={e => setApiKeyInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-purple-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
            <span className="text-[11px] text-purple-400">
              Free setup at{' '}
              <a
                href="https://jsonbin.io"
                target="_blank"
                rel="noreferrer"
                className="text-purple-600 underline font-medium hover:text-purple-800"
              >
                jsonbin.io
              </a>
            </span>
            <button
              type="submit"
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              Connect & Sync Cloud
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
