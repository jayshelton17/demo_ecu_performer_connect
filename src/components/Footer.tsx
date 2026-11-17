import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ShieldAlert, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm mt-auto py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Wireframe footer navigation row */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setCurrentView('about-us')}
            className="hover:text-[var(--ecu-purple,#4C1D95)] dark:hover:text-[#FEC524] transition-colors"
          >
            About Us
          </button>

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">/</span>

          <button
            onClick={() => setCurrentView('contact-us')}
            className="hover:text-[var(--ecu-purple,#4C1D95)] dark:hover:text-[#FEC524] transition-colors"
          >
            Contact Us
          </button>

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">/</span>

          <button
            onClick={() => setCurrentView('report-user')}
            className="hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5 opacity-80" />
            Report User
          </button>

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">/</span>

          <button
            onClick={() => setCurrentView('terms')}
            className="hover:text-[var(--ecu-purple,#4C1D95)] dark:hover:text-[#FEC524] transition-colors"
          >
            Terms & Conditions
          </button>
        </div>

        {/* University acknowledgement */}
        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-500 flex flex-col sm:flex-row items-center justify-center gap-2">
          <span>East Carolina University · School of Theatre and Dance</span>
          <span className="hidden sm:inline">·</span>
          <span>Messick Performing Arts Center, Greenville, NC</span>
        </div>

      </div>
    </footer>
  );
};
