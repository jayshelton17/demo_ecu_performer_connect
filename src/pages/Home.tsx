import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { HERO_THEATRE_IMAGE } from '../data/mockData.ts';
import { Users, Clapperboard, Sparkles, ArrowRight, Calendar, Heart, ShieldCheck, MapPin } from 'lucide-react';

export const Home: React.FC = () => {
  const {
    setCurrentView,
    setSelectedUserId,
    setSelectedCastingCallId,
    users,
    castingCalls,
    toggleFavoriteUser,
  } = useApp();

  return (
    <div className="space-y-10 pb-16">
      
      {/* Hero Section matching Home_59702a41.png */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-2xl bg-slate-900 text-white min-h-[380px] sm:min-h-[440px] flex items-center">
        {/* Background Hero Image */}
        <div className="absolute inset-0">
          <img
            src={HERO_THEATRE_IMAGE}
            alt="ECU Performing Arts Theatre"
            className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b092f] via-[#240b3b]/80 to-[#120420]/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 sm:py-16 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEC524]/20 border border-[#FEC524]/50 text-[#FEC524] text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            Official East Carolina University Theatre & Film Casting Network
          </div>

          <div className="space-y-3">
            <h2 className="text-sm uppercase tracking-widest font-semibold text-slate-300">Welcome to</h2>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-tight">
              ECU Performer <span className="text-[#FEC524]">Connect</span>
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-200 font-normal leading-relaxed">
              Greenville’s premier talent bridge. Showcase your performance reels and resumes, discover collegiate stage & film auditions, and connect ECU directors with student actors, dancers, and stage artists.
            </p>
          </div>
        </div>
      </section>

      {/* Two Prominent Quick Access Cards directly matching wireframe */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        
        {/* People Card */}
        <button
          onClick={() => setCurrentView('search')}
          className="group text-left p-8 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-[#4C1D95] dark:hover:border-[#FEC524] transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#4C1D95]/10 dark:bg-[#4C1D95]/30 text-[#4C1D95] dark:text-[#FEC524] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">People</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Discover performers, vocalists, and student & faculty directors across East Carolina University.
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm font-bold text-[#4C1D95] dark:text-[#FEC524] group-hover:translate-x-1 transition-transform">
            <span>Browse Talent Directory</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>

        {/* Casting Calls Card */}
        <button
          onClick={() => setCurrentView('casting-calls')}
          className="group text-left p-8 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-[#FEC524] transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FEC524]/20 text-[#4C1D95] dark:text-[#FEC524] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clapperboard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Casting Calls</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Find your next role! Browse open auditions for mainstage musicals, student films, and showcases.
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm font-bold text-[#4C1D95] dark:text-[#FEC524] group-hover:translate-x-1 transition-transform">
            <span>Explore Auditions</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>

      </section>

      {/* Featured ECU Talent Showcase */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
              Featured Performers & Directors
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Active ECU School of Theatre and Dance student talent available for casting
            </p>
          </div>
          <button
            onClick={() => setCurrentView('search')}
            className="text-xs sm:text-sm font-bold text-[#4C1D95] dark:text-[#FEC524] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {users.slice(0, 4).map((user) => (
            <div
              key={user.id}
              className="bg-white/90 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteUser(user.id);
                    }}
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                      user.isFavorited
                        ? 'bg-red-500 text-white'
                        : 'bg-black/40 text-white hover:bg-black/60'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${user.isFavorited ? 'fill-current' : ''}`} />
                  </button>

                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white uppercase tracking-wider">
                    {user.role}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-[#4C1D95] dark:group-hover:text-[#FEC524] transition-colors truncate">
                    {user.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {user.characteristics.vocalRange || user.category || 'ECU Artist'}
                  </p>
                </div>

                <div className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                  {user.about}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {user.availability}
                </span>
                <button
                  onClick={() => {
                    setSelectedUserId(user.id);
                    setCurrentView('profile');
                  }}
                  className="text-xs font-bold text-[#4C1D95] dark:text-[#FEC524] hover:underline"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Urgent Audition Deadlines */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
              Current Open Auditions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Submit your audition reels and sides for upcoming productions
            </p>
          </div>
          <button
            onClick={() => setCurrentView('casting-calls')}
            className="text-xs sm:text-sm font-bold text-[#4C1D95] dark:text-[#FEC524] hover:underline flex items-center gap-1"
          >
            <span>All Castings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {castingCalls.slice(0, 2).map((call) => (
            <div
              key={call.id}
              onClick={() => {
                setSelectedCastingCallId(call.id);
                setCurrentView('casting-call-details');
              }}
              className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-[#4C1D95] dark:hover:border-[#FEC524] cursor-pointer transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#4C1D95] dark:text-[#FEC524]">
                    {call.productionType}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{call.title}</h3>
                  <p className="text-xs text-slate-500">Directed by {call.directorName}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Deadline
                  </span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">{call.deadline}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                {call.storyline}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {call.location}
                </span>
                <span className="font-bold text-[#4C1D95] dark:text-[#FEC524]">
                  {call.characters.length} Roles Listed →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
