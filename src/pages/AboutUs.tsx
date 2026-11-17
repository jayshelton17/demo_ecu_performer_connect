import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ABOUT_THEATRE_IMAGE } from '../data/mockData.ts';
import { Users, Clapperboard, Sparkles, ArrowRight } from 'lucide-react';

export const AboutUs: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16">
      
      {/* Title directly matching About_Us_a9e974f7.png */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 dark:text-white leading-tight">
          Connecting People Through Performance
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
          ECU Performer Connect was founded by the East Carolina University School of Theatre & Dance to bridge the communication gap between undergraduate actors, dancers, stage managers, vocalists, and directors. We provide a single, secure university ecosystem for verified auditions, transparent casting workflows, and professional portfolio presentation.
        </p>
      </div>

      {/* Our Purpose matching wireframe */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white uppercase tracking-wider text-xs sm:text-sm">
            Our Purpose
          </h2>
          <div className="w-12 h-1 bg-[#FEC524] mx-auto mt-1 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="rounded-2xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-700 shadow-md">
            <img
              src={ABOUT_THEATRE_IMAGE}
              alt="ECU Theatre rehearsal"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              Auditions have historically been scattered across paper callboards in Messick, email threads, and social media flyers. ECU Performer Connect centralizes casting notices so every student has equitable, real-time access to mainstage plays, musicals, student films, and capstones.
            </p>
            <p>
              Our platform adheres strictly to the theatrical safety guidelines, intimacy standards, and anti-harassment policies upheld by East Carolina University and national conservatory partners.
            </p>
          </div>
        </div>
      </div>

      {/* Who It's For matching wireframe */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white uppercase tracking-wider text-xs sm:text-sm">
            Who It's For
          </h2>
          <div className="w-12 h-1 bg-[#4C1D95] dark:bg-[#FEC524] mx-auto mt-1 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Performers Card */}
          <div className="p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#4C1D95] dark:bg-purple-950 dark:text-[#FEC524] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              Performers
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Showcase experience, resumes, and media reels. Track your audition callbacks in real-time and network with student directors and faculty choreographers.
            </p>
            <button
              onClick={() => setCurrentView('search')}
              className="pt-2 font-bold text-xs text-[#4C1D95] dark:text-[#FEC524] hover:underline flex items-center gap-1"
            >
              <span>Explore Talent Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Directors Card */}
          <div className="p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-[#FEC524] flex items-center justify-center font-bold">
              <Clapperboard className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              Directors & Producers
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Discover talent, publish multi-stage casting workflows, review self-tapes, and assemble versatile ensemble casts with structured callback tools.
            </p>
            <button
              onClick={() => setCurrentView('create-casting-call')}
              className="pt-2 font-bold text-xs text-[#4C1D95] dark:text-[#FEC524] hover:underline flex items-center gap-1"
            >
              <span>Post a Casting Call</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
