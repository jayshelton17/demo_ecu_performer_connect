import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { CastingCall, CharacterRole } from '../types.ts';
import { X, Send, Film, FileText, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  castingCall: CastingCall;
  character: CharacterRole;
}

export const ApplyModal: React.FC<Props> = ({
  isOpen,
  onClose,
  castingCall,
  character,
}) => {
  const { currentUser, applyToCastingCall } = useApp();
  const [tapeUrl, setTapeUrl] = useState(currentUser.media.videos[0]?.url || '');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyToCastingCall(castingCall.id, character.id, notes, tapeUrl);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--ecu-purple,#4C1D95)] dark:text-[#FEC524]">
              {castingCall.productionType} Audition Application
            </span>
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white leading-tight">
              Apply for {character.name}
            </h3>
            <p className="text-xs text-slate-500">{castingCall.title} · Directed by {castingCall.directorName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Audition Submission Sent!</h4>
            <p className="text-xs text-slate-500">
              The casting team has received your submission. Check "My Applications" for callback notifications.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Applicant Summary */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border border-[#4C1D95]"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <span className="font-bold text-slate-900 dark:text-white block">{currentUser.name}</span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400">
                  {currentUser.role} · {currentUser.characteristics.vocalRange || 'Vocalist / Actor'}
                </span>
              </div>
            </div>

            {/* Character Synopsis */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Role Breakdown</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{character.synopsis}</p>
            </div>

            {/* Video / Reel link */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-[var(--ecu-purple,#4C1D95)] dark:text-[#FEC524]" />
                Audition Self-Tape / Reel URL
              </label>
              <input
                type="url"
                required
                placeholder="https://youtube.com/... or Vimeo link"
                value={tapeUrl}
                onChange={(e) => setTapeUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#FEC524]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Defaulted to your profile vocal/acting reel, or paste a new unlisted tape link.
              </span>
            </div>

            {/* Director's Note */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                Director & Casting Note / Audition Material Prepared
              </label>
              <textarea
                rows={3}
                placeholder="Mention what song cuttings, classical sides, or dialect work you prepared, as well as your rehearsal availability..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#FEC524]"
              />
            </div>

            {/* Submission Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[var(--ecu-purple,#4C1D95)] text-white hover:opacity-90 font-bold shadow flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-[#FEC524]" />
                Submit Application
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
