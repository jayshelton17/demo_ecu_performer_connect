/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext.tsx';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { BackgroundCustomizerModal } from './components/BackgroundCustomizerModal.tsx';

// Pages
import { Home } from './pages/Home.tsx';
import { SearchPeople } from './pages/SearchPeople.tsx';
import { ProfileView } from './pages/ProfileView.tsx';
import { CastingCalls } from './pages/CastingCalls.tsx';
import { CastingCallDetails } from './pages/CastingCallDetails.tsx';
import { CreateCastingCall } from './pages/CreateCastingCall.tsx';
import { MyApplications } from './pages/MyApplications.tsx';
import { ApplicantReview } from './pages/ApplicantReview.tsx';
import { Messages } from './pages/Messages.tsx';
import { Favorites } from './pages/Favorites.tsx';
import { Settings } from './pages/Settings.tsx';
import { Admin } from './pages/Admin.tsx';
import { AboutUs } from './pages/AboutUs.tsx';
import { ContactUs } from './pages/ContactUs.tsx';
import { ReportUser } from './pages/ReportUser.tsx';
import { Terms } from './pages/Terms.tsx';
import { Auth } from './pages/Auth.tsx';

// Mobile bottom bar icons
import { Home as HomeIcon, Search, Clapperboard, MessageSquare, Settings as SettingsIcon } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentView, setCurrentView, isCustomizerOpen, setIsCustomizerOpen, notificationMessage } = useApp();
  const { settings, getBackgroundCSS } = useTheme();

  const backgroundStyles = getBackgroundCSS();

  return (
    <div
      className="min-h-screen flex flex-col relative transition-all duration-300 font-sans"
      style={backgroundStyles}
    >
      {/* Background Dimming & Blur Overlay to guarantee WCAG AA text contrast */}
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-300 z-0"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${settings.overlayOpacity})`,
          backdropFilter: settings.blurAmount > 0 ? `blur(${settings.blurAmount}px)` : undefined,
          WebkitBackdropFilter: settings.blurAmount > 0 ? `blur(${settings.blurAmount}px)` : undefined,
        }}
      />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Global Toast Notification */}
        {notificationMessage && (
          <div className="fixed bottom-20 sm:bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300 max-w-sm">
            <div className="px-4 py-3 rounded-2xl bg-[var(--ecu-purple,#4C1D95)] text-white border border-[#FEC524] shadow-2xl text-xs font-semibold flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#FEC524] shrink-0" />
              <span>{notificationMessage}</span>
            </div>
          </div>
        )}

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-20 sm:pb-12">
          {currentView === 'home' && <Home />}
          {currentView === 'search' && <SearchPeople />}
          {currentView === 'profile' && <ProfileView />}
          {currentView === 'casting-calls' && <CastingCalls />}
          {currentView === 'casting-call-details' && <CastingCallDetails />}
          {currentView === 'create-casting-call' && <CreateCastingCall />}
          {currentView === 'my-applications' && <MyApplications />}
          {currentView === 'applicant-review' && <ApplicantReview />}
          {(currentView === 'messages' || currentView === 'message-details') && <Messages />}
          {(currentView === 'favorites' || currentView === 'favorite-group-details') && <Favorites />}
          {currentView === 'settings' && <Settings />}
          {currentView === 'admin' && <Admin />}
          {currentView === 'about-us' && <AboutUs />}
          {currentView === 'contact-us' && <ContactUs />}
          {currentView === 'report-user' && <ReportUser />}
          {currentView === 'terms' && <Terms />}
          {currentView === 'login' && <Auth initialMode="login" />}
          {currentView === 'register' && <Auth initialMode="register" />}
        </main>

        <Footer />

        {/* Mobile Bottom Thumb Navigation for full responsive mobile experience */}
        <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-md px-2 py-1.5 flex items-center justify-around shadow-lg">
          <button
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center py-1 px-2 text-[10px] font-bold ${
              currentView === 'home' ? 'text-[var(--ecu-purple,#4C1D95)] dark:text-[#FEC524]' : 'text-slate-500'
            }`}
          >
            <HomeIcon className="w-4 h-4 mb-0.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setCurrentView('search')}
            className={`flex flex-col items-center py-1 px-2 text-[10px] font-bold ${
              currentView === 'search' ? 'text-[var(--ecu-purple,#4C1D95)] dark:text-[#FEC524]' : 'text-slate-500'
            }`}
          >
            <Search className="w-4 h-4 mb-0.5" />
            <span>People</span>
          </button>

          <button
            onClick={() => setCurrentView('casting-calls')}
            className={`flex flex-col items-center py-1 px-2 text-[10px] font-bold ${
              currentView === 'casting-calls' ? 'text-[var(--ecu-purple,#4C1D95)] dark:text-[#FEC524]' : 'text-slate-500'
            }`}
          >
            <Clapperboard className="w-4 h-4 mb-0.5" />
            <span>Casting</span>
          </button>

          <button
            onClick={() => setCurrentView('messages')}
            className={`flex flex-col items-center py-1 px-2 text-[10px] font-bold ${
              currentView === 'messages' ? 'text-[var(--ecu-purple,#4C1D95)] dark:text-[#FEC524]' : 'text-slate-500'
            }`}
          >
            <MessageSquare className="w-4 h-4 mb-0.5" />
            <span>Messages</span>
          </button>

          <button
            onClick={() => setCurrentView('settings')}
            className={`flex flex-col items-center py-1 px-2 text-[10px] font-bold ${
              currentView === 'settings' ? 'text-[var(--ecu-purple,#4C1D95)] dark:text-[#FEC524]' : 'text-slate-500'
            }`}
          >
            <SettingsIcon className="w-4 h-4 mb-0.5" />
            <span>Settings</span>
          </button>
        </div>

        {/* Global Background Customizer Modal */}
        <BackgroundCustomizerModal
          isOpen={isCustomizerOpen}
          onClose={() => setIsCustomizerOpen(false)}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </ThemeProvider>
  );
}
