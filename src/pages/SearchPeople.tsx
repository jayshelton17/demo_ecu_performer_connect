import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  HAIR_COLOR_OPTIONS,
  EYE_COLOR_OPTIONS,
  GENDER_OPTIONS,
} from '../data/performerReferenceData.ts';
import { Search, SlidersHorizontal, Heart, MessageSquare, ArrowRight, Check } from 'lucide-react';

export const SearchPeople: React.FC = () => {
  const {
    users,
    searchQuery,
    setSearchQuery,
    setSelectedUserId,
    setCurrentView,
    toggleFavoriteUser,
    startNewThread,
    setSelectedThreadId,
  } = useApp();

  const [roleFilter, setRoleFilter] = useState<'All' | 'Performer' | 'Director' | 'Performer & Director'>('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('All');
  const [hairFilter, setHairFilter] = useState<string>('All');
  const [eyeFilter, setEyeFilter] = useState<string>('All');
  const [genderFilter, setGenderFilter] = useState<string>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'recent'>('name');

  const filteredUsers = users.filter((user) => {
    // Search query matches name, role, skills, languages/dialects, previous roles, characteristics
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      user.name.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query) ||
      user.previousRoles.some((r) => r.toLowerCase().includes(query)) ||
      user.specialSkills.some((s) => s.toLowerCase().includes(query)) ||
      (user.languagesAndDialects &&
        user.languagesAndDialects.some(
          (ld) =>
            ld.name.toLowerCase().includes(query) ||
            ld.proficiency.toLowerCase().includes(query)
        )) ||
      (user.characteristics.vocalRange && user.characteristics.vocalRange.toLowerCase().includes(query));

    // Role filter
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;

    // Availability filter
    const matchesAvailability = availabilityFilter === 'All' || user.availability === availabilityFilter;

    // Characteristic Dropdown filters
    const matchesHair = hairFilter === 'All' || user.characteristics.hairColor === hairFilter;
    const matchesEye = eyeFilter === 'All' || user.characteristics.eyeColor === eyeFilter;
    const matchesGender = genderFilter === 'All' || user.characteristics.gender === genderFilter;

    return (
      matchesQuery &&
      matchesRole &&
      matchesAvailability &&
      matchesHair &&
      matchesEye &&
      matchesGender
    );
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Top Header matching Search_928cc041.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white">
            Find People
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Browse and connect with East Carolina University performers, actors, and directors
          </p>
        </div>

        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
            isFilterOpen ||
            roleFilter !== 'All' ||
            availabilityFilter !== 'All' ||
            hairFilter !== 'All' ||
            eyeFilter !== 'All' ||
            genderFilter !== 'All'
              ? 'bg-[#4C1D95] text-white border-[#4C1D95] shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 text-[#FEC524]" />
          <span>Filter &amp; Sort</span>
        </button>
      </div>

      {/* Filter panel */}
      {isFilterOpen && (
        <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md space-y-4 text-xs animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Role Type</label>
              <div className="flex flex-wrap gap-1.5">
                {(['All', 'Performer', 'Director', 'Performer & Director'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      roleFilter === r
                        ? 'bg-[#4C1D95] text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Availability</label>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                <option value="All">All Availabilities</option>
                <option value="Available">Available</option>
                <option value="Auditioning">Auditioning</option>
                <option value="Booked Spring 2026">Booked Spring 2026</option>
                <option value="Limited Availability">Limited Availability</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Sort Directory</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                <option value="name">Alphabetical (A - Z)</option>
                <option value="recent">Recently Active</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/60">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Hair Color</label>
              <select
                value={hairFilter}
                onChange={(e) => setHairFilter(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                <option value="All">Any Hair Color</option>
                {HAIR_COLOR_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Eye Color</label>
              <select
                value={eyeFilter}
                onChange={(e) => setEyeFilter(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                <option value="All">Any Eye Color</option>
                {EYE_COLOR_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Gender Identifying</label>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                <option value="All">Any Gender</option>
                {GENDER_OPTIONS.filter((g) => g !== 'Self-Describe').map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">{sortedUsers.length} people found</span>
            <button
              onClick={() => {
                setRoleFilter('All');
                setAvailabilityFilter('All');
                setHairFilter('All');
                setEyeFilter('All');
                setGenderFilter('All');
                setSearchQuery('');
              }}
              className="text-[#4C1D95] dark:text-[#FEC524] font-semibold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Search Input bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by name, previous roles (e.g. Marian Paroo), skills (e.g. Tap, Stage Combat)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#FEC524] shadow-sm"
        />
        <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
      </div>

      {/* Directory List directly matching wireframe Search_928cc041.png */}
      <div className="space-y-4">
        {sortedUsers.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No performers or directors matched your search.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setRoleFilter('All');
                setAvailabilityFilter('All');
                setHairFilter('All');
                setEyeFilter('All');
                setGenderFilter('All');
              }}
              className="text-xs font-bold text-[#4C1D95] dark:text-[#FEC524] hover:underline"
            >
              Clear filters and view all
            </button>
          </div>
        ) : (
          sortedUsers.map((user) => (
            <div
              key={user.id}
              className="group p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-[#4C1D95] dark:hover:border-[#FEC524] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                {/* Headshot */}
                <div
                  onClick={() => {
                    setSelectedUserId(user.id);
                    setCurrentView('profile');
                  }}
                  className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Info matching wireframe: (Name), (Performer and/or Director), Previous Roles */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h2
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setCurrentView('profile');
                      }}
                      className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white cursor-pointer hover:text-[#4C1D95] dark:hover:text-[#FEC524] transition-colors truncate"
                    >
                      {user.name}
                    </h2>
                    <span className="text-[11px] font-semibold text-[#4C1D95] dark:text-[#FEC524] shrink-0">
                      ({user.role})
                    </span>
                  </div>

                  {user.previousRoles.length > 0 && (
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Previous Roles: </span>
                      <span>{user.previousRoles.join(' · ')}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pt-1">
                    <span>{user.location}</span>
                    <span>·</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{user.availability}</span>
                    {user.characteristics.vocalRange && (
                      <>
                        <span>·</span>
                        <span>{user.characteristics.vocalRange}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons: Heart favorite & View Profile & Message */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => toggleFavoriteUser(user.id)}
                  title={user.isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                  className={`p-2.5 rounded-xl border transition-all ${
                    user.isFavorited
                      ? 'border-red-300 bg-red-50 text-red-500 dark:bg-red-950/30 dark:border-red-800'
                      : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${user.isFavorited ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={() => {
                    const threadId = startNewThread(user.id, `Hi ${user.name}, loved your work on ECU Performer Connect!`);
                    setSelectedThreadId(threadId);
                    setCurrentView('message-details');
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#4C1D95] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  title="Send message"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>

                <button
                  onClick={() => {
                    setSelectedUserId(user.id);
                    setCurrentView('profile');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#4C1D95] text-white hover:bg-[#3B0764] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <span>View Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
