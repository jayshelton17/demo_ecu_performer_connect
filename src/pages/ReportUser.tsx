import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ShieldAlert, Paperclip, Send, CheckCircle2 } from 'lucide-react';

export const ReportUser: React.FC = () => {
  const { submitReport, currentUser, showNotification } = useApp();

  const [reportingType, setReportingType] = useState<any>('Inappropriate Content');
  const [target, setTarget] = useState('');
  const [reason, setReason] = useState('Unprofessional Behavior');
  const [description, setDescription] = useState('');
  const [attachedFileName, setAttachedFileName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!target.trim() || !description.trim()) return;

    submitReport({
      type: reportingType,
      reportedTarget: target.trim(),
      reportedBy: currentUser.email,
      reason,
      description: description.trim(),
      evidence: attachedFileName || undefined,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTarget('');
      setDescription('');
      setAttachedFileName('');
    }, 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFileName(file.name);
      showNotification(`Attached file: ${file.name}`);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16">
      
      {/* Title directly matching Report_User_3386a8df.png */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold font-display text-slate-900 dark:text-white">
          Report User
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Use this form to report inappropriate content or behavior
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
        
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Report Submitted to ECU Ethics Committee
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your report has been logged confidentially. Our faculty moderators review all submissions in accordance with university title IX and conservatory conduct codes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* What are you reporting? dropdown matching wireframe */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                What are you reporting?
              </label>
              <select
                value={reportingType}
                onChange={(e) => setReportingType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
              >
                <option value="Inappropriate Content">Inappropriate Content</option>
                <option value="Harassment">Harassment or Intimidation</option>
                <option value="Audition Policy Violation">Audition Policy Violation (e.g. Audition Fees)</option>
                <option value="Fake Profile">Impersonation or Unverified Account</option>
                <option value="Spam">Spam / Unsolicited Promotion</option>
              </select>
            </div>

            {/* Person/Project/Content in Question input matching wireframe */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Person/Project/Content in Question:
              </label>
              <input
                type="text"
                required
                placeholder="e.g. User name, Casting call title, or message thread"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Reason for Report dropdown matching wireframe */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Reason for Report:
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
              >
                <option value="Unprofessional Audition Conduct">Unprofessional Audition Conduct</option>
                <option value="Fee Solicitation During Audition">Fee Solicitation During Audition</option>
                <option value="Non-Consensual Communication">Non-Consensual Communication</option>
                <option value="Misrepresentation of Production">Misrepresentation of Production</option>
                <option value="Safety & Intimacy Policy Breach">Safety & Intimacy Policy Breach</option>
                <option value="Other Policy Violation">Other Policy Violation</option>
              </select>
            </div>

            {/* Description textarea matching wireframe */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Description:
              </label>
              <textarea
                rows={5}
                required
                placeholder="Provide specific dates, locations, message excerpts, or context regarding this report..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 leading-relaxed"
              />
            </div>

            {/* Attach Files & Send matching wireframe */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                <Paperclip className="w-3.5 h-3.5 text-[#4C1D95] dark:text-[#FEC524]" />
                <span>{attachedFileName ? `Attached: ${attachedFileName}` : 'Attach Files (Screenshot/PDF)'}</span>
                <input type="file" onChange={handleFileUpload} className="hidden" />
              </label>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </form>
        )}

      </div>

    </div>
  );
};
