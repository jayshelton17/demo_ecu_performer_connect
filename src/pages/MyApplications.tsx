import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Application } from '../types.ts';
import { Check, Clock, AlertCircle, Send, X, ExternalLink, Calendar } from 'lucide-react';

export const MyApplications: React.FC = () => {
  const { applications, currentUser, updateApplicationStage, showNotification } = useApp();

  const [statusFilter, setStatusFilter] = useState('All');
  const [activeActionModalApp, setActiveActionModalApp] = useState<Application | null>(null);
  const [callbackTapeUrl, setCallbackTapeUrl] = useState('');
  const [callbackNotes, setCallbackNotes] = useState('');

  // Filter for this user's applications
  const userApplications = applications.filter((a) => a.applicantId === currentUser.id);

  const filteredApplications = userApplications.filter((app) => {
    if (statusFilter === 'All') return true;
    return app.status === statusFilter;
  });

  const handleCompleteCallbackAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeActionModalApp) return;

    // Advance stage to final audition
    updateApplicationStage(activeActionModalApp.id, 2, 'Under Review');
    showNotification(`Callback material submitted for ${activeActionModalApp.productionName}!`);
    setActiveActionModalApp(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Title & Status Dropdown directly matching My_Applications_843c69d9.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            My Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track your audition submissions, callback schedules, and casting status
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <label className="font-bold text-slate-700 dark:text-slate-300">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
          >
            <option value="All">All Applications</option>
            <option value="Callback Required">Action Required</option>
            <option value="Under Review">Under Review</option>
            <option value="Offered">Role Offered</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-6">
        {filteredApplications.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs space-y-2">
            <p>No applications found under "{statusFilter}".</p>
            <p>Browse open auditions under "Casting Calls" to submit for roles!</p>
          </div>
        ) : (
          filteredApplications.map((app) => (
            <div
              key={app.id}
              className="p-6 sm:p-7 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
            >
              {/* Header: Production Name, Role, and Action Required badge */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                    {app.productionName}
                  </h2>
                  <p className="text-sm font-semibold text-[#4C1D95] dark:text-[#FEC524]">
                    ({app.characterName})
                  </p>
                </div>

                {app.actionRequired ? (
                  <div className="text-right shrink-0">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-xs animate-pulse">
                      ACTION REQUIRED
                    </span>
                    <button
                      onClick={() => setActiveActionModalApp(app)}
                      className="mt-2 block px-4 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-[#4C1D95] text-xs font-bold transition-all shadow-md"
                    >
                      View & Complete
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {app.status}
                  </span>
                )}
              </div>

              {/* Current Stage Stepper matching wireframe line design */}
              {/* ✓ Application ────── ● Callback ────── ○ Final Audition */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Current Stage
                </span>

                <div className="flex items-center justify-between max-w-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {app.stages.map((stageName, idx) => {
                    const isDone = idx < app.currentStageIndex;
                    const isCurrent = idx === app.currentStageIndex;

                    return (
                      <React.Fragment key={idx}>
                        <div className="flex items-center gap-1.5">
                          {isDone ? (
                            <span className="text-emerald-500 font-bold">✓</span>
                          ) : isCurrent ? (
                            <span className="text-[#4C1D95] dark:text-[#FEC524] text-base">●</span>
                          ) : (
                            <span className="text-slate-400">○</span>
                          )}
                          <span
                            className={
                              isCurrent
                                ? 'font-bold text-[#4C1D95] dark:text-[#FEC524]'
                                : isDone
                                ? 'text-slate-900 dark:text-slate-200'
                                : 'text-slate-400'
                            }
                          >
                            {stageName}
                          </span>
                        </div>

                        {idx < app.stages.length - 1 && (
                          <div
                            className={`flex-1 h-0.5 mx-2 sm:mx-4 ${
                              idx < app.currentStageIndex
                                ? 'bg-emerald-500'
                                : 'bg-slate-200 dark:bg-slate-700'
                            }`}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Instructions and Due Date matching wireframe */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800/80 text-xs space-y-1.5">
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  ({app.stages[app.currentStageIndex] || 'Application'})
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {app.stageInstructions || 'Your application is currently being reviewed.'}
                </p>
                {app.stageDeadline && (
                  <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 pt-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Due: {app.stageDeadline}
                  </div>
                )}
              </div>

            </div>
          ))
        )}
      </div>

      {/* Action Required Modal (View & Complete) */}
      {activeActionModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 text-xs text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-amber-500">
                  Callback Audition Requirements
                </span>
                <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                  {activeActionModalApp.productionName}
                </h3>
              </div>
              <button
                onClick={() => setActiveActionModalApp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-1">
              <span className="font-bold text-amber-900 dark:text-amber-200">Director's Instructions:</span>
              <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                {activeActionModalApp.stageInstructions}
              </p>
              <p className="font-bold text-amber-900 dark:text-amber-200 text-[11px] pt-1">
                Due: {activeActionModalApp.stageDeadline}
              </p>
            </div>

            <form onSubmit={handleCompleteCallbackAction} className="space-y-4">
              <div>
                <label className="font-semibold block mb-1">
                  Upload Callback Self-Tape / Reel URL:
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://youtube.com/watch?v=... or Vimeo link"
                  value={callbackTapeUrl}
                  onChange={(e) => setCallbackTapeUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">
                  Note to Director / Rehearsal Conflict Confirmations:
                </label>
                <textarea
                  rows={3}
                  placeholder="Confirm measures prepared, off-book state, and availability for in-person callback..."
                  value={callbackNotes}
                  onChange={(e) => setCallbackNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveActionModalApp(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 font-semibold"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#4C1D95] text-white hover:bg-[#3B0764] font-bold shadow flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-[#FEC524]" />
                  Submit Callback Tape
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
