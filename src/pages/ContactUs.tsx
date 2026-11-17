import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Send, ShieldAlert, Mail, MapPin, CheckCircle2 } from 'lucide-react';

export const ContactUs: React.FC = () => {
  const { setCurrentView, currentUser, showNotification } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setSubmitted(true);
    showNotification('Thank you! Your message has been sent to the ECU Performer Connect team.');
    setTimeout(() => {
      setSubject('');
      setMessage('');
      setSubmitted(false);
    }, 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      
      {/* Title directly matching Contact_Us_12603fe5.png */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white">
          We Want to Hear From You!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Have questions regarding auditions, technical issues, or School of Theatre & Dance inquiries?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Contact Form matching wireframe box */}
        <div className="md:col-span-8 p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h2 className="text-base font-bold font-display text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            Contact Us
          </h2>

          {submitted ? (
            <div className="p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Message Delivered</h3>
              <p className="text-xs text-slate-500">
                A representative from the Messick Performing Arts office will get back to you within 1-2 business days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Name:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email:</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Subject:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Question about Mainstage Spring auditions"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Message:</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Tell us how we can help you..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#4C1D95] text-white hover:bg-[#3B0764] font-bold text-xs shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-[#FEC524]" />
                  <span>Send</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Side Callout matching wireframe */}
        {/* "Need to report inappropriate content or behavior? [Report User]" */}
        <div className="md:col-span-4 p-6 rounded-3xl bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 space-y-4 text-xs">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>Safety & Ethics Notice</span>
          </div>

          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            Need to report inappropriate content or behavior? Our confidential reporting hotline connects directly to the Theatre & Dance Ethics Advisory Committee.
          </p>

          <button
            onClick={() => setCurrentView('report-user')}
            className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Report User / Casting</span>
          </button>

          <div className="pt-4 border-t border-red-200/60 dark:border-red-900/40 text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#4C1D95] dark:text-[#FEC524]" />
              <span>theatredance@ecu.edu</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#4C1D95] dark:text-[#FEC524]" />
              <span>Messick Theatre, Room 102</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
