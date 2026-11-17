import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { EditProfileModal } from '../components/EditProfileModal.tsx';
import { findSkillCategory } from '../data/performerReferenceData.ts';
import {
  Heart,
  MessageSquare,
  Globe,
  Instagram,
  Film,
  ExternalLink,
  Download,
  Play,
  Upload,
  Calendar,
  MapPin,
  ShieldAlert,
  ChevronRight,
  Plus,
  CheckCircle,
  Pencil,
  Languages,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    selectedUserId,
    users,
    currentUser,
    toggleFavoriteUser,
    updateUserProfile,
    startNewThread,
    setSelectedThreadId,
    setCurrentView,
    castingCalls,
    setSelectedCastingCallId,
    showNotification,
  } = useApp();

  const user = users.find((u) => u.id === selectedUserId) || currentUser;
  const isOwnProfile = user.id === currentUser.id;

  const [activeTab, setActiveTab] = useState<'overview' | 'resume' | 'media' | 'casting-calls'>('overview');
  const [resumeSubTab, setResumeSubTab] = useState<'performer' | 'director'>('performer');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<{ title: string; url: string } | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [editModalSection, setEditModalSection] = useState<'characteristics' | 'body-mod' | 'languages' | 'skills' | null>(null);

  // Casting calls associated with this user
  const userCastingCalls = castingCalls.filter(
    (c) => c.directorId === user.id || c.directorName.toLowerCase() === user.name.toLowerCase()
  );

  const handleSendMessage = () => {
    const threadId = startNewThread(user.id, `Hi ${user.name}, reaching out via ECU Performer Connect!`);
    setSelectedThreadId(threadId);
    setCurrentView('message-details');
  };

  const handleDownloadResume = () => {
    showNotification(`Downloading ${user.name}'s official ECU theatrical resume...`);
    // Simulated PDF resume download
    const blob = new Blob([`ECU THEATRICAL RESUME - ${user.name}\n${user.role}\nEmail: ${user.email}\n\nCREDITS:\n${user.resume.performerCredits.map(c => `${c.title} - ${c.role} (${c.venueOrCompany})`).join('\n')}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user.name.replace(/\s+/g, '_')}_ECU_Resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Top Profile Header Card directly matching wireframes (Profile__Overview__fb957243.png) */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-sm">
        
        {/* Favorite heart icon in top-right */}
        <button
          onClick={() => toggleFavoriteUser(user.id)}
          className={`absolute top-6 right-6 p-2.5 rounded-full border transition-all ${
            user.isFavorited
              ? 'border-red-300 bg-red-50 text-red-500 dark:bg-red-950/40 dark:border-red-800'
              : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
          title={user.isFavorited ? 'Favorited' : 'Add to Favorites'}
        >
          <Heart className={`w-5 h-5 ${user.isFavorited ? 'fill-current' : ''}`} />
        </button>

        <div className="flex flex-col md:flex-row items-start gap-6">
          
          {/* Headshot */}
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-[#4C1D95] dark:border-[#FEC524] shadow-md shrink-0">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Details */}
          <div className="flex-1 space-y-3 min-w-0 pr-10">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
                  {user.name}
                </h1>
                {user.isAdmin && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-[#4C1D95] dark:bg-purple-950 dark:text-[#FEC524] border border-[#4C1D95]/30">
                    Faculty Admin
                  </span>
                )}
              </div>
            </div>

            {/* Roles, Availability, Location, Sites Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">Roles: </span>
                <span className="text-[#4C1D95] dark:text-[#FEC524] font-semibold">{user.role}</span>
              </div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">Location: </span>
                <span>{user.location}</span>
              </div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">Availability: </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{user.availability}</span>
              </div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">Sites: </span>
                <span className="inline-flex items-center gap-2">
                  {user.sites.website && (
                    <a
                      href={user.sites.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                    >
                      <Globe className="w-3 h-3" /> Website
                    </a>
                  )}
                  {user.sites.instagram && (
                    <span className="text-pink-600 dark:text-pink-400 font-medium">
                      {user.sites.instagram}
                    </span>
                  )}
                  {user.sites.imdb && (
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">IMDb</span>
                  )}
                </span>
              </div>
            </div>

            {/* About text */}
            <div className="pt-2">
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block mb-1">About:</span>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {user.about}
              </p>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {isOwnProfile ? (
                <button
                  onClick={() => setEditModalSection('characteristics')}
                  className="px-4 py-2 rounded-xl bg-[var(--ecu-purple,#4C1D95)] text-white hover:opacity-95 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5 text-[#FEC524]" />
                  <span>Edit Characteristics &amp; Skills</span>
                </button>
              ) : (
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 rounded-xl bg-[var(--ecu-purple,#4C1D95)] text-white hover:opacity-95 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#FEC524]" />
                  <span>Message Performer</span>
                </button>
              )}

              <button
                onClick={handleDownloadResume}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Resume</span>
              </button>

              <button
                onClick={() => setCurrentView('report-user')}
                className="px-3 py-2 text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 flex items-center gap-1 ml-auto"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Report</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Profile Navigation Tabs directly matching wireframes */}
      {/* Overview | Resume | Media | Casting Calls */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 rounded-2xl p-1 shadow-xs overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 min-w-[100px] py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap text-center ${
            activeTab === 'overview'
              ? 'bg-[#4C1D95] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Overview
        </button>

        <button
          onClick={() => setActiveTab('resume')}
          className={`flex-1 min-w-[100px] py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap text-center ${
            activeTab === 'resume'
              ? 'bg-[#4C1D95] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Resume
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`flex-1 min-w-[100px] py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap text-center ${
            activeTab === 'media'
              ? 'bg-[#4C1D95] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Media
        </button>

        <button
          onClick={() => setActiveTab('casting-calls')}
          className={`flex-1 min-w-[100px] py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap text-center ${
            activeTab === 'casting-calls'
              ? 'bg-[#4C1D95] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Casting Calls
        </button>
      </div>

      {/* Tab 1: Overview (Profile__Overview__fb957243.png) */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Characteristics (Height-Only + Identity Dropdowns) & Body Modifications/Nudity */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div>
                    <h2 className="text-base font-bold font-display text-slate-900 dark:text-white">
                      Characteristics
                    </h2>
                    <span className="text-[10px] text-slate-400">Height only · No body measurements</span>
                  </div>
                  {isOwnProfile && (
                    <button
                      onClick={() => setEditModalSection('characteristics')}
                      className="text-[11px] font-bold text-[var(--ecu-purple,#4C1D95)] dark:text-[#FEC524] hover:underline flex items-center gap-1"
                    >
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                  )}
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-500">Height:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{user.characteristics.height || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-500">Vocal Range:</span>
                    <span className="font-semibold text-[var(--ecu-purple,#4C1D95)] dark:text-[#FEC524]">{user.characteristics.vocalRange || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-500">Hair Color:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{user.characteristics.hairColor || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-500">Eye Color:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{user.characteristics.eyeColor || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-500">Gender Identifying:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{user.characteristics.gender || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-500">Race / Ethnicity:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-right max-w-[60%]">{user.characteristics.raceEthnicity || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-500">Age Range:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{user.characteristics.ageRange || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Union Status:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{user.characteristics.unionStatus || 'Non-Union'}</span>
                  </div>
                </div>
              </div>

              {/* Body Modifications & Nudity Section */}
              <div className="p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h2 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[var(--ecu-purple,#4C1D95)] dark:text-[#FEC524]" />
                    <span>Body Modifications &amp; Nudity</span>
                  </h2>
                  {isOwnProfile && (
                    <button
                      onClick={() => setEditModalSection('body-mod')}
                      className="text-[11px] font-bold text-[var(--ecu-purple,#4C1D95)] dark:text-[#FEC524] hover:underline flex items-center gap-1"
                    >
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                  )}
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60 gap-4">
                    <span className="text-slate-500 shrink-0">Tattoos:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">
                      {user.characteristics.bodyModifications?.tattoos || 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60 gap-4">
                    <span className="text-slate-500 shrink-0">Piercings:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">
                      {user.characteristics.bodyModifications?.piercings || 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60 gap-4">
                    <span className="text-slate-500 shrink-0">Nudity / Intimacy:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">
                      {user.characteristics.nudityComfort || 'No Nudity (Fully Clothed Roles Only)'}
                    </span>
                  </div>
                  {(user.characteristics.bodyModifications?.notes || user.characteristics.intimacyNotes) && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                      {user.characteristics.bodyModifications?.notes && (
                        <p><strong className="text-slate-700 dark:text-slate-300">Modification Note:</strong> {user.characteristics.bodyModifications.notes}</p>
                      )}
                      {user.characteristics.intimacyNotes && (
                        <p><strong className="text-slate-700 dark:text-slate-300">Intimacy Note:</strong> {user.characteristics.intimacyNotes}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Languages/Dialects (3 Proficiency Levels) & Special Skills */}
            <div className="space-y-6">
              {/* Languages & Performance Dialects Card */}
              <div className="p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div>
                    <h2 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                      <Languages className="w-4 h-4 text-[var(--ecu-purple,#4C1D95)] dark:text-[#FEC524]" />
                      <span>Languages &amp; Dialects</span>
                    </h2>
                    <span className="text-[10px] text-slate-400">
                      Native/Fluent · Conversational · Practiced Performance Dialect
                    </span>
                  </div>
                  {isOwnProfile && (
                    <button
                      onClick={() => setEditModalSection('languages')}
                      className="text-[11px] font-bold text-[var(--ecu-purple,#4C1D95)] dark:text-[#FEC524] hover:underline flex items-center gap-1"
                    >
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                  )}
                </div>

                {!user.languagesAndDialects || user.languagesAndDialects.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No languages or dialects listed yet.</p>
                ) : (
                  <div className="space-y-2">
                    {user.languagesAndDialects.map((entry) => {
                      const badgeStyles =
                        entry.proficiency === 'Native / Fluent'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60'
                          : entry.proficiency === 'Conversational Proficiency'
                          ? 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900/60'
                          : 'bg-purple-50 text-[var(--ecu-purple,#4C1D95)] border-purple-200 dark:bg-purple-950/40 dark:text-[#FEC524] dark:border-purple-900/60';

                      return (
                        <div
                          key={entry.id}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">{entry.name}</span>
                            {entry.notes && (
                              <span className="block text-[10px] text-slate-500 dark:text-slate-400">{entry.notes}</span>
                            )}
                          </div>
                          <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold shrink-0 ${badgeStyles}`}>
                            {entry.proficiency}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Special Skills block */}
              <div className="p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h2 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--ecu-purple,#4C1D95)] dark:text-[#FEC524]" />
                    <span>Special Skills</span>
                  </h2>
                  {isOwnProfile && (
                    <button
                      onClick={() => setEditModalSection('skills')}
                      className="text-[11px] font-bold text-[var(--ecu-purple,#4C1D95)] dark:text-[#FEC524] hover:underline flex items-center gap-1"
                    >
                      <Pencil className="w-3 h-3" /> Edit / Reference List
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {user.specialSkills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 text-xs font-semibold text-slate-800 dark:text-purple-200 flex items-center gap-1.5"
                      title={findSkillCategory(skill)}
                    >
                      <CheckCircle className="w-3 h-3 text-[var(--ecu-purple,#4C1D95)] dark:text-[#FEC524] shrink-0" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">Previous Roles</span>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    {user.previousRoles.map((role, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#FEC524] font-bold">▪</span>
                        <span>{role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: Resume (Profile__Resume__e138c80f.png) */}
      {activeTab === 'resume' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          
          {/* Performer | Director sub-switch as shown in wireframe */}
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setResumeSubTab('performer')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  resumeSubTab === 'performer'
                    ? 'bg-[#4C1D95] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Performer Credits
              </button>
              <button
                onClick={() => setResumeSubTab('director')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  resumeSubTab === 'director'
                    ? 'bg-[#4C1D95] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Director Credits
              </button>
            </div>

            <button
              onClick={handleDownloadResume}
              className="px-3.5 py-1.5 rounded-xl bg-[#FEC524] text-slate-900 font-bold text-xs hover:bg-[#e0ad1c] shadow-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Download Resume
            </button>
          </div>

          {/* Credits Table */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                {resumeSubTab === 'performer' ? 'Stage & Film Performance Credits' : 'Directing & Production Credits'}
              </h3>

              {resumeSubTab === 'performer' ? (
                user.resume.performerCredits.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No performer credits listed yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                          <th className="py-2.5">Production</th>
                          <th className="py-2.5">Role</th>
                          <th className="py-2.5">Venue / Company</th>
                          <th className="py-2.5">Director</th>
                          <th className="py-2.5 text-right">Year</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {user.resume.performerCredits.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                            <td className="py-3 font-bold text-slate-900 dark:text-white">{c.title}</td>
                            <td className="py-3 text-[#4C1D95] dark:text-[#FEC524] font-medium">{c.role}</td>
                            <td className="py-3 text-slate-600 dark:text-slate-400">{c.venueOrCompany}</td>
                            <td className="py-3 text-slate-600 dark:text-slate-400">{c.director}</td>
                            <td className="py-3 text-right font-mono text-slate-500">{c.year}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ) : user.resume.directorCredits.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No directing credits listed for this user.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                        <th className="py-2.5">Production</th>
                        <th className="py-2.5">Role</th>
                        <th className="py-2.5">Venue / Series</th>
                        <th className="py-2.5 text-right">Year</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {user.resume.directorCredits.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-3 font-bold text-slate-900 dark:text-white">{c.title}</td>
                          <td className="py-3 text-[#4C1D95] dark:text-[#FEC524] font-medium">{c.role}</td>
                          <td className="py-3 text-slate-600 dark:text-slate-400">{c.venueOrCompany}</td>
                          <td className="py-3 text-right font-mono text-slate-500">{c.year}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Education & Training */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                Education & Masterclass Training
              </h3>
              <div className="space-y-3">
                {user.resume.education.map((edu) => (
                  <div key={edu.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{edu.degree}</span>
                      <span className="font-mono text-slate-500">{edu.year}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 font-medium">{edu.institution}</p>
                    {edu.details && <p className="text-[11px] text-slate-500">{edu.details}</p>}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Tab 3: Media (Profile__Media__fef1b544.png) */}
      {activeTab === 'media' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
          
          {/* Header & Upload Media button */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">Media Portfolio</h2>
              <p className="text-xs text-slate-500">Audition video reels, monologues, and production headshots</p>
            </div>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#4C1D95] text-white hover:bg-[#3B0764] text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#FEC524]" />
              Upload Media
            </button>
          </div>

          {/* Videos Section matching wireframe */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Film className="w-4 h-4 text-[#4C1D95] dark:text-[#FEC524]" />
              Videos & Audition Reels
            </h3>

            {user.media.videos.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No video reels uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {user.media.videos.map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => setActiveVideo({ title: vid.title, url: vid.url })}
                    className="group relative rounded-2xl overflow-hidden bg-slate-900 aspect-video cursor-pointer border border-slate-200 dark:border-slate-800 shadow-sm"
                  >
                    {/* Simulated thumbnail */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-slate-900 to-black opacity-80" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-[#FEC524] text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-2">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                      <span className="text-xs font-bold text-white line-clamp-1">{vid.title}</span>
                      <span className="text-[10px] text-slate-300 mt-0.5">{vid.category || 'Reel'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Photos Section matching wireframe */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Photos & Headshots
            </h3>

            {user.media.photos.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No photos uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {user.media.photos.map((photo, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedPhoto(photo)}
                    className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
                  >
                    <img
                      src={photo}
                      alt={`${user.name} photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                      View Fullscreen
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Tab 4: Casting Calls (Profile__Casting_Calls__25cd961e.png) */}
      {activeTab === 'casting-calls' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-display text-slate-900 dark:text-white">
              Current Casting Calls
            </h2>
            {user.id === currentUser.id && Boolean(currentUser.role.toLowerCase().includes('director') || currentUser.isFaculty || currentUser.isAdmin) && (
              <button
                onClick={() => setCurrentView('create-casting-call')}
                className="px-3 py-1.5 rounded-lg bg-[#4C1D95] text-white text-xs font-bold hover:bg-[#3B0764]"
              >
                + New Casting Call
              </button>
            )}
          </div>

          {userCastingCalls.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
              <p className="text-xs text-slate-500">
                This user has no active casting calls published at this moment.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {userCastingCalls.map((call) => (
                <div
                  key={call.id}
                  onClick={() => {
                    setSelectedCastingCallId(call.id);
                    setCurrentView('casting-call-details');
                  }}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-[#4C1D95] dark:hover:border-[#FEC524] cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <span className="font-extrabold text-[10px] uppercase text-[#4C1D95] dark:text-[#FEC524]">
                      {call.productionType}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{call.title}</h3>
                    <p className="text-slate-500">
                      Casting: {call.characters.map((ch) => ch.name).join(', ')}
                    </p>
                  </div>

                  <div className="text-left sm:text-right space-y-0.5">
                    <div className="text-slate-500 font-medium">Audition Deadline:</div>
                    <div className="font-bold text-amber-600 dark:text-amber-400">{call.deadline}</div>
                    <div className="text-[11px] text-slate-400">{call.location}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between p-4 bg-slate-900 text-white">
              <span className="text-xs font-bold">{activeVideo.title}</span>
              <button onClick={() => setActiveVideo(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <video src={activeVideo.url} controls autoPlay className="w-full aspect-video bg-black" />
          </div>
        </div>
      )}

      {/* Lightbox Photo Preview */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm cursor-zoom-out"
        >
          <img
            src={selectedPhoto}
            alt="Fullscreen headshot"
            className="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Upload Media Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Video or Photo Link</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. 2026 Classical Monologue"
                  value={newMediaTitle}
                  onChange={(e) => setNewMediaTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Media URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newMediaUrl}
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newMediaTitle && newMediaUrl) {
                    showNotification(`Added "${newMediaTitle}" to your media reels`);
                    setIsUploadModalOpen(false);
                    setNewMediaTitle('');
                    setNewMediaUrl('');
                  }
                }}
                className="px-4 py-1.5 rounded-lg bg-[#4C1D95] text-white text-xs font-bold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile & Special Skills Modal */}
      {editModalSection && (
        <EditProfileModal
          isOpen={Boolean(editModalSection)}
          initialSection={editModalSection}
          user={user}
          onClose={() => setEditModalSection(null)}
          onSave={(updates) => updateUserProfile(updates)}
        />
      )}

    </div>
  );
};
