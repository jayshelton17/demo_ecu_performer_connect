import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { useTheme, PRESET_THEMES, PURPLE_SHADES } from '../context/ThemeContext.tsx';
import {
  Palette,
  Bell,
  Lock,
  Sparkles,
  Image as ImageIcon,
  Sliders,
  Upload,
  Check,
  RefreshCw,
  Sun,
  Moon,
  Eye,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react';
import { ThemePresetId } from '../types.ts';

export const Settings: React.FC = () => {
  const {
    settingsSubTab,
    setSettingsSubTab,
    currentUser,
    updateUserProfile,
    showNotification,
    setIsCustomizerOpen,
  } = useApp();

  const { settings, updateSettings, applyPreset, setPurpleShade, resetToDefault, getBackgroundCSS } = useTheme();

  // Appearance Local Form State
  const [selectedPreset, setSelectedPreset] = useState<ThemePresetId>(settings.presetId);
  const [displayMode, setDisplayMode] = useState<string>(settings.mode);
  const [customColor, setCustomColor] = useState<string>(settings.solidColor || '#4C1D95');
  const [gradStart, setGradStart] = useState<string>(settings.gradientStart || '#4C1D95');
  const [gradEnd, setGradEnd] = useState<string>(settings.gradientEnd || '#120422');
  const [gradAngle, setGradAngle] = useState<number>(settings.gradientAngle ?? 135);
  const [imageUrl, setImageUrl] = useState<string>(settings.imageUrl || '');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(settings.overlayOpacity ?? 0.15);
  const [blurAmount, setBlurAmount] = useState<number>(settings.blurAmount ?? 0);
  const [isDark, setIsDark] = useState<boolean>(settings.isDarkTheme);

  // Notifications State
  const [msgNotify, setMsgNotify] = useState(true);
  const [emailNotify, setEmailNotify] = useState(true);
  const [auditionAlerts, setAuditionAlerts] = useState(true);

  // Account State
  const [email, setEmail] = useState(currentUser.email);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImageUrl(result);
        updateSettings({
          mode: 'image',
          imageUrl: result,
        });
        setDisplayMode('image');
        showNotification('Custom wallpaper uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAppearance = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      mode: displayMode as any,
      solidColor: customColor,
      gradientStart: gradStart,
      gradientEnd: gradEnd,
      gradientAngle: gradAngle,
      imageUrl,
      overlayOpacity,
      blurAmount,
      isDarkTheme: isDark,
    });
    if (displayMode === 'preset') {
      applyPreset(selectedPreset);
    }
    showNotification('Appearance and background settings saved!');
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification('Notification preferences saved successfully!');
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ email });
    showNotification('Account information updated!');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold font-display text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your interface appearance, custom background, notifications, and ECU account security
        </p>
      </div>

      {/* Settings Layout with Sidebar matching wireframes (Settings__Appearance, Notifications, Account) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Sidebar matching wireframe: Appearance | Notifications | Account */}
        <div className="md:col-span-3 p-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 h-fit">
          <span className="font-bold text-xs uppercase tracking-wider text-slate-400 px-3 py-1 block">
            Settings
          </span>

          <button
            onClick={() => setSettingsSubTab('appearance')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
              settingsSubTab === 'appearance'
                ? 'bg-[var(--ecu-purple,#4C1D95)] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Palette className="w-4 h-4 text-[#FEC524]" />
            <span>Appearance & Background</span>
          </button>

          <button
            onClick={() => setSettingsSubTab('notifications')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
              settingsSubTab === 'notifications'
                ? 'bg-[var(--ecu-purple,#4C1D95)] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>

          <button
            onClick={() => setSettingsSubTab('account')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
              settingsSubTab === 'account'
                ? 'bg-[var(--ecu-purple,#4C1D95)] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Account & Security</span>
          </button>
        </div>

        {/* Content Pane */}
        <div className="md:col-span-9 p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
          
          {/* TAB 1: Appearance & Background Customizer */}
          {settingsSubTab === 'appearance' && (
            <form onSubmit={handleSaveAppearance} className="space-y-8">
              
              {/* Header */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                    <Palette className="w-5 h-5 text-[var(--ecu-purple,#4C1D95)] dark:text-[#FEC524]" />
                    <span>Appearance & Background</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Customize your ECU Purple tone, wallpaper background, lighting mode, and visual contrast
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCustomizerOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-all flex items-center gap-1.5"
                    title="Open live floating overlay studio"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Live Overlay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDark(!isDark);
                      updateSettings({ isDarkTheme: !isDark });
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5"
                  >
                    {isDark ? <Sun className="w-3.5 h-3.5 text-[#FEC524]" /> : <Moon className="w-3.5 h-3.5 text-purple-600" />}
                    <span>{isDark ? 'Light Stage' : 'Dark Stage'}</span>
                  </button>
                </div>
              </div>

              {/* SECTION 1: ECU PURPLE ACCENT TONE (Direct response to user request) */}
              <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs uppercase tracking-wider text-[var(--ecu-purple,#4C1D95)] dark:text-[#FEC524] block">
                      ECU Purple Accent & Brand Tone
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Select your preferred purple shade across navigation, buttons, badges, and headers.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                  {(Object.keys(PURPLE_SHADES) as Array<keyof typeof PURPLE_SHADES>).map((shadeKey) => {
                    const shade = PURPLE_SHADES[shadeKey];
                    const isSelected = (settings.purpleShade || 'royal') === shadeKey;
                    return (
                      <button
                        type="button"
                        key={shadeKey}
                        onClick={() => {
                          setPurpleShade(shadeKey);
                          showNotification(`Switched brand purple to ${shade.name}`);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all relative ${
                          isSelected
                            ? 'border-[#FEC524] ring-2 ring-[#FEC524]/50 bg-white dark:bg-slate-800 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div
                            className="w-6 h-6 rounded-full shadow-sm border border-white/50"
                            style={{ backgroundColor: shade.primary }}
                          />
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-[#FEC524] text-slate-950'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            {shade.badge}
                          </span>
                        </div>
                        <span className="font-bold text-xs text-slate-900 dark:text-white block">
                          {shade.name}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                          {shade.description}
                        </span>
                        {isSelected && (
                          <div className="absolute top-2 right-2 text-emerald-500">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: BACKGROUND CANVAS & WALLPAPER CHOOSER */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-500 block">
                    Background Canvas & Wallpaper
                  </span>
                  
                  {/* Mode Selector Tabs */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setDisplayMode('preset');
                        updateSettings({ mode: 'preset' });
                      }}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        displayMode === 'preset'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      Presets
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDisplayMode('image');
                        updateSettings({ mode: 'image' });
                      }}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        displayMode === 'image'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      Image / Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDisplayMode('color');
                        updateSettings({ mode: 'color' });
                      }}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        displayMode === 'color'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      Solid Color
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDisplayMode('gradient');
                        updateSettings({ mode: 'gradient' });
                      }}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        displayMode === 'gradient'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      Gradient
                    </button>
                  </div>
                </div>

                {/* MODE 1: PRESETS */}
                {displayMode === 'preset' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {PRESET_THEMES.map((preset) => {
                      const isSelected = settings.presetId === preset.id && settings.mode === 'preset';
                      return (
                        <button
                          type="button"
                          key={preset.id}
                          onClick={() => {
                            setSelectedPreset(preset.id);
                            applyPreset(preset.id);
                            setIsDark(preset.style.isDark);
                            setOverlayOpacity(preset.style.overlay);
                            setBlurAmount(preset.style.blur);
                          }}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'border-[#FEC524] ring-2 ring-[#FEC524]/50 bg-purple-50/30 dark:bg-purple-950/30 shadow-sm'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 bg-white/50 dark:bg-slate-900/50'
                          }`}
                        >
                          <div
                            className={`w-full h-14 rounded-xl bg-gradient-to-br ${preset.previewClass} mb-2 shadow-inner border border-white/20`}
                          />
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900 dark:text-white block truncate">
                              {preset.name}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#FEC524] shrink-0" />}
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {preset.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* MODE 2: CUSTOM IMAGE & FILE UPLOAD */}
                {displayMode === 'image' && (
                  <div className="space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* File Upload */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                          Upload Wallpaper from Device:
                        </label>
                        <label className="cursor-pointer flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-[var(--ecu-purple,#4C1D95)] transition-colors bg-white dark:bg-slate-900 text-center">
                          <Upload className="w-5 h-5 text-slate-400 mb-1" />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Choose Image File
                          </span>
                          <span className="text-[10px] text-slate-400">PNG, JPG, WebP supported</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Image URL input */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                          Or Enter Web Image URL:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="https://images.unsplash.com/..."
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              updateSettings({ mode: 'image', imageUrl });
                              setDisplayMode('image');
                              showNotification('Image URL applied as background!');
                            }}
                            className="px-3 py-2 rounded-xl bg-[var(--ecu-purple,#4C1D95)] text-white text-xs font-bold hover:opacity-90"
                          >
                            Apply
                          </button>
                        </div>

                        {/* Curated ECU Campus & Theatrical Presets */}
                        <div className="pt-2">
                          <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                            Quick Theatrical Photos:
                          </span>
                          <div className="flex gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={() => {
                                const url = '/src/assets/images/hero_ecu_theatre_1793805612830.jpg';
                                setImageUrl(url);
                                updateSettings({ mode: 'image', imageUrl: url });
                              }}
                              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:border-purple-400"
                            >
                              ECU Mainstage Hall
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const url = '/src/assets/images/about_theatre_rehearsal_1793805614102.jpg';
                                setImageUrl(url);
                                updateSettings({ mode: 'image', imageUrl: url });
                              }}
                              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:border-purple-400"
                            >
                              Rehearsal Studio
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODE 3: SOLID COLOR */}
                {displayMode === 'color' && (
                  <div className="space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={customColor}
                          onChange={(e) => {
                            setCustomColor(e.target.value);
                            updateSettings({ mode: 'color', solidColor: e.target.value });
                          }}
                          className="w-12 h-12 rounded-xl cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-white"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                            Pick Custom Color
                          </span>
                          <span className="text-xs font-mono text-slate-500 uppercase">{customColor}</span>
                        </div>
                      </div>

                      {/* Swatches */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {[
                          { label: 'Royal Amethyst', color: '#4C1D95' },
                          { label: 'Electric Violet', color: '#6D28D9' },
                          { label: 'Velvet Plum', color: '#3B0764' },
                          { label: 'ECU Gold', color: '#FEC524' },
                          { label: 'Theatrical Charcoal', color: '#18181B' },
                          { label: 'Deep Slate', color: '#0F172A' },
                          { label: 'Studio White', color: '#FFFFFF' },
                        ].map((swatch) => (
                          <button
                            type="button"
                            key={swatch.color}
                            onClick={() => {
                              setCustomColor(swatch.color);
                              updateSettings({ mode: 'color', solidColor: swatch.color });
                            }}
                            className={`w-7 h-7 rounded-lg border transition-all ${
                              customColor.toLowerCase() === swatch.color.toLowerCase()
                                ? 'ring-2 ring-[#FEC524] scale-110'
                                : 'border-slate-300 dark:border-slate-600 hover:scale-105'
                            }`}
                            style={{ backgroundColor: swatch.color }}
                            title={swatch.label}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* MODE 4: CUSTOM GRADIENT */}
                {displayMode === 'gradient' && (
                  <div className="space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Gradient Start Color:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={gradStart}
                            onChange={(e) => {
                              setGradStart(e.target.value);
                              updateSettings({ mode: 'gradient', gradientStart: e.target.value, gradientEnd: gradEnd, gradientAngle: gradAngle });
                            }}
                            className="w-9 h-9 rounded-lg cursor-pointer bg-white"
                          />
                          <span className="text-xs font-mono text-slate-500 uppercase">{gradStart}</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Gradient End Color:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={gradEnd}
                            onChange={(e) => {
                              setGradEnd(e.target.value);
                              updateSettings({ mode: 'gradient', gradientStart: gradStart, gradientEnd: e.target.value, gradientAngle: gradAngle });
                            }}
                            className="w-9 h-9 rounded-lg cursor-pointer bg-white"
                          />
                          <span className="text-xs font-mono text-slate-500 uppercase">{gradEnd}</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Angle:
                          </label>
                          <span className="text-xs font-mono text-slate-500">{gradAngle}°</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={360}
                          value={gradAngle}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setGradAngle(val);
                            updateSettings({ mode: 'gradient', gradientAngle: val, gradientStart: gradStart, gradientEnd: gradEnd });
                          }}
                          className="w-full accent-[var(--ecu-purple,#4C1D95)]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 3: CONTRAST OVERLAY & BLUR ADJUSTERS */}
              <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-500 block">
                  Readability & Visual Effects
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Overlay Dimmer */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        Dimming Overlay (Text Contrast):
                      </span>
                      <span className="font-mono text-slate-500">{Math.round(overlayOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={0.9}
                      step={0.05}
                      value={overlayOpacity}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setOverlayOpacity(val);
                        updateSettings({ overlayOpacity: val });
                      }}
                      className="w-full accent-[var(--ecu-purple,#4C1D95)]"
                    />
                    <p className="text-[11px] text-slate-400">
                      Dims background wallpaper to ensure WCAG AA readability for scripts & resumes.
                    </p>
                  </div>

                  {/* Backdrop Blur */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        Backdrop Blur Intensity:
                      </span>
                      <span className="font-mono text-slate-500">{blurAmount}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={24}
                      step={1}
                      value={blurAmount}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setBlurAmount(val);
                        updateSettings({ blurAmount: val });
                      }}
                      className="w-full accent-[var(--ecu-purple,#4C1D95)]"
                    />
                    <p className="text-[11px] text-slate-400">
                      Creates a smooth frosted-glass depth effect behind theatrical cards.
                    </p>
                  </div>
                </div>
              </div>

              {/* Save Changes & Reset button bar */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    resetToDefault();
                    setSelectedPreset('white-purple');
                    setDisplayMode('preset');
                    setCustomColor('#FFFFFF');
                    setGradStart('#FFFFFF');
                    setGradEnd('#FAF8FD');
                    setGradAngle(180);
                    setImageUrl('');
                    setOverlayOpacity(0);
                    setBlurAmount(0);
                    setIsDark(false);
                    showNotification('Appearance reset to default ECU White & Purple!');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:underline flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset to Defaults</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[var(--ecu-purple,#4C1D95)] text-white hover:opacity-90 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-[#FEC524]" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: Notifications matching Settings__Notifications__4cde4914.png */}
          {settingsSubTab === 'notifications' && (
            <form onSubmit={handleSaveNotifications} className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  Notifications
                </h2>
                <p className="text-xs text-slate-500">
                  Select how you want to be alerted for audition callbacks and messages
                </p>
              </div>

              <div className="space-y-5 text-xs">
                {/* Messages Notification matching wireframe */}
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block text-sm">
                    Messages Notification
                  </span>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={msgNotify}
                      onChange={(e) => setMsgNotify(e.target.checked)}
                      className="w-4 h-4 rounded text-[#4C1D95] focus:ring-[#FEC524]"
                    />
                    <span className="text-slate-600 dark:text-slate-300">
                      Notify me when I receive a new message.
                    </span>
                  </label>
                </div>

                {/* Email Notifications matching wireframe */}
                <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block text-sm">
                    Email Notifications
                  </span>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotify}
                      onChange={(e) => setEmailNotify(e.target.checked)}
                      className="w-4 h-4 rounded text-[#4C1D95] focus:ring-[#FEC524]"
                    />
                    <span className="text-slate-600 dark:text-slate-300">
                      Send notifications to my email ({currentUser.email}).
                    </span>
                  </label>
                </div>

                {/* Audition Alerts */}
                <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block text-sm">
                    Audition & Callback Alerts
                  </span>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={auditionAlerts}
                      onChange={(e) => setAuditionAlerts(e.target.checked)}
                      className="w-4 h-4 rounded text-[#4C1D95] focus:ring-[#FEC524]"
                    />
                    <span className="text-slate-600 dark:text-slate-300">
                      Alert me immediately when a callback stage requires action or sides.
                    </span>
                  </label>
                </div>
              </div>

              {/* Save Changes button matching wireframe */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#4C1D95] text-white hover:bg-[#3B0764] text-xs font-bold transition-all shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: Account & Security matching Settings__Account__c0dcab75.png */}
          {settingsSubTab === 'account' && (
            <form onSubmit={handleSaveAccount} className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  Account & Security
                </h2>
                <p className="text-xs text-slate-500">
                  Manage your ECU login credentials, profile visibility, and privacy
                </p>
              </div>

              <div className="space-y-5 text-xs max-w-lg">
                {/* Email input matching wireframe */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Email:
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  />
                </div>

                {/* Password field with Change Password button matching wireframe */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Password:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      disabled
                      value="••••••••••••••••"
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-slate-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-100 font-bold shrink-0 transition-colors"
                    >
                      Change Password
                    </button>
                  </div>
                </div>

                {/* Account privacy section matching wireframe */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <span className="font-bold text-sm text-slate-900 dark:text-white block">
                    Account Privacy
                  </span>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      className="w-4 h-4 rounded text-[#4C1D95] focus:ring-[#FEC524]"
                    />
                    <span className="text-slate-600 dark:text-slate-300">
                      Set account to private (Others cannot see your profile).
                    </span>
                  </label>
                </div>

                {/* Delete Account button matching wireframe */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Are you sure you want to deactivate your ECU Performer Connect account?')) {
                        showNotification('Account deactivation requested. Our admin team will process it.');
                      }
                    }}
                    className="px-4 py-2 rounded-xl border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-bold flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Account
                  </button>
                </div>
              </div>

              {/* Save Changes button matching wireframe */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#4C1D95] text-white hover:bg-[#3B0764] text-xs font-bold transition-all shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

        </div>

      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Change ECU Password</h3>
            <div className="space-y-3">
              <div>
                <label className="font-semibold block mb-1">New Password:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Confirm New Password:</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (newPassword && newPassword === confirmPassword) {
                    showNotification('Password updated successfully');
                    setIsPasswordModalOpen(false);
                    setNewPassword('');
                    setConfirmPassword('');
                  } else {
                    alert('Passwords do not match');
                  }
                }}
                className="px-5 py-2 rounded-lg bg-[#4C1D95] text-white font-bold"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
