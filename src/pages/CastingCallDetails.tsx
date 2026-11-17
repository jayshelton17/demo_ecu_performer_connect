import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { CharacterRole } from '../types.ts';
import { ArrowLeft, Calendar, MapPin, DollarSign, Clock, Users, Sparkles, Send } from 'lucide-react';
import { ApplyModal } from '../components/ApplyModal.tsx';

export const CastingCallDetails: React.FC = () => {
  const {
    selectedCastingCallId,
    castingCalls,
    setCurrentView,
    currentUser,
    applications,
  } = useApp();

  const call = castingCalls.find((c) => c.id === selectedCastingCallId) || castingCalls[0];
  const [selectedCharacterToApply, setSelectedCharacterToApply] = useState<CharacterRole | null>(null);

  const isDirectorOfProduction =
    call.directorId === currentUser.id || call.directorName.toLowerCase() === currentUser.name.toLowerCase();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Back button & Title matching wireframe Casting_Call_Details_eeb040d0.png */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('casting-calls')}
            className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
            title="Back to Casting Calls"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
              {call.title}
            </h1>
            <p className="text-xs text-slate-500">Posted: {call.postedDate}</p>
          </div>
        </div>

        {/* If director, quick shortcut to review applicants */}
        {isDirectorOfProduction && (
          <button
            onClick={() => setCurrentView('applicant-review')}
            className="px-4 py-2 rounded-xl bg-[#4C1D95] text-white hover:bg-[#3B0764] text-xs font-bold transition-all shadow flex items-center gap-1.5"
          >
            <Users className="w-4 h-4 text-[#FEC524]" />
            <span>Open Casting Review Room</span>
          </button>
        )}
      </div>

      {/* Production Metadata Two Columns matching wireframe */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs border-b border-slate-100 dark:border-slate-800 pb-6">
          
          {/* Column 1 */}
          <div className="space-y-3">
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Production Type:</span>
              <span className="text-sm font-semibold text-[#4C1D95] dark:text-[#FEC524]">{call.productionType}</span>
            </div>

            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Audition Deadline:</span>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{call.deadline}</span>
            </div>

            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Special Requirements:</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{call.specialSkills || 'None listed'}</p>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Director:</span>
              <span className="text-sm text-slate-900 dark:text-white font-medium">{call.directorName}</span>
            </div>

            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Producer:</span>
              <span className="text-slate-600 dark:text-slate-400">{call.producer}</span>
            </div>

            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Shoot Day(s) & Rehearsals:</span>
              <span className="text-slate-600 dark:text-slate-400">{call.shootDays}</span>
            </div>

            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Rate of Pay:</span>
              <span className="text-slate-600 dark:text-slate-400">{call.rateOfPay}</span>
            </div>

            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Audition & Rehearsal Location:</span>
              <span className="text-slate-600 dark:text-slate-400">{call.location}</span>
            </div>
          </div>

        </div>

        {/* Characters Breakdown with [Apply] button directly matching wireframe */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">
              Character Breakdowns ({call.characters.length} Roles)
            </h2>
          </div>

          <div className="space-y-3">
            {call.characters.map((char) => {
              const alreadyApplied = applications.some(
                (a) => a.productionId === call.id && a.characterId === char.id && a.applicantId === currentUser.id
              );

              return (
                <div
                  key={char.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {char.name}
                      </h3>
                      {char.applicantsCount !== undefined && char.applicantsCount > 0 && (
                        <span className="text-[10px] text-slate-500">
                          ({char.applicantsCount} auditioned)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {char.synopsis}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
                      <span>Workflow:</span>
                      <span className="font-semibold text-[#4C1D95] dark:text-[#FEC524]">
                        {char.workflowStages.join(' → ')}
                      </span>
                    </div>
                  </div>

                  {/* Wireframe Apply Button */}
                  <div className="shrink-0 w-full sm:w-auto">
                    {alreadyApplied ? (
                      <button
                        disabled
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold opacity-90 cursor-default"
                      >
                        ✓ Applied
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedCharacterToApply(char)}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#4C1D95] text-white hover:bg-[#3B0764] text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5 text-[#FEC524]" />
                        <span>Apply</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Storyline Section matching wireframe */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Production Storyline
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {call.storyline}
          </p>
        </div>

      </div>

      {/* Audition Application Modal */}
      {selectedCharacterToApply && (
        <ApplyModal
          isOpen={true}
          onClose={() => setSelectedCharacterToApply(null)}
          castingCall={call}
          character={selectedCharacterToApply}
        />
      )}

    </div>
  );
};
