import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import {
  Search,
  ChevronDown,
  User,
  Heart,
  FileText,
  MessageSquare,
  Settings,
  Shield,
  Palette,
  LogOut,
  Menu,
  X,
  Sparkles,
  Users,
  Compass,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currentUser,
    switchUserPersona,
    users,
    searchQuery,
    setSearchQuery,
    setSelectedUserId,
    applications,
    messages,
    setIsCustomizerOpen,
    setAdminSubTab,
    setSettingsSubTab,
  } = useApp();

  const { settings } = useTheme();

  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const aboutRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) {
        setAboutDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('search');
    setMobileMenuOpen(false);
  };

  const pendingApplicationsCount = applications.filter(
    (a) => a.applicantId === currentUser.id && a.actionRequired
  ).length;

  const unreadMessagesCount = messages.filter((m) => m.unread).length;

  const canCreateCasting = Boolean(
    currentUser.role.toLowerCase().includes('director') ||
    currentUser.isFaculty ||
    currentUser.isAdmin
  );

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          
          {/* Zone 1: Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              {/* Collegiate Emblem / Theatre Mask Shield */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4C1D95] via-[#3B0764] to-[#120422] p-0.5 shadow-md flex items-center justify-center border border-[#FEC524]/60 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-[10px] bg-[#4C1D95] flex items-center justify-center relative overflow-hidden">
                  <span className="font-display font-extrabold text-sm text-[#FEC524] tracking-tight">ECU</span>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#FEC524] rotate-45 opacity-80" />
                </div>
              </div>

              <div className="hidden sm:block">
                <span className="font-display font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white leading-none block">
                  Performer <span className="text-[#4C1D95] dark:text-[#FEC524]">Connect</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400 block mt-0.5">
                  East Carolina University
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Find people search bar (wireframe element) */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg hidden md:block"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Find people (e.g. Elena, Soprano, Director, Actor)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-full text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FEC524] focus:bg-white dark:focus:bg-slate-900 transition-all shadow-inner"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>
          </form>

          {/* Zone 3: Navigation Links & User Menu */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            
            {/* Desktop Nav Links matching wireframes */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <button
                onClick={() => setCurrentView('home')}
                className={`transition-colors whitespace-nowrap hover:text-[#4C1D95] dark:hover:text-[#FEC524] ${
                  currentView === 'home' ? 'text-[#4C1D95] dark:text-[#FEC524] font-bold' : ''
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentView('casting-calls')}
                className={`transition-colors whitespace-nowrap hover:text-[#4C1D95] dark:hover:text-[#FEC524] ${
                  currentView === 'casting-calls' || currentView === 'casting-call-details'
                    ? 'text-[#4C1D95] dark:text-[#FEC524] font-bold'
                    : ''
                }`}
              >
                Casting Calls
              </button>

              {/* About dropdown */}
              <div className="relative" ref={aboutRef}>
                <button
                  onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                  className={`flex items-center gap-1 transition-colors whitespace-nowrap hover:text-[#4C1D95] dark:hover:text-[#FEC524] ${
                    ['about-us', 'contact-us', 'terms', 'report-user'].includes(currentView)
                      ? 'text-[#4C1D95] dark:text-[#FEC524] font-bold'
                      : ''
                  }`}
                >
                  About
                  <ChevronDown className="w-4 h-4 opacity-70" />
                </button>

                {aboutDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1 z-50 text-xs">
                    <button
                      onClick={() => {
                        setCurrentView('about-us');
                        setAboutDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-950/40 font-medium text-slate-700 dark:text-slate-200"
                    >
                      About Us
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView('contact-us');
                        setAboutDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-950/40 font-medium text-slate-700 dark:text-slate-200"
                    >
                      Contact Us
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView('report-user');
                        setAboutDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-950/40 font-medium text-red-600 dark:text-red-400"
                    >
                      Report Inappropriate Content
                    </button>
                    <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
                    <button
                      onClick={() => {
                        setCurrentView('terms');
                        setAboutDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-950/40 font-medium text-slate-700 dark:text-slate-200"
                    >
                      Terms & Conditions
                    </button>
                  </div>
                )}
              </div>
            </nav>

            {/* User Profile dropdown matching wireframe "Photo ▾" */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-[#FEC524] transition-all focus:outline-none"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-[#4C1D95] dark:border-[#FEC524] shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  {pendingApplicationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 text-[10px] font-extrabold rounded-full flex items-center justify-center">
                      !
                    </span>
                  )}
                  {unreadMessagesCount > 0 && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-purple-600 rounded-full border-2 border-white dark:border-slate-900" />
                  )}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 hidden sm:block" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl py-2 z-50 text-xs">
                  {/* Current User Card */}
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-[#4C1D95] dark:text-[#FEC524]">
                      {currentUser.role} {currentUser.isFaculty && '· Faculty'}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setSelectedUserId(currentUser.id);
                        setCurrentView('profile');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    >
                      <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span>My Profile (Resume & Media)</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentView('my-applications');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-amber-500" />
                        <span>My Applications</span>
                      </div>
                      {pendingApplicationsCount > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950">
                          Action Required
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setCurrentView('favorites');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    >
                      <Heart className="w-4 h-4 text-red-500" />
                      <span>Favorite Groups</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentView('messages');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    >
                      <div className="flex items-center gap-2.5">
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                        <span>Messages</span>
                      </div>
                      {unreadMessagesCount > 0 && (
                        <span className="w-2 h-2 rounded-full bg-purple-600" />
                      )}
                    </button>

                    {canCreateCasting && (
                      <button
                        onClick={() => {
                          setCurrentView('create-casting-call');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                      >
                        <Sparkles className="w-4 h-4 text-[#FEC524]" />
                        <span>Create Casting Call</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setSettingsSubTab('appearance');
                        setCurrentView('settings');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    >
                      <div className="flex items-center gap-2.5">
                        <Palette className="w-4 h-4 text-[#4C1D95] dark:text-[#FEC524]" />
                        <span>Settings & Background</span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">Appearance</span>
                    </button>

                    {/* Admin Portal access */}
                    <button
                      onClick={() => {
                        setAdminSubTab('dashboard');
                        setCurrentView('admin');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-[#4C1D95] dark:text-[#FEC524] font-semibold"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin Portal</span>
                    </button>
                  </div>

                  {/* Switch Persona for reviewer convenience */}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-2 pb-1 px-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Switch Demo Persona
                    </p>
                    <div className="space-y-1">
                      {users.slice(0, 3).map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchUserPersona(u.id);
                            setUserDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2 py-1 rounded text-[11px] flex items-center justify-between ${
                            u.id === currentUser.id
                              ? 'bg-[#4C1D95]/10 text-[#4C1D95] dark:text-[#FEC524] font-bold'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="truncate">{u.name}</span>
                          <span className="text-[9px] opacity-75">{u.role}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setCurrentView('login');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign In with another ECU account</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3">
          {/* Mobile search */}
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                placeholder="Find people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>
          </form>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              onClick={() => {
                setCurrentView('home');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg text-left bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              Home
            </button>
            <button
              onClick={() => {
                setCurrentView('search');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg text-left bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              Find People
            </button>
            <button
              onClick={() => {
                setCurrentView('casting-calls');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg text-left bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              Casting Calls
            </button>
            {canCreateCasting && (
              <button
                onClick={() => {
                  setCurrentView('create-casting-call');
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-lg text-left bg-[var(--ecu-purple,#4C1D95)] text-white font-bold"
              >
                + Create Casting
              </button>
            )}
            <button
              onClick={() => {
                setCurrentView('my-applications');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg text-left bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              My Applications
            </button>
            <button
              onClick={() => {
                setCurrentView('favorites');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg text-left bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              Favorites
            </button>
            <button
              onClick={() => {
                setCurrentView('messages');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg text-left bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              Messages
            </button>
            <button
              onClick={() => {
                setSettingsSubTab('appearance');
                setCurrentView('settings');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg text-left bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between"
            >
              <span>Settings</span>
              <span className="text-[10px] text-amber-500 font-bold">Theme</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('admin');
                setMobileMenuOpen(false);
              }}
              className="col-span-2 p-2.5 rounded-lg text-center bg-purple-50 dark:bg-purple-950/40 text-[var(--ecu-purple,#4C1D95)] dark:text-[#FEC524] font-bold border border-purple-200 dark:border-purple-800"
            >
              Admin Portal
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-500">
            <button onClick={() => { setCurrentView('about-us'); setMobileMenuOpen(false); }}>About Us</button>
            <button onClick={() => { setCurrentView('contact-us'); setMobileMenuOpen(false); }}>Contact Us</button>
            <button onClick={() => { setCurrentView('terms'); setMobileMenuOpen(false); }}>Terms</button>
            <button onClick={() => { setCurrentView('report-user'); setMobileMenuOpen(false); }} className="text-red-500">Report</button>
          </div>
        </div>
      )}
    </header>
  );
};
