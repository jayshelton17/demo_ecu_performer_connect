import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ArrowLeft, Save, CheckCircle, ExternalLink, User } from 'lucide-react';

export const ApplicantReview: React.FC = () => {
  const {
    selectedCastingCallId,
    castingCalls,
    applications,
    updateApplicationDecision,
    updateApplicationStage,
    setCurrentView,
    setSelectedUserId,
    showNotification,
  } = useApp();

  const call = castingCalls.find((c) => c.id === selectedCastingCallId) || castingCalls[0];

  const [selectedCharacterId, setSelectedCharacterId] = useState<string>(
    call.characters[0]?.id || ''
  );
  const [currentWorkflowStep, setCurrentWorkflowStep] = useState<number>(0);

  const selectedChar = call.characters.find((c) => c.id === selectedCharacterId) || call.characters[0];

  const stages = selectedChar?.workflowStages?.length
    ? selectedChar.workflowStages
    : ['Application', 'Callback', 'Final Audition'];

  // Applications matching this production and character
  const charApplications = applications.filter(
    (a) => a.productionId === call.id && (!selectedCharacterId || a.characterId === selectedCharacterId)
  );

  const handleDecisionChange = (appId: string, decision: any) => {
    updateApplicationDecision(appId, decision);
  };

  const handleAdvanceStage = () => {
    if (currentWorkflowStep < stages.length - 1) {
      setCurrentWorkflowStep((prev) => prev + 1);
      showNotification(`Advanced casting room to: ${stages[currentWorkflowStep + 1]}`);
    } else {
      showNotification('Final casting decisions locked!');
    }
  };

  const handlePreviousStage = () => {
    if (currentWorkflowStep > 0) {
      setCurrentWorkflowStep((prev) => prev - 1);
      showNotification(`Returned casting room to: ${stages[currentWorkflowStep - 1]}`);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Top Header matching Applicant_Review_c3aa515e.png */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentView('casting-call-details')}
          className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            Applicant Review
          </h1>
          <p className="text-sm font-semibold text-[#4C1D95] dark:text-[#FEC524]">
            {call.title} ({call.productionType})
          </p>
        </div>
      </div>

      {/* Main Review Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        {/* Character filter selector matching wireframe: Character: [ ] */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs">
          <label className="font-bold text-slate-700 dark:text-slate-300">Character:</label>
          <select
            value={selectedCharacterId}
            onChange={(e) => setSelectedCharacterId(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
          >
            {call.characters.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {ch.name}
              </option>
            ))}
          </select>
        </div>

        {/* Casting Workflow Stepper matching wireframe */}
        {/* Casting Workflow: ● Application ────── ○ Callback ────── ○ Final Audition */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Casting Workflow
          </span>

          <div className="flex items-center justify-between max-w-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 py-1">
            {stages.map((st, idx) => {
              const isCurrent = idx === currentWorkflowStep;
              const isPassed = idx < currentWorkflowStep;

              return (
                <React.Fragment key={idx}>
                  <div className="flex items-center gap-1.5">
                    {isPassed ? (
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
                          : isPassed
                          ? 'text-slate-900 dark:text-slate-200'
                          : 'text-slate-400'
                      }
                    >
                      {st}
                    </span>
                  </div>

                  {idx < stages.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-3 sm:mx-4 ${
                        idx < currentWorkflowStep
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

        {/* Review Table matching wireframe columns: Applicant | Submission | Decision */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold bg-slate-50/60 dark:bg-slate-800/40">
                <th className="py-3 px-4 rounded-l-xl">Applicant</th>
                <th className="py-3 px-4">Submission</th>
                <th className="py-3 px-4 rounded-r-xl">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {charApplications.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-400 italic">
                    No auditions submitted for this role yet.
                  </td>
                </tr>
              ) : (
                charApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    {/* Applicant Column */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={app.applicantAvatar}
                          alt={app.applicantName}
                          className="w-10 h-10 rounded-full object-cover border border-[#4C1D95]"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <button
                            onClick={() => {
                              setSelectedUserId(app.applicantId);
                              setCurrentView('profile');
                            }}
                            className="font-bold text-slate-900 dark:text-white hover:text-[#4C1D95] dark:hover:text-[#FEC524] text-sm text-left block"
                          >
                            {app.applicantName}
                          </button>
                          <span className="text-[11px] text-slate-500">
                            Applied: {app.appliedDate}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Submission Column */}
                    <td className="py-4 px-4 space-y-1">
                      <p className="text-slate-700 dark:text-slate-300 font-medium line-clamp-2">
                        {app.submissionDetails?.note || 'Audition materials and resume submitted.'}
                      </p>
                      {app.submissionDetails?.tapeUrl && (
                        <a
                          href={app.submissionDetails.tapeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#4C1D95] dark:text-[#FEC524] font-semibold hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Audition Tape / Reel
                        </a>
                      )}
                    </td>

                    {/* Decision Column */}
                    <td className="py-4 px-4">
                      <select
                        value={app.decision || 'Pending'}
                        onChange={(e) => handleDecisionChange(app.id, e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-[#FEC524]"
                      >
                        <option value="Pending">Pending Review</option>
                        <option value="Advance">Advance to Callback</option>
                        <option value="Shortlist">Shortlist Contender</option>
                        <option value="Cast">Offer Role (Cast)</option>
                        <option value="Reject">Release / Not Cast</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Actions matching wireframe: Return to Previous Stage, Save Decisions, Finalize Stage */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handlePreviousStage}
            disabled={currentWorkflowStep === 0}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Return to Previous Stage
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => showNotification('All casting decisions successfully saved')}
              className="px-4 py-2 rounded-xl border border-[#4C1D95] text-[#4C1D95] dark:border-[#FEC524] dark:text-[#FEC524] text-xs font-bold hover:bg-purple-50 dark:hover:bg-purple-950/40 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              Save Decisions
            </button>

            <button
              onClick={handleAdvanceStage}
              className="px-6 py-2 rounded-xl bg-[#4C1D95] text-white hover:bg-[#3B0764] text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5 text-[#FEC524]" />
              Finalize Stage ({stages[currentWorkflowStep]})
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
