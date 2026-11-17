import React, { useState } from 'react';
import {
  UserProfile,
  LanguageDialectEntry,
  LanguageProficiencyLevel,
} from '../types.ts';
import {
  HEIGHT_OPTIONS,
  HAIR_COLOR_OPTIONS,
  EYE_COLOR_OPTIONS,
  GENDER_OPTIONS,
  RACE_ETHNICITY_OPTIONS,
  VOCAL_RANGE_OPTIONS,
  UNION_STATUS_OPTIONS,
  TATTOO_OPTIONS,
  PIERCING_OPTIONS,
  NUDITY_COMFORT_OPTIONS,
  LANGUAGE_PROFICIENCY_LEVELS,
  REFERENCE_LANGUAGES,
  REFERENCE_DIALECTS,
  SPECIAL_SKILLS_CATALOG,
} from '../data/performerReferenceData.ts';
import {
  X,
  Check,
  Plus,
  Trash2,
  Search,
  UserCheck,
  Languages,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  initialSection?: 'characteristics' | 'body-mod' | 'languages' | 'skills';
  user: UserProfile;
  onClose: () => void;
  onSave: (updates: Partial<UserProfile>) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  initialSection = 'characteristics',
  user,
  onClose,
  onSave,
}) => {
  const [activeSection, setActiveSection] = useState<'characteristics' | 'body-mod' | 'languages' | 'skills'>(
    initialSection
  );

  // Characteristics state
  const [height, setHeight] = useState(user.characteristics.height || `5' 6"`);
  const [hairColor, setHairColor] = useState(user.characteristics.hairColor || 'Brown');
  const [eyeColor, setEyeColor] = useState(user.characteristics.eyeColor || 'Brown');

  const isPresetGender = GENDER_OPTIONS.includes((user.characteristics.gender || '') as any);
  const [genderSelect, setGenderSelect] = useState(
    isPresetGender ? (user.characteristics.gender || 'Prefer Not to Say') : (user.characteristics.gender ? 'Self-Describe' : 'Prefer Not to Say')
  );
  const [genderCustom, setGenderCustom] = useState(
    !isPresetGender ? (user.characteristics.gender || '') : ''
  );

  const isPresetRace = RACE_ETHNICITY_OPTIONS.includes((user.characteristics.raceEthnicity || '') as any);
  const [raceSelect, setRaceSelect] = useState(
    isPresetRace ? (user.characteristics.raceEthnicity || 'Prefer Not to Say') : (user.characteristics.raceEthnicity ? 'Self-Describe' : 'Prefer Not to Say')
  );
  const [raceCustom, setRaceCustom] = useState(
    !isPresetRace ? (user.characteristics.raceEthnicity || '') : ''
  );

  const [vocalRange, setVocalRange] = useState(user.characteristics.vocalRange || '');
  const [ageRange, setAgeRange] = useState(user.characteristics.ageRange || '18 - 25');
  const [unionStatus, setUnionStatus] = useState(user.characteristics.unionStatus || 'Non-Union');

  // Body Modifications & Nudity
  const [tattoos, setTattoos] = useState(user.characteristics.bodyModifications?.tattoos || 'None');
  const [piercings, setPiercings] = useState(user.characteristics.bodyModifications?.piercings || 'None');
  const [bodyModNotes, setBodyModNotes] = useState(user.characteristics.bodyModifications?.notes || '');
  const [nudityComfort, setNudityComfort] = useState(
    user.characteristics.nudityComfort || 'No Nudity (Fully Clothed Roles Only)'
  );
  const [intimacyNotes, setIntimacyNotes] = useState(user.characteristics.intimacyNotes || '');

  // Languages & Dialects
  const [languagesAndDialects, setLanguagesAndDialects] = useState<LanguageDialectEntry[]>(
    user.languagesAndDialects || []
  );
  const [newLangName, setNewLangName] = useState<string>('Spanish');
  const [customLangText, setCustomLangText] = useState('');
  const [newLangProficiency, setNewLangProficiency] = useState<LanguageProficiencyLevel>('Conversational Proficiency');
  const [newLangNotes, setNewLangNotes] = useState('');

  // Special Skills Catalog State
  const [selectedSkills, setSelectedSkills] = useState<string[]>(user.specialSkills || []);
  const [activeCategoryId, setActiveCategoryId] = useState<string>(SPECIAL_SKILLS_CATALOG[0].id);
  const [skillSearch, setSkillSearch] = useState('');
  const [customSkillInput, setCustomSkillInput] = useState('');

  if (!isOpen) return null;

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleAddCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;
    if (!selectedSkills.includes(trimmed)) {
      setSelectedSkills((prev) => [...prev, trimmed]);
    }
    setCustomSkillInput('');
  };

  const handleAddLanguageEntry = () => {
    const resolvedName =
      newLangName === 'Other Language'
        ? customLangText.trim() || 'Other Language'
        : newLangName;
    if (!resolvedName) return;

    const entry: LanguageDialectEntry = {
      id: `ld-${Date.now()}`,
      name: resolvedName,
      proficiency: newLangProficiency,
      notes: newLangNotes.trim() || undefined,
    };
    setLanguagesAndDialects((prev) => [...prev, entry]);
    setCustomLangText('');
    setNewLangNotes('');
  };

  const handleRemoveLanguageEntry = (id: string) => {
    setLanguagesAndDialects((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateLanguageProficiency = (id: string, proficiency: LanguageProficiencyLevel) => {
    setLanguagesAndDialects((prev) =>
      prev.map((item) => (item.id === id ? { ...item, proficiency } : item))
    );
  };

  const handleSaveAll = () => {
    const finalGender =
      genderSelect === 'Self-Describe' ? genderCustom.trim() || 'Self-Described' : genderSelect;
    const finalRace =
      raceSelect === 'Self-Describe' ? raceCustom.trim() || 'Self-Described' : raceSelect;

    onSave({
      characteristics: {
        ...user.characteristics,
        height,
        hairColor,
        eyeColor,
        gender: finalGender,
        raceEthnicity: finalRace,
        vocalRange,
        ageRange,
        unionStatus,
        bodyModifications: {
          tattoos,
          piercings,
          notes: bodyModNotes.trim() || undefined,
        },
        nudityComfort,
        intimacyNotes: intimacyNotes.trim() || undefined,
      },
      languagesAndDialects,
      specialSkills: selectedSkills,
    });
    onClose();
  };

  const activeCategory =
    SPECIAL_SKILLS_CATALOG.find((c) => c.id === activeCategoryId) || SPECIAL_SKILLS_CATALOG[0];

  const normalizedSearch = skillSearch.trim().toLowerCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
      <div className="w-full max-w-4xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[var(--ecu-purple,#4C1D95)] to-[#2E1065] text-white flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FEC524]" />
              <span>Edit Performer Profile & Special Skills</span>
            </h2>
            <p className="text-[11px] text-purple-200 mt-0.5">
              Update height, characteristics, body modifications & nudity comfort, languages, and reference skills
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="px-4 sm:px-6 pt-3 pb-2 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveSection('characteristics')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeSection === 'characteristics'
                ? 'bg-[var(--ecu-purple,#4C1D95)] text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-purple-400'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#FEC524]" />
            <span>Characteristics & Identity</span>
          </button>

          <button
            onClick={() => setActiveSection('body-mod')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeSection === 'body-mod'
                ? 'bg-[var(--ecu-purple,#4C1D95)] text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-purple-400'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#FEC524]" />
            <span>Body Mods & Nudity</span>
          </button>

          <button
            onClick={() => setActiveSection('languages')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeSection === 'languages'
                ? 'bg-[var(--ecu-purple,#4C1D95)] text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-purple-400'
            }`}
          >
            <Languages className="w-3.5 h-3.5 text-[#FEC524]" />
            <span>Languages & Dialects ({languagesAndDialects.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('skills')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeSection === 'skills'
                ? 'bg-[var(--ecu-purple,#4C1D95)] text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-purple-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FEC524]" />
            <span>Special Skills Reference ({selectedSkills.length})</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs">
          
          {/* TAB 1: Characteristics & Dropdowns */}
          {activeSection === 'characteristics' && (
            <div className="space-y-5">
              <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[var(--ecu-purple,#4C1D95)] dark:text-[#FEC524] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-slate-900 dark:text-white">Height-Only Platform Standard</span>
                  <span>
                    Per ECU School of Theatre &amp; Dance casting policy, no body or clothing measurements are requested on this platform—only <strong>Height</strong> and dropdown characteristics.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Height Dropdown */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Height
                  </label>
                  <select
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    {HEIGHT_OPTIONS.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                {/* Hair Color Dropdown */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Hair Color
                  </label>
                  <select
                    value={hairColor}
                    onChange={(e) => setHairColor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    {HAIR_COLOR_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Eye Color Dropdown */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Eye Color
                  </label>
                  <select
                    value={eyeColor}
                    onChange={(e) => setEyeColor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    {EYE_COLOR_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Gender Dropdown */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Gender Identifying
                  </label>
                  <select
                    value={genderSelect}
                    onChange={(e) => setGenderSelect(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    {GENDER_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {genderSelect === 'Self-Describe' && (
                    <input
                      type="text"
                      placeholder="Specify gender identity..."
                      value={genderCustom}
                      onChange={(e) => setGenderCustom(e.target.value)}
                      className="mt-2 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  )}
                </div>

                {/* Race / Ethnicity Dropdown */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Race / Ethnicity Identifying
                  </label>
                  <select
                    value={raceSelect}
                    onChange={(e) => setRaceSelect(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    {RACE_ETHNICITY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {raceSelect === 'Self-Describe' && (
                    <input
                      type="text"
                      placeholder="Specify race / ethnicity..."
                      value={raceCustom}
                      onChange={(e) => setRaceCustom(e.target.value)}
                      className="mt-2 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  )}
                </div>

                {/* Age Range */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Playable Age Range
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 18 - 25"
                    value={ageRange}
                    onChange={(e) => setAgeRange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                {/* Vocal Range */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Vocal Range (Identify voice part &amp; notes)
                  </label>
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      placeholder="e.g. Soprano (High C / Belt to F5)"
                      value={vocalRange}
                      onChange={(e) => setVocalRange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                    <div className="flex flex-wrap gap-1">
                      {VOCAL_RANGE_OPTIONS.map((vr) => (
                        <button
                          type="button"
                          key={vr}
                          onClick={() => setVocalRange(vr)}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-[10px] font-semibold text-slate-600 dark:text-slate-300"
                        >
                          {vr}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Union Status */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Union Status
                  </label>
                  <select
                    value={unionStatus}
                    onChange={(e) => setUnionStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    {UNION_STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Body Modifications & Nudity */}
          {activeSection === 'body-mod' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Tattoos
                  </label>
                  <select
                    value={tattoos}
                    onChange={(e) => setTattoos(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    {TATTOO_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Piercings
                  </label>
                  <select
                    value={piercings}
                    onChange={(e) => setPiercings(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    {PIERCING_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Body Modification Notes (Optional — e.g. placement or wardrobe coverability)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Small forearm tattoo easily covered by sleeves or stage makeup..."
                  value={bodyModNotes}
                  onChange={(e) => setBodyModNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Nudity &amp; Intimacy Comfort Level
                  </label>
                  <select
                    value={nudityComfort}
                    onChange={(e) => setNudityComfort(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    {NUDITY_COMFORT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Stage Intimacy / Rider Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Specify boundaries, intimacy coordinator requirements, or wardrobe notes..."
                    value={intimacyNotes}
                    onChange={(e) => setIntimacyNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Languages & Dialects with 3-tier Proficiency Distinction */}
          {activeSection === 'languages' && (
            <div className="space-y-5">
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-slate-700 dark:text-slate-300">
                <span className="font-bold block text-slate-900 dark:text-white mb-0.5">
                  Proficiency Distinction Requirement
                </span>
                Please distinguish clearly between <strong>Native / Fluent</strong> language ability,{' '}
                <strong>Conversational Proficiency</strong>, and <strong>Practiced Performance Dialects</strong> so directors cast accurately.
              </div>

              {/* Add Entry Builder */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Add Language or Performance Dialect
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Language / Dialect
                    </label>
                    <select
                      value={newLangName}
                      onChange={(e) => setNewLangName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    >
                      <optgroup label="Languages">
                        {REFERENCE_LANGUAGES.map((lang) => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Dialects & Accents">
                        {REFERENCE_DIALECTS.map((dia) => (
                          <option key={dia} value={dia}>{dia}</option>
                        ))}
                      </optgroup>
                    </select>
                    {newLangName === 'Other Language' && (
                      <input
                        type="text"
                        placeholder="Enter language name..."
                        value={customLangText}
                        onChange={(e) => setCustomLangText(e.target.value)}
                        className="mt-2 w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Ability / Proficiency Level
                    </label>
                    <select
                      value={newLangProficiency}
                      onChange={(e) => setNewLangProficiency(e.target.value as LanguageProficiencyLevel)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    >
                      {LANGUAGE_PROFICIENCY_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Region / Fluency Note (Optional)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Nigerian, Read & Write..."
                        value={newLangNotes}
                        onChange={(e) => setNewLangNotes(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                      <button
                        type="button"
                        onClick={handleAddLanguageEntry}
                        className="px-3.5 py-2 rounded-xl bg-[var(--ecu-purple,#4C1D95)] text-white font-bold flex items-center gap-1 shrink-0 hover:opacity-90"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#FEC524]" />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Entries List */}
              <div className="space-y-2.5">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">
                  Your Listed Languages &amp; Dialects ({languagesAndDialects.length})
                </span>
                {languagesAndDialects.length === 0 ? (
                  <p className="text-slate-500 italic py-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    No languages or dialects added yet. Use the form above to add your abilities.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {languagesAndDialects.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                            {entry.name}
                          </span>
                          {entry.notes && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">{entry.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={entry.proficiency}
                            onChange={(e) =>
                              handleUpdateLanguageProficiency(
                                entry.id,
                                e.target.value as LanguageProficiencyLevel
                              )
                            }
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[11px] font-semibold"
                          >
                            {LANGUAGE_PROFICIENCY_LEVELS.map((lvl) => (
                              <option key={lvl} value={lvl}>{lvl}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleRemoveLanguageEntry(entry.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg"
                            title="Remove entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Full 8-Category Special Skills Reference List Picker */}
          {activeSection === 'skills' && (
            <div className="space-y-4">
              {/* Search & Custom Skill Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Filter 8-category special skills reference list..."
                    value={skillSearch}
                    onChange={(e) => setSkillSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add custom or specified skill (e.g. Firearms: SAFD)"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomSkill();
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSkill}
                    className="px-3 py-2 rounded-xl bg-[var(--ecu-purple,#4C1D95)] text-white font-bold flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#FEC524]" />
                    Add
                  </button>
                </div>
              </div>

              {/* Selected Summary Pill Strip */}
              <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/25 border border-purple-100 dark:border-purple-900/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-[var(--ecu-purple,#4C1D95)] dark:text-[#FEC524]">
                    Selected on Resume ({selectedSkills.length})
                  </span>
                  {selectedSkills.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedSkills([])}
                      className="text-[11px] text-slate-500 hover:text-red-500 underline"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {selectedSkills.length === 0 ? (
                    <span className="text-slate-400 italic">Click any skill below to add it to your profile.</span>
                  ) : (
                    selectedSkills.map((sk) => (
                      <button
                        type="button"
                        key={sk}
                        onClick={() => toggleSkill(sk)}
                        className="px-2.5 py-1 rounded-lg bg-[var(--ecu-purple,#4C1D95)] text-white text-[11px] font-semibold flex items-center gap-1 hover:bg-red-600 transition-colors"
                        title="Click to remove"
                      >
                        <span>{sk}</span>
                        <X className="w-3 h-3" />
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Search Mode vs Category Tabs Mode */}
              {normalizedSearch ? (
                <div className="space-y-4">
                  {SPECIAL_SKILLS_CATALOG.map((cat) => {
                    const matchedMain = cat.skills.filter((s) =>
                      s.toLowerCase().includes(normalizedSearch)
                    );
                    const matchedSubs = (cat.subgroups || [])
                      .map((sub) => ({
                        ...sub,
                        items: sub.items.filter((s) => s.toLowerCase().includes(normalizedSearch)),
                      }))
                      .filter((sub) => sub.items.length > 0);

                    if (matchedMain.length === 0 && matchedSubs.length === 0) return null;

                    return (
                      <div key={cat.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
                        <h4 className="font-bold text-slate-900 dark:text-white">{cat.title}</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {matchedMain.map((skill) => {
                            const active = selectedSkills.includes(skill);
                            return (
                              <button
                                type="button"
                                key={skill}
                                onClick={() => toggleSkill(skill)}
                                className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-all flex items-center gap-1 ${
                                  active
                                    ? 'bg-[#FEC524] border-[#FEC524] text-slate-950 font-bold'
                                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-400'
                                }`}
                              >
                                {active && <Check className="w-3 h-3" />}
                                <span>{skill}</span>
                              </button>
                            );
                          })}
                        </div>
                        {matchedSubs.map((sub) => (
                          <div key={sub.title} className="pt-2 space-y-1.5">
                            <span className="font-bold text-[11px] text-slate-500 block">{sub.title}</span>
                            <div className="flex flex-wrap gap-1.5">
                              {sub.items.map((item) => {
                                const active = selectedSkills.includes(item);
                                return (
                                  <button
                                    type="button"
                                    key={item}
                                    onClick={() => toggleSkill(item)}
                                    className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-all flex items-center gap-1 ${
                                      active
                                        ? 'bg-[#FEC524] border-[#FEC524] text-slate-950 font-bold'
                                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-400'
                                    }`}
                                  >
                                    {active && <Check className="w-3 h-3" />}
                                    <span>{item}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Left 8-Category Menu */}
                  <div className="md:col-span-4 space-y-1.5">
                    {SPECIAL_SKILLS_CATALOG.map((cat) => {
                      const allCatItems = [
                        ...cat.skills,
                        ...(cat.subgroups?.flatMap((sg) => sg.items) || []),
                      ];
                      const count = allCatItems.filter((s) => selectedSkills.includes(s)).length;
                      const isActive = cat.id === activeCategoryId;
                      return (
                        <button
                          type="button"
                          key={cat.id}
                          onClick={() => setActiveCategoryId(cat.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between gap-2 ${
                            isActive
                              ? 'bg-[var(--ecu-purple,#4C1D95)] text-white shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="truncate">{cat.number}. {cat.shortTitle}</span>
                          {count > 0 && (
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${
                                isActive
                                  ? 'bg-[#FEC524] text-slate-950'
                                  : 'bg-purple-100 dark:bg-purple-900/50 text-[var(--ecu-purple,#4C1D95)] dark:text-[#FEC524]'
                              }`}
                            >
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Skill Chips */}
                  <div className="md:col-span-8 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {activeCategory.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">{activeCategory.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {activeCategory.skills.map((skill) => {
                        const active = selectedSkills.includes(skill);
                        return (
                          <button
                            type="button"
                            key={skill}
                            onClick={() => toggleSkill(skill)}
                            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-all flex items-center gap-1 ${
                              active
                                ? 'bg-[#FEC524] border-[#FEC524] text-slate-950 font-bold shadow-xs'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[var(--ecu-purple,#4C1D95)]'
                            }`}
                          >
                            {active ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 opacity-50" />}
                            <span>{skill}</span>
                          </button>
                        );
                      })}
                    </div>

                    {activeCategory.subgroups?.map((sub) => (
                      <div key={sub.title} className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                        <div>
                          <span className="font-bold text-slate-800 dark:text-slate-200 block">
                            {sub.title}
                          </span>
                          {sub.note && (
                            <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                              {sub.note}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {sub.items.map((item) => {
                            const active = selectedSkills.includes(item);
                            return (
                              <button
                                type="button"
                                key={item}
                                onClick={() => toggleSkill(item)}
                                className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-all flex items-center gap-1 ${
                                  active
                                    ? 'bg-[#FEC524] border-[#FEC524] text-slate-950 font-bold shadow-xs'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[var(--ecu-purple,#4C1D95)]'
                                }`}
                              >
                                {active ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 opacity-50" />}
                                <span>{item}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Changes update your performer profile &amp; searchable casting directory immediately.
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-5 py-2 rounded-xl bg-[var(--ecu-purple,#4C1D95)] text-white hover:opacity-95 text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 text-[#FEC524]" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
