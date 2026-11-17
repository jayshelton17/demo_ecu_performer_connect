import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { CharacterRole } from '../types.ts';
import { SPECIAL_SKILLS_CATALOG } from '../data/performerReferenceData.ts';
import { ArrowLeft, Plus, Trash2, ArrowDown, Check, Save, ShieldAlert, Sparkles } from 'lucide-react';

export const CreateCastingCall: React.FC = () => {
  const { setCurrentView, addCastingCall, currentUser, setSelectedCastingCallId, users, switchUserPersona } = useApp();

  const isDirectorOrFaculty = Boolean(
    currentUser.role.toLowerCase().includes('director') ||
    currentUser.isFaculty ||
    currentUser.isAdmin
  );

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [title, setTitle] = useState('');
  const [productionType, setProductionType] = useState<'Musical' | 'Play' | 'Short Film' | 'Student Showcase' | 'Senior Thesis'>('Play');
  const [producer, setProducer] = useState('ECU School of Theatre & Dance');
  const [writer, setWriter] = useState('');
  const [castingDirector, setCastingDirector] = useState(currentUser.name);
  const [shootDays, setShootDays] = useState('');
  const [rateOfPay, setRateOfPay] = useState('Academic Practicum Credit');
  const [location, setLocation] = useState('Messick Performing Arts Center');
  const [deadline, setDeadline] = useState('Dec 15, 2026');
  const [specialSkills, setSpecialSkills] = useState('');
  const [showSkillsRef, setShowSkillsRef] = useState(false);
  const [selectedRefCat, setSelectedRefCat] = useState(SPECIAL_SKILLS_CATALOG[0].id);
  const [storyline, setStoryline] = useState('');

  // Characters State
  const [characters, setCharacters] = useState<CharacterRole[]>([
    {
      id: 'char-new-1',
      name: '',
      synopsis: '',
      workflowStages: ['Application Review', 'Callback Audition', 'Final Cast Selection'],
    },
  ]);

  const handleAddCharacter = () => {
    setCharacters((prev) => [
      ...prev,
      {
        id: `char-new-${Date.now()}`,
        name: '',
        synopsis: '',
        workflowStages: ['Application Review', 'Callback Audition', 'Final Cast Selection'],
      },
    ]);
  };

  const handleRemoveCharacter = (idx: number) => {
    if (characters.length <= 1) return;
    setCharacters((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateCharName = (idx: number, name: string) => {
    setCharacters((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, name } : c))
    );
  };

  const handleUpdateCharSynopsis = (idx: number, synopsis: string) => {
    setCharacters((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, synopsis } : c))
    );
  };

  const handleAddStage = (charIdx: number) => {
    setCharacters((prev) =>
      prev.map((c, i) =>
        i === charIdx
          ? { ...c, workflowStages: [...c.workflowStages, 'Sides / Chemistry Audition'] }
          : c
      )
    );
  };

  const handleRemoveStage = (charIdx: number, stageIdx: number) => {
    setCharacters((prev) =>
      prev.map((c, i) => {
        if (i === charIdx) {
          if (c.workflowStages.length <= 1) return c;
          return {
            ...c,
            workflowStages: c.workflowStages.filter((_, s) => s !== stageIdx),
          };
        }
        return c;
      })
    );
  };

  const handleUpdateStageText = (charIdx: number, stageIdx: number, val: string) => {
    setCharacters((prev) =>
      prev.map((c, i) => {
        if (i === charIdx) {
          const updated = [...c.workflowStages];
          updated[stageIdx] = val;
          return { ...c, workflowStages: updated };
        }
        return c;
      })
    );
  };

  const handlePublish = (asDraft = false) => {
    if (!title.trim()) {
      alert('Please enter a production title');
      setStep(1);
      return;
    }

    const newId = addCastingCall({
      title: title.trim(),
      productionType,
      directorId: currentUser.id,
      directorName: currentUser.name,
      producer: producer || 'ECU School of Theatre & Dance',
      writer: writer || 'Undisclosed',
      castingDirector: castingDirector || currentUser.name,
      shootDays: shootDays || 'TBD Spring 2026',
      rateOfPay: rateOfPay || 'Academic Credit',
      location: location || 'Messick Theatre',
      deadline: deadline || 'Dec 15, 2026',
      specialSkills,
      storyline: storyline || 'Original production staging at East Carolina University.',
      status: asDraft ? 'Draft' : 'Open',
      characters: characters.map((c, i) => ({
        ...c,
        id: `char-${Date.now()}-${i}`,
        name: c.name || `Role #${i + 1}`,
        synopsis: c.synopsis || 'Character details provided in audition room sides.',
        applicantsCount: 0,
      })),
    });

    setSelectedCastingCallId(newId);
    setCurrentView('casting-call-details');
  };

  if (!isDirectorOrFaculty) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center border border-amber-200 dark:border-amber-900/40 shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Director & Faculty Access Only
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Performers cannot publish casting calls on ECU Performer Connect. Casting calls are reserved exclusively for authorized student directors and ECU faculty.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 text-xs text-slate-700 dark:text-slate-300 max-w-md mx-auto text-left space-y-1">
          <span className="font-bold text-[var(--ecu-purple,#4C1D95)] dark:text-[#FEC524] block">What you can do as a Performer:</span>
          <p>• Explore open auditions and mainstage callbacks across campus</p>
          <p>• Submit self-tapes and performance reels to active productions</p>
          <p>• Track your callback statuses in My Applications</p>
        </div>

        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setCurrentView('casting-calls')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[var(--ecu-purple,#4C1D95)] text-white font-bold text-xs hover:opacity-90 shadow-md"
          >
            Browse Active Casting Calls
          </button>
          <button
            onClick={() => {
              const director = users.find((u) => u.role.toLowerCase().includes('director') || u.isFaculty);
              if (director) switchUserPersona(director.id);
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Switch to Director Persona
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold font-display text-slate-900 dark:text-white">
          Create Casting Call
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Post an official audition notice for ECU theatre, dance, or film productions
        </p>
      </div>

      {/* Stepper matching wireframes: Details ------- Characters ------- Review */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 py-4 px-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold shadow-xs">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#4C1D95] dark:text-[#FEC524]' : 'text-slate-400'}`}>
          <span className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-[#4C1D95] dark:bg-[#FEC524]' : 'bg-slate-300'}`} />
          <span>Details</span>
        </div>

        <div className={`w-8 sm:w-16 h-0.5 ${step >= 2 ? 'bg-[#4C1D95] dark:bg-[#FEC524]' : 'bg-slate-200 dark:bg-slate-800'}`} />

        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#4C1D95] dark:text-[#FEC524]' : 'text-slate-400'}`}>
          <span className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-[#4C1D95] dark:bg-[#FEC524]' : 'bg-slate-300'}`} />
          <span>Characters</span>
        </div>

        <div className={`w-8 sm:w-16 h-0.5 ${step >= 3 ? 'bg-[#4C1D95] dark:bg-[#FEC524]' : 'bg-slate-200 dark:bg-slate-800'}`} />

        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-[#4C1D95] dark:text-[#FEC524]' : 'text-slate-400'}`}>
          <span className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-[#4C1D95] dark:bg-[#FEC524]' : 'bg-slate-300'}`} />
          <span>Review</span>
        </div>
      </div>

      {/* STEP 1: Details (Create_Casting_Call__Details__abfecb54.png) */}
      {step === 1 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="font-semibold block mb-1">Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A Midsummer Night’s Dream"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#FEC524]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Production Type:</label>
                <select
                  value={productionType}
                  onChange={(e) => setProductionType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="Play">Play</option>
                  <option value="Musical">Musical</option>
                  <option value="Short Film">Short Film</option>
                  <option value="Student Showcase">Student Showcase</option>
                  <option value="Senior Thesis">Senior Thesis</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Producer:</label>
                <input
                  type="text"
                  value={producer}
                  onChange={(e) => setProducer(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Writer / Playwright:</label>
                <input
                  type="text"
                  placeholder="e.g. William Shakespeare"
                  value={writer}
                  onChange={(e) => setWriter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Casting Director:</label>
                <input
                  type="text"
                  value={castingDirector}
                  onChange={(e) => setCastingDirector(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="font-semibold block mb-1">Shoot Day(s) / Rehearsals:</label>
                <input
                  type="text"
                  placeholder="e.g. Feb 10 - March 15, Evenings"
                  value={shootDays}
                  onChange={(e) => setShootDays(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Rate of Pay / Credit:</label>
                <input
                  type="text"
                  value={rateOfPay}
                  onChange={(e) => setRateOfPay(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Location:</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Audition Deadline:</label>
                <input
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-amber-600 dark:text-amber-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold">Special Skills Needed:</label>
                  <button
                    type="button"
                    onClick={() => setShowSkillsRef(!showSkillsRef)}
                    className="text-[11px] font-bold text-[var(--ecu-purple,#4C1D95)] dark:text-[#FEC524] hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{showSkillsRef ? 'Hide Reference List' : 'Pick from Reference List'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Shakespeare / Heightened Language, Stage Combat, British RP..."
                  value={specialSkills}
                  onChange={(e) => setSpecialSkills(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
                {showSkillsRef && (
                  <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
                    <div className="flex gap-1 overflow-x-auto pb-1">
                      {SPECIAL_SKILLS_CATALOG.map((cat) => (
                        <button
                          type="button"
                          key={cat.id}
                          onClick={() => setSelectedRefCat(cat.id)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap ${
                            selectedRefCat === cat.id
                              ? 'bg-[var(--ecu-purple,#4C1D95)] text-white'
                              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {cat.number}. {cat.shortTitle}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                      {(() => {
                        const cat = SPECIAL_SKILLS_CATALOG.find((c) => c.id === selectedRefCat);
                        const items = [
                          ...(cat?.skills || []),
                          ...(cat?.subgroups?.flatMap((s) => s.items) || []),
                        ];
                        return items.map((sk) => (
                          <button
                            type="button"
                            key={sk}
                            onClick={() => {
                              const current = specialSkills
                                .split(',')
                                .map((s) => s.trim())
                                .filter(Boolean);
                              if (!current.includes(sk)) {
                                setSpecialSkills([...current, sk].join(', '));
                              }
                            }}
                            className="px-2 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-[#4C1D95] text-[10px] font-medium"
                          >
                            + {sk}
                          </button>
                        ));
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="font-semibold text-xs block mb-1">Storyline:</label>
            <textarea
              rows={4}
              placeholder="Provide a comprehensive summary of the show or film concept..."
              value={storyline}
              onChange={(e) => setStoryline(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentView('casting-calls')}
              className="px-5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!title.trim()) {
                  alert('Please enter a production title before proceeding.');
                  return;
                }
                setStep(2);
              }}
              className="px-6 py-2 rounded-xl bg-[#4C1D95] text-white hover:bg-[#3B0764] text-xs font-bold shadow-md"
            >
              Next: Characters →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Characters (Create_Casting_Call__Characters__4f0707da.png) */}
      {step === 2 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">
              Characters & Audition Workflow
            </h2>
            <button
              onClick={handleAddCharacter}
              className="px-3 py-1.5 rounded-lg bg-[#4C1D95] text-white text-xs font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 text-[#FEC524]" />
              Add Character
            </button>
          </div>

          <div className="space-y-6">
            {characters.map((char, charIdx) => (
              <div
                key={char.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    Character #{charIdx + 1}
                  </span>
                  {characters.length > 1 && (
                    <button
                      onClick={() => handleRemoveCharacter(charIdx)}
                      className="text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  )}
                </div>

                <div>
                  <label className="font-semibold block mb-1">Character Name:</label>
                  <input
                    type="text"
                    placeholder="e.g. Mercutio"
                    value={char.name}
                    onChange={(e) => handleUpdateCharName(charIdx, e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Character Synopsis:</label>
                  <textarea
                    rows={2}
                    placeholder="Age range, vocal/movement requirements, dramatic arc..."
                    value={char.synopsis}
                    onChange={(e) => handleUpdateCharSynopsis(charIdx, e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                {/* Dynamic Casting Workflow as shown in wireframe */}
                <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-slate-700/80">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">
                    Casting Workflow Pipeline
                  </span>

                  <div className="space-y-2 pl-2">
                    {char.workflowStages.map((stage, stageIdx) => (
                      <React.Fragment key={stageIdx}>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-400 w-5">{stageIdx + 1}.</span>
                          <input
                            type="text"
                            value={stage}
                            onChange={(e) => handleUpdateStageText(charIdx, stageIdx, e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                          />
                          {char.workflowStages.length > 1 && (
                            <button
                              onClick={() => handleRemoveStage(charIdx, stageIdx)}
                              className="text-slate-400 hover:text-red-500 text-[11px] px-2 py-1"
                            >
                              - Remove
                            </button>
                          )}
                        </div>
                        {stageIdx < char.workflowStages.length - 1 && (
                          <div className="pl-6 text-slate-400">
                            <ArrowDown className="w-3.5 h-3.5 text-[#4C1D95] dark:text-[#FEC524]" />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <button
                    onClick={() => handleAddStage(charIdx)}
                    className="mt-2 text-xs font-bold text-[#4C1D95] dark:text-[#FEC524] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    + Add Audition Stage
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              ← Back to Details
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2 rounded-xl bg-[#4C1D95] text-white hover:bg-[#3B0764] text-xs font-bold shadow-md"
            >
              Next: Review Notice →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Review (Create_Casting_Call__Review__83db16ca.png) */}
      {step === 3 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">
              Review Casting Notice
            </h2>
            <button
              onClick={() => setStep(1)}
              className="text-xs text-[#4C1D95] dark:text-[#FEC524] font-bold hover:underline"
            >
              Edit Details
            </button>
          </div>

          {/* Details Summary matching wireframe */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold text-slate-500 block">Title:</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">{title || 'Untitled'}</span>
            </div>
            <div>
              <span className="font-bold text-slate-500 block">Production Type:</span>
              <span className="font-semibold text-[#4C1D95] dark:text-[#FEC524]">{productionType}</span>
            </div>
            <div>
              <span className="font-bold text-slate-500 block">Producer:</span>
              <span>{producer}</span>
            </div>
            <div>
              <span className="font-bold text-slate-500 block">Rate of Pay:</span>
              <span>{rateOfPay}</span>
            </div>
            <div>
              <span className="font-bold text-slate-500 block">Writer:</span>
              <span>{writer || 'Not specified'}</span>
            </div>
            <div>
              <span className="font-bold text-slate-500 block">Location:</span>
              <span>{location}</span>
            </div>
            <div>
              <span className="font-bold text-slate-500 block">Casting Director:</span>
              <span>{castingDirector}</span>
            </div>
            <div>
              <span className="font-bold text-slate-500 block">Audition Deadline:</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{deadline}</span>
            </div>
          </div>

          <div>
            <span className="font-bold text-slate-500 text-xs block mb-1">Storyline:</span>
            <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
              {storyline || 'No storyline provided.'}
            </p>
          </div>

          {/* Characters Review */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Characters & Workflow
            </h3>
            {characters.map((c, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {c.name || `Character #${i + 1}`}
                  </span>
                  <button onClick={() => setStep(2)} className="text-[#4C1D95] dark:text-[#FEC524] font-semibold">
                    Edit
                  </button>
                </div>
                <p className="text-slate-600 dark:text-slate-400">{c.synopsis || 'No synopsis'}</p>
                <div className="text-[11px] text-slate-500 pt-1">
                  Workflow: {c.workflowStages.join(' → ')}
                </div>
              </div>
            ))}
          </div>

          {/* Actions matching wireframe: Back, Cancel, Save Draft, Publish */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              ← Back
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('casting-calls')}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePublish(true)}
                className="px-4 py-2 rounded-xl border border-[#4C1D95] text-[#4C1D95] dark:border-[#FEC524] dark:text-[#FEC524] text-xs font-bold hover:bg-purple-50 dark:hover:bg-purple-950/40 flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                Save Draft
              </button>
              <button
                onClick={() => handlePublish(false)}
                className="px-6 py-2 rounded-xl bg-[#4C1D95] text-white hover:bg-[#3B0764] text-xs font-bold shadow-lg flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-[#FEC524]" />
                Publish Casting Call
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
