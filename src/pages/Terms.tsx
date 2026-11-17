import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export const Terms: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* Title & Last Updated directly matching Terms___Conditions_f7cb6b2b.png */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white">
          Terms & Conditions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-mono">
          Last Updated: November 2026
        </p>
      </div>

      {/* Main Terms Box matching wireframe box */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-md text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-6 leading-relaxed">
        
        <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#4C1D95] dark:text-[#FEC524] shrink-0 mt-0.5" />
          <p className="text-xs text-[#4C1D95] dark:text-[#FEC524] font-medium">
            ECU Performer Connect operates under the direct academic jurisdiction of the East Carolina University School of Theatre & Dance. All registered performers and directors must adhere to university student conduct honor codes.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-display text-slate-900 dark:text-white">
            1. Eligibility & University Affiliation
          </h2>
          <p>
            ECU Performer Connect is provided exclusively for verified East Carolina University undergraduate students, graduate candidates, full-time and adjunct faculty, and approved alumni collaborators. Accounts created using unauthorized commercial credentials or third-party agencies are subject to immediate termination.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-display text-slate-900 dark:text-white">
            2. Audition Ethics & Prohibition of Fees
          </h2>
          <p>
            No casting call posted on ECU Performer Connect may ever charge an audition fee, registration fee, script purchase fee, or deposit of any kind. All auditions for mainstage, studio, senior capstone, and thesis projects must be free and open to eligible university talent in accordance with school bylaws.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-display text-slate-900 dark:text-white">
            3. Intellectual Property & Media Rights
          </h2>
          <p>
            Student actors and directors retain complete copyright and personal rights to their uploaded self-tapes, vocal cuttings, monologues, and headshots. Directors may only review submitted media reels for the explicit casting decisions of the designated production and may not redistribute or post student materials without written consent.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-display text-slate-900 dark:text-white">
            4. Rehearsal Safety & Intimacy Guidelines
          </h2>
          <p>
            Any production involving staged physical violence, stage combat (armed or unarmed), or theatrical intimacy must disclose these requirements in the initial character breakdown. Staging must be supervised by qualified faculty fight directors or certified intimacy coordinators.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-display text-slate-900 dark:text-white">
            5. Disciplinary Process & Reporting
          </h2>
          <p>
            Violations of these terms, including harassment, unauthorized schedule breaches, or ethical grievances, may be reported using the built-in Report User portal. Submissions are reviewed confidentially by the School of Theatre & Dance Ethics Advisory Board.
          </p>
        </section>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
          <button
            onClick={() => setCurrentView('home')}
            className="text-[#4C1D95] dark:text-[#FEC524] font-bold hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </button>
          <span className="text-slate-400">East Carolina University · Greenville, NC</span>
        </div>

      </div>

    </div>
  );
};
