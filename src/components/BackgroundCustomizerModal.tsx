import React, { useState } from 'react';
import { useTheme, PRESET_THEMES } from '../context/ThemeContext.tsx';
import { X, Palette, Image as ImageIcon, Sliders, Sparkles, Upload, Sun, Moon, Check } from 'lucide-react';
import { HERO_THEATRE_IMAGE, ABOUT_THEATRE_IMAGE } from '../data/mockData.ts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const BackgroundCustomizerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, applyPreset, resetToDefault } = useTheme();

  const [activeTab, setActiveTab] = useState<'presets' | 'color' | 'gradient' | 'image' | 'adjust'>('presets');
  const [customColor, setCustomColor] = useState<string>(settings.solidColor || '#4C1D95');
  const [gradStart, setGradStart] = useState<string>(settings.gradientStart || '#4C1D95');
  const [gradEnd, setGradEnd] = useState<string>(settings.gradientEnd || '#120422');
  const [gradAngle, setGradAngle] = useState<number>(settings.gradientAngle || 135);
  const [customImageUrl, setCustomImageUrl] = useState<string>(settings.imageUrl || '');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setCustomImageUrl(result);
        updateSettings({
          mode: 'image',
          imageUrl: result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const applyCustomColor = (color: string) => {
    setCustomColor(color);
    updateSettings({
      mode: 'color',
      solidColor: color,
    });
  };

  const applyCustomGradient = (start: string, end: string, angle: number) => {
    setGradStart(start);
    setGradEnd(end);
    setGradAngle(angle);
    updateSettings({
      mode: 'gradient',
      gradientStart: start,
      gradientEnd: end,
      gradientAngle: angle,
    });
  };

  const applyImageUrl = (url: string) => {
    setCustomImageUrl(url);
    updateSettings({
      mode: 'image',
      imageUrl: url,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--ecu-purple,#4C1D95)] flex items-center justify-center text-[#FEC524]">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display leading-tight">Customize Your Background</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Personalize your ECU Performer Connect stage environment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50 dark:bg-slate-950/40 overflow-x-auto gap-2 py-2">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'presets'
                ? 'bg-[var(--ecu-purple,#4C1D95)] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FEC524]" />
            ECU Presets
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'image'
                ? 'bg-[var(--ecu-purple,#4C1D95)] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Custom Image / Photo
          </button>
          <button
            onClick={() => setActiveTab('color')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'color'
                ? 'bg-[var(--ecu-purple,#4C1D95)] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            Solid Color
          </button>
          <button
            onClick={() => setActiveTab('gradient')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'gradient'
                ? 'bg-[var(--ecu-purple,#4C1D95)] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            Gradient
          </button>
          <button
            onClick={() => setActiveTab('adjust')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'adjust'
                ? 'bg-[var(--ecu-purple,#4C1D95)] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Contrast & Blur
          </button>
        </div>

        {/* Tab contents */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose an authentic East Carolina University theatre preset designed for high readability and stage presence:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRESET_THEMES.map((preset) => {
                  const isSelected = settings.mode === 'preset' && settings.presetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => applyPreset(preset.id)}
                      className={`text-left p-3.5 rounded-xl border transition-all relative overflow-hidden group ${
                        isSelected
                          ? 'border-[#FEC524] ring-2 ring-[#FEC524]/40 bg-purple-50/20 dark:bg-purple-950/30'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-white dark:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${preset.previewClass} border border-white/20 shrink-0 shadow-inner flex items-center justify-center`}
                        >
                          {isSelected && <Check className="w-5 h-5 text-[#FEC524]" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold truncate text-slate-900 dark:text-white">
                              {preset.name}
                            </span>
                            {preset.style.isDark ? (
                              <Moon className="w-3 h-3 text-slate-400" />
                            ) : (
                              <Sun className="w-3 h-3 text-amber-500" />
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {preset.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'image' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Curated ECU Theatre & Stage Backdrops
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { name: 'Grand Theatre Auditorium', url: HERO_THEATRE_IMAGE },
                    { name: 'Live Rehearsal Stage', url: ABOUT_THEATRE_IMAGE },
                    {
                      name: 'Atmospheric Stage Light',
                      url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1600&auto=format&fit=crop&q=80',
                    },
                    {
                      name: 'Moody Velvet Curtains',
                      url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80',
                    },
                    {
                      name: 'Broadway Stage Spotlights',
                      url: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?w=1600&auto=format&fit=crop&q=80',
                    },
                  ].map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => applyImageUrl(img.url)}
                      className={`group relative rounded-xl overflow-hidden border aspect-video transition-all ${
                        settings.mode === 'image' && settings.imageUrl === img.url
                          ? 'border-[#FEC524] ring-2 ring-[#FEC524]'
                          : 'border-slate-200 dark:border-slate-800 hover:border-[#4C1D95]'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2">
                        <span className="text-[11px] font-medium text-white truncate">{img.name}</span>
                      </div>
                      {settings.mode === 'image' && settings.imageUrl === img.url && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-[#FEC524] rounded-full flex items-center justify-center text-slate-900 shadow">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload or custom URL */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Use Your Own Photo or Wallpaper
                  </span>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[var(--ecu-purple,#4C1D95)] text-white rounded-lg hover:bg-[#3B0764] transition-colors">
                    <Upload className="w-3.5 h-3.5 text-[#FEC524]" />
                    Upload Image
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Or paste any image URL (e.g. https://...)"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#FEC524]"
                  />
                  <button
                    onClick={() => applyImageUrl(customImageUrl)}
                    className="px-4 py-2 text-xs font-semibold bg-[#FEC524] text-slate-900 rounded-lg hover:bg-[#e6b11e] transition-colors"
                  >
                    Apply URL
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'color' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose any solid color background for your stage experience:
              </p>

              {/* Color swatches */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'ECU Royal Purple', color: '#4C1D95' },
                  { label: 'Deep Plum', color: '#2C0D4A' },
                  { label: 'Royal Violet', color: '#3E1B63' },
                  { label: 'ECU Gold Muted', color: '#80620A' },
                  { label: 'Midnight Slate', color: '#0F172A' },
                  { label: 'Rich Charcoal', color: '#18181B' },
                  { label: 'Dark Burgundy', color: '#3A0B1A' },
                  { label: 'Forest Green', color: '#0B291A' },
                  { label: 'Studio Cream', color: '#F8F6F0' },
                  { label: 'Crisp White', color: '#FFFFFF' },
                ].map((swatch) => (
                  <button
                    key={swatch.color}
                    onClick={() => applyCustomColor(swatch.color)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      settings.mode === 'color' && settings.solidColor?.toLowerCase() === swatch.color.toLowerCase()
                        ? 'border-[#FEC524] ring-2 ring-[#FEC524]/50'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/20"
                      style={{ backgroundColor: swatch.color }}
                    />
                    {swatch.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => applyCustomColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-700 bg-transparent p-0.5"
                />
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Custom Hex Color
                  </label>
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => applyCustomColor(e.target.value)}
                    className="w-32 px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gradient' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create a bespoke two-color linear gradient:
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Start Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={gradStart}
                      onChange={(e) => applyCustomGradient(e.target.value, gradEnd, gradAngle)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={gradStart}
                      onChange={(e) => applyCustomGradient(e.target.value, gradEnd, gradAngle)}
                      className="w-24 px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">End Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={gradEnd}
                      onChange={(e) => applyCustomGradient(gradStart, e.target.value, gradAngle)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={gradEnd}
                      onChange={(e) => applyCustomGradient(gradStart, e.target.value, gradAngle)}
                      className="w-24 px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                  <span>Gradient Angle</span>
                  <span className="font-mono">{gradAngle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={gradAngle}
                  onChange={(e) => applyCustomGradient(gradStart, gradEnd, Number(e.target.value))}
                  className="w-full accent-[#FEC524]"
                />
              </div>

              <div
                className="h-16 rounded-xl border border-slate-300 dark:border-slate-700 shadow-inner flex items-center justify-center text-xs font-medium text-white/90 drop-shadow"
                style={{
                  background: `linear-gradient(${gradAngle}deg, ${gradStart} 0%, ${gradEnd} 100%)`,
                }}
              >
                Live Gradient Preview
              </div>
            </div>
          )}

          {activeTab === 'adjust' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Background Dimming / Tinting</span>
                  <span className="font-mono">{Math.round(settings.overlayOpacity * 100)}%</span>
                </div>
                <p className="text-xs text-slate-500">
                  Adds a dark protective layer so white and gold text is always easy to read over any photo or bright backdrop.
                </p>
                <input
                  type="range"
                  min="0"
                  max="0.8"
                  step="0.05"
                  value={settings.overlayOpacity}
                  onChange={(e) => updateSettings({ overlayOpacity: Number(e.target.value) })}
                  className="w-full accent-[#FEC524]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Background Soft Blur</span>
                  <span className="font-mono">{settings.blurAmount}px</span>
                </div>
                <p className="text-xs text-slate-500">
                  Applies subtle optical depth of field to custom wallpapers to reduce visual distractions.
                </p>
                <input
                  type="range"
                  min="0"
                  max="16"
                  step="1"
                  value={settings.blurAmount}
                  onChange={(e) => updateSettings({ blurAmount: Number(e.target.value) })}
                  className="w-full accent-[#FEC524]"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                    UI Theme Mode
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Switch between Dark Stage and Light Stage UI components
                  </span>
                </div>
                <button
                  onClick={() => updateSettings({ isDarkTheme: !settings.isDarkTheme })}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  {settings.isDarkTheme ? (
                    <>
                      <Moon className="w-3.5 h-3.5 text-[#FEC524]" />
                      Dark Mode Active
                    </>
                  ) : (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      Light Mode Active
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={resetToDefault}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline font-medium"
          >
            Reset to ECU White & Purple Default
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-lg bg-[var(--ecu-purple,#4C1D95)] text-white hover:bg-[#3B0764] shadow-md transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-[#FEC524]" />
            Done & Keep Background
          </button>
        </div>

      </div>
    </div>
  );
};
