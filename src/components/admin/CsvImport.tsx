import { useRef, useState } from 'react';
import { Upload, X, Download, CheckCircle, AlertTriangle } from 'lucide-react';
import { parseCsv, exportCsv, downloadCsv, type CsvParseResult } from '../../utils/csv';
import type { Participant } from '../../types/participant';

interface CsvImportProps {
  currentParticipants: Participant[];
  onImport: (newList: Participant[]) => void;
}

type Step = 'idle' | 'preview' | 'done';

export default function CsvImport({ currentParticipants, onImport }: CsvImportProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>('idle');
  const [result, setResult] = useState<CsvParseResult | null>(null);
  const [fileName, setFileName] = useState('');

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = ev => {
      const raw = ev.target?.result as string;
      const parsed = parseCsv(raw);
      setResult(parsed);
      setStep('preview');
    };
    reader.readAsText(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  }

  function handleConfirm() {
    if (!result) return;
    onImport(result.valid);
    setStep('done');
  }

  function handleCancel() {
    setResult(null);
    setStep('idle');
    setFileName('');
  }

  function handleExport() {
    const csv = exportCsv(currentParticipants);
    downloadCsv(csv, 'fotw-participants.csv');
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <Upload className="w-4 h-4" />
          Import CSV
        </button>
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-2 bg-white border border-purple-200 hover:border-purple-400 text-purple-700 text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Current List
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Select CSV file"
        />
      </div>

      {/* Preview */}
      {step === 'preview' && result && (
        <div className="bg-white border border-purple-100 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-purple-900 text-sm">Preview — {fileName}</h3>
            <button type="button" onClick={handleCancel} className="text-purple-400 hover:text-purple-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Summary */}
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5" />
              {result.valid.length} valid rows
            </span>
            {result.errors.length > 0 && (
              <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5" />
                {result.errors.length} errors
              </span>
            )}
          </div>

          {/* Errors */}
          {result.errors.length > 0 && (
            <div className="max-h-40 overflow-y-auto space-y-1.5">
              {result.errors.map((err, i) => (
                <div key={i} className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                  <span className="font-semibold">Row {err.row} [{err.field}]:</span> {err.message}
                </div>
              ))}
            </div>
          )}

          {/* Valid preview table */}
          {result.valid.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-purple-100 max-h-48 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="bg-purple-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-purple-700">Name</th>
                    <th className="px-3 py-2 text-left text-purple-700">Year</th>
                    <th className="px-3 py-2 text-left text-purple-700">Phone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50">
                  {result.valid.map((p, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2">{p.firstName} {p.lastName}</td>
                      <td className="px-3 py-2">{p.year}</td>
                      <td className="px-3 py-2 font-mono">{p.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {result.valid.length === 0 && (
            <p className="text-sm text-red-600">No valid rows found. The existing list will not be changed.</p>
          )}

          {result.valid.length > 0 && (
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="text-sm text-purple-600 hover:text-purple-800 px-4 py-2 rounded-xl border border-purple-200 hover:border-purple-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors"
              >
                Confirm Import ({result.valid.length} participants)
              </button>
            </div>
          )}
        </div>
      )}

      {step === 'done' && (
        <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <CheckCircle className="w-4 h-4" />
          Import successful! The participant list has been updated.
          <button
            type="button"
            onClick={() => setStep('idle')}
            className="ml-auto text-emerald-600 hover:text-emerald-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
