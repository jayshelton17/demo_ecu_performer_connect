import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Search, Plus, Calendar, MapPin, ArrowRight, Filter } from 'lucide-react';

export const CastingCalls: React.FC = () => {
  const {
    castingCalls,
    setSelectedCastingCallId,
    setCurrentView,
    currentUser,
  } = useApp();

  const canCreateCasting = Boolean(
    currentUser.role.toLowerCase().includes('director') ||
    currentUser.isFaculty ||
    currentUser.isAdmin
  );

  const [search, setSearch] = useState('');
  const [productionTypeFilter, setProductionTypeFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'deadline' | 'newest'>('deadline');

  const filteredCalls = castingCalls.filter((call) => {
    const query = search.toLowerCase();
    const matchesSearch =
      !query ||
      call.title.toLowerCase().includes(query) ||
      call.storyline.toLowerCase().includes(query) ||
      call.characters.some((c) => c.name.toLowerCase().includes(query));

    const matchesType = productionTypeFilter === 'All' || call.productionType === productionTypeFilter;
    const matchesLocation = locationFilter === 'All' || call.location.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesType && matchesLocation;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Title & Header directly matching Casting_Calls_64b20ed2.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white">
            Casting Calls
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Find current casting opportunities.
          </p>
        </div>

        {canCreateCasting ? (
          <button
            onClick={() => setCurrentView('create-casting-call')}
            className="px-4 py-2 rounded-xl bg-[#4C1D95] text-white hover:bg-[#3B0764] text-xs font-bold transition-all shadow-md flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-[#FEC524]" />
            <span>Post Casting Call</span>
          </button>
        ) : (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-[var(--ecu-purple,#4C1D95)] dark:text-[#FEC524] border border-purple-200 dark:border-purple-800 self-start sm:self-auto">
            Performer Access · Open Auditions
          </span>
        )}
      </div>

      {/* Search Bar matching wireframe */}
      <div className="p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Search Casting Calls:
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title, role name, director..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#FEC524]"
            />
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          </div>
        </div>

        {/* Filters row matching wireframe: Production: [ ] Role: [ ] Location: [ ] Sort: [ ] */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div>
            <label className="text-slate-500 block mb-1 font-medium">Production:</label>
            <select
              value={productionTypeFilter}
              onChange={(e) => setProductionTypeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="All">All Types</option>
              <option value="Musical">Musical</option>
              <option value="Play">Play</option>
              <option value="Short Film">Short Film</option>
              <option value="Student Showcase">Student Showcase</option>
            </select>
          </div>

          <div>
            <label className="text-slate-500 block mb-1 font-medium">Location:</label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="All">All Locations</option>
              <option value="McGinnis">McGinnis Auditorium</option>
              <option value="Messick">Messick Theatre / Studio 104</option>
              <option value="Greenville">Greenville / On Location</option>
            </select>
          </div>

          <div>
            <label className="text-slate-500 block mb-1 font-medium">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="deadline">Audition Deadline Soonest</option>
              <option value="newest">Recently Posted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Casting Calls List matching wireframe card layout */}
      <div className="space-y-4">
        {filteredCalls.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
            No casting calls matched your search criteria.
          </div>
        ) : (
          filteredCalls.map((call) => (
            <div
              key={call.id}
              onClick={() => {
                setSelectedCastingCallId(call.id);
                setCurrentView('casting-call-details');
              }}
              className="group p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-[#4C1D95] dark:hover:border-[#FEC524] cursor-pointer transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              {/* Left Column matching wireframe: (Production Name), (Production Type), Casting: (Roles) */}
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white group-hover:text-[#4C1D95] dark:group-hover:text-[#FEC524] transition-colors">
                    {call.title}
                  </h2>
                </div>

                <div className="text-xs font-semibold text-[#4C1D95] dark:text-[#FEC524]">
                  ({call.productionType})
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Casting: </span>
                  <span>({call.characters.map((c) => c.name).join(', ')})</span>
                </div>

                <div className="text-[11px] text-slate-500 line-clamp-1 pt-1">
                  {call.storyline}
                </div>
              </div>

              {/* Right Column matching wireframe: Audition Deadline:, Location: */}
              <div className="text-left md:text-right space-y-1 text-xs shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 w-full md:w-auto">
                <div>
                  <span className="text-slate-500">Audition Deadline: </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{call.deadline}</span>
                </div>
                <div>
                  <span className="text-slate-500">Location: </span>
                  <span className="text-slate-700 dark:text-slate-300">{call.location}</span>
                </div>
                <div className="pt-2 flex items-center justify-end gap-1 text-[#4C1D95] dark:text-[#FEC524] font-bold group-hover:translate-x-0.5 transition-transform">
                  <span>View Details & Roles</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
