import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Lock, Mail, User, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  initialMode?: 'login' | 'register';
}

export const Auth: React.FC<Props> = ({ initialMode = 'login' }) => {
  const { setCurrentView, switchUserPersona, users, showNotification } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('vancee22@students.ecu.edu');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register form state
  const [regFirst, setRegFirst] = useState('');
  const [regLast, setRegLast] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = users.find((u) => u.email.toLowerCase() === loginEmail.toLowerCase());
    if (matched) {
      switchUserPersona(matched.id);
    } else {
      showNotification(`Signed in as ${loginEmail}`);
    }
    setCurrentView('home');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      alert('Passwords do not match');
      return;
    }
    showNotification(`Welcome to ECU Performer Connect, ${regFirst}!`);
    setCurrentView('home');
  };

  return (
    <div className="max-w-md mx-auto py-8 pb-16 space-y-6">
      
      {/* Brand header */}
      <div className="text-center space-y-2">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-[#4C1D95] border-2 border-[#FEC524] items-center justify-center shadow-lg">
          <span className="font-display font-extrabold text-[#FEC524] text-lg">ECU</span>
        </div>
        <h1 className="text-3xl font-extrabold font-display text-slate-900 dark:text-white">
          {mode === 'login' ? 'Login' : 'Create Account'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {mode === 'login'
            ? 'Welcome back! Log in to your account'
            : 'Create an account to get started'}
        </p>
      </div>

      {/* Main Auth Card directly matching wireframes */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
        
        {mode === 'login' ? (
          /* LOGIN FORM (Login_b34cbd56.png) */
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@students.ecu.edu"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to your ECU student email.')}
                  className="text-[11px] text-[#4C1D95] dark:text-[#FEC524] hover:underline italic"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#4C1D95] text-white hover:bg-[#3B0764] text-xs font-bold transition-all shadow-md"
              >
                Log In
              </button>
            </div>

            <div className="text-center pt-3 border-t border-slate-100 dark:border-slate-800 text-slate-500">
              <span>Don't have an account? </span>
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-bold text-[#4C1D95] dark:text-[#FEC524] hover:underline ml-1"
              >
                Register
              </button>
            </div>
          </form>
        ) : (
          /* REGISTRATION FORM (Registration_f2c67afb.png) */
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Elena"
                  value={regFirst}
                  onChange={(e) => setRegFirst(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Vance"
                  value={regLast}
                  onChange={(e) => setRegLast(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="pirate@students.ecu.edu"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Create a password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                required
                placeholder="Confirm your password"
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#4C1D95] text-white hover:bg-[#3B0764] text-xs font-bold transition-all shadow-md"
              >
                Create Account
              </button>
            </div>

            <div className="text-center pt-3 border-t border-slate-100 dark:border-slate-800 text-slate-500">
              <span>Already have an account? </span>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-[#4C1D95] dark:text-[#FEC524] hover:underline ml-1"
              >
                Login
              </button>
            </div>
          </form>
        )}

      </div>

      {/* Instant Demo Persona Switcher */}
      <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-center space-y-2 text-xs">
        <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
          One-Click Demo Personas
        </span>
        <div className="flex flex-wrap gap-2 justify-center">
          {users.slice(0, 3).map((u) => (
            <button
              key={u.id}
              onClick={() => {
                switchUserPersona(u.id);
                setCurrentView('home');
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#FEC524] text-[11px] font-semibold text-slate-800 dark:text-slate-200"
            >
              Log in as {u.name.split(' ')[0]} ({u.role.split(' ')[0]})
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
