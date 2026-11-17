import React, { createContext, useContext, useState, useEffect } from 'react';
import { BackgroundSettings, ThemePresetId } from '../types.ts';

export interface PresetOption {
  id: ThemePresetId;
  name: string;
  description: string;
  previewClass: string;
  style: {
    background: string;
    isDark: boolean;
    overlay: number;
    blur: number;
  };
}

export interface PurpleShadeConfig {
  id: 'royal' | 'electric' | 'velvet' | 'vintage';
  name: string;
  badge: string;
  primary: string;
  hover: string;
  light: string;
  subtle: string;
  description: string;
}

export const PURPLE_SHADES: Record<'royal' | 'electric' | 'velvet' | 'vintage', PurpleShadeConfig> = {
  royal: {
    id: 'royal',
    name: 'Imperial Royal Amethyst (New)',
    badge: 'Recommended',
    primary: '#4C1D95',
    hover: '#5B21B6',
    light: '#6D28D9',
    subtle: '#EDE9FE',
    description: 'Sleek, regal deep modern royal purple with rich depth and high contrast',
  },
  electric: {
    id: 'electric',
    name: 'Electric Contemporary Violet',
    badge: 'Vibrant',
    primary: '#6D28D9',
    hover: '#7C3AED',
    light: '#8B5CF6',
    subtle: '#F5F3FF',
    description: 'Vibrant, bright collegiate purple with contemporary energy',
  },
  velvet: {
    id: 'velvet',
    name: 'Midnight Velvet Plum',
    badge: 'Theatrical',
    primary: '#3B0764',
    hover: '#4C1D95',
    light: '#581C87',
    subtle: '#FAF5FF',
    description: 'Deep theatrical stage dark plum for high-drama aesthetics',
  },
  vintage: {
    id: 'vintage',
    name: 'ECU Heritage 1970s',
    badge: 'Heritage',
    primary: '#592A8A',
    hover: '#47216e',
    light: '#7B3DB8',
    subtle: '#F3E8FF',
    description: 'Traditional 1970s print purple archive shade',
  },
};

export const PRESET_THEMES: PresetOption[] = [
  {
    id: 'white-purple',
    name: 'ECU White & Purple (Default)',
    description: 'Crisp bright white stage canvas accented with sleek royal purple & gold',
    previewClass: 'from-white via-[#faf7ff] to-[#f3eefe]',
    style: {
      background: 'radial-gradient(circle at 90% 10%, rgba(254, 197, 36, 0.12) 0%, transparent 45%), radial-gradient(circle at 10% 90%, rgba(76, 29, 149, 0.08) 0%, transparent 45%), linear-gradient(180deg, #ffffff 0%, #faf8fd 100%)',
      isDark: false,
      overlay: 0,
      blur: 0,
    },
  },
  {
    id: 'ecu-velvet',
    name: 'ECU Royal Velvet',
    description: 'Sleek, vibrant royal purple with warm golden stage lighting',
    previewClass: 'from-[#170529] via-[#4c1d95] to-[#10031d]',
    style: {
      background: 'radial-gradient(ellipse at 80% 20%, rgba(254, 197, 36, 0.22), transparent 45%), radial-gradient(ellipse at 20% 80%, rgba(76, 29, 149, 0.45), transparent 50%), linear-gradient(135deg, #120422 0%, #2e1065 45%, #0d0219 100%)',
      isDark: true,
      overlay: 0.15,
      blur: 0,
    },
  },
  {
    id: 'pirate-gold',
    name: 'Pirate Gold Spotlight',
    description: 'Dramatic dark charcoal theatre house with amber ECU gold accents',
    previewClass: 'from-[#1a1505] via-[#2d2208] to-[#110e05]',
    style: {
      background: 'radial-gradient(circle at 50% 0%, rgba(254, 197, 36, 0.22) 0%, transparent 60%), linear-gradient(180deg, #18151f 0%, #100e16 100%)',
      isDark: true,
      overlay: 0.2,
      blur: 0,
    },
  },
  {
    id: 'midnight-theatre',
    name: 'Midnight Auditorium',
    description: 'Deep theatrical stage atmosphere with auditorium depth',
    previewClass: 'from-[#0b0c10] via-[#1f2833] to-[#0f1016]',
    style: {
      background: 'radial-gradient(circle at 50% 10%, rgba(76, 29, 149, 0.3) 0%, transparent 70%), linear-gradient(180deg, #0d0e15 0%, #08090d 100%)',
      isDark: true,
      overlay: 0.25,
      blur: 0,
    },
  },
  {
    id: 'collegiate-slate',
    name: 'East Carolina Classic',
    description: 'Crisp, bright university stage aesthetic with purple & gold trim',
    previewClass: 'from-[#f8f6fc] via-[#f2ecf9] to-[#ffffff]',
    style: {
      background: 'radial-gradient(circle at 90% 10%, rgba(254, 197, 36, 0.14) 0%, transparent 40%), radial-gradient(circle at 10% 90%, rgba(76, 29, 149, 0.1) 0%, transparent 40%), linear-gradient(180deg, #faf8fc 0%, #f4effa 100%)',
      isDark: false,
      overlay: 0.05,
      blur: 0,
    },
  },
  {
    id: 'broadway-lights',
    name: 'Broadway Golden Hour',
    description: 'Warm theatrical lighting reminiscent of an intimate cabaret',
    previewClass: 'from-[#2e1919] via-[#3d182b] to-[#1b0d18]',
    style: {
      background: 'radial-gradient(circle at 30% 20%, rgba(254, 197, 36, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(142, 36, 96, 0.2) 0%, transparent 50%), linear-gradient(145deg, #220f1e 0%, #150913 100%)',
      isDark: true,
      overlay: 0.2,
      blur: 0,
    },
  },
  {
    id: 'clean-canvas',
    name: 'Clean Studio White',
    description: 'Minimal high-clarity canvas for reading scripts and headshots',
    previewClass: 'from-white via-slate-50 to-slate-100',
    style: {
      background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      isDark: false,
      overlay: 0,
      blur: 0,
    },
  },
];

const DEFAULT_SETTINGS: BackgroundSettings = {
  presetId: 'white-purple',
  mode: 'preset',
  purpleShade: 'royal',
  solidColor: '#FFFFFF',
  gradientAngle: 180,
  gradientStart: '#FFFFFF',
  gradientEnd: '#FAF8FD',
  imageUrl: '',
  overlayOpacity: 0,
  blurAmount: 0,
  isDarkTheme: false,
};

interface ThemeContextType {
  settings: BackgroundSettings;
  updateSettings: (newSettings: Partial<BackgroundSettings>) => void;
  applyPreset: (presetId: ThemePresetId) => void;
  setPurpleShade: (shade: 'royal' | 'electric' | 'velvet' | 'vintage') => void;
  resetToDefault: () => void;
  getBackgroundCSS: () => React.CSSProperties;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<BackgroundSettings>(() => {
    try {
      const saved = localStorage.getItem('ecu_performer_bg_settings_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.solidColor === '#592A8A') parsed.solidColor = '#4C1D95';
        if (parsed.gradientStart === '#592A8A') parsed.gradientStart = '#4C1D95';
        if (!parsed.purpleShade) parsed.purpleShade = 'royal';
        return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ecu_performer_bg_settings_v3', JSON.stringify(settings));
    } catch {
      // ignore
    }

    // Sync html dark mode class
    if (settings.isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Sync CSS variable for the active purple shade across the document
    const shadeKey = settings.purpleShade || 'royal';
    const activeShade = PURPLE_SHADES[shadeKey] || PURPLE_SHADES.royal;
    document.documentElement.style.setProperty('--ecu-purple', activeShade.primary);
    document.documentElement.style.setProperty('--ecu-purple-hover', activeShade.hover);
    document.documentElement.style.setProperty('--ecu-purple-light', activeShade.light);
    document.documentElement.style.setProperty('--ecu-purple-subtle', activeShade.subtle);
  }, [settings]);

  const updateSettings = (newSettings: Partial<BackgroundSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  const applyPreset = (presetId: ThemePresetId) => {
    const preset = PRESET_THEMES.find((p) => p.id === presetId);
    if (!preset) return;
    setSettings({
      ...settings,
      presetId,
      mode: 'preset',
      isDarkTheme: preset.style.isDark,
      overlayOpacity: preset.style.overlay,
      blurAmount: preset.style.blur,
    });
  };

  const setPurpleShade = (shade: 'royal' | 'electric' | 'velvet' | 'vintage') => {
    const config = PURPLE_SHADES[shade] || PURPLE_SHADES.royal;
    setSettings((prev) => ({
      ...prev,
      purpleShade: shade,
      solidColor: prev.mode === 'color' && prev.solidColor ? config.primary : prev.solidColor,
      gradientStart: prev.mode === 'gradient' && prev.gradientStart ? config.primary : prev.gradientStart,
    }));
  };

  const resetToDefault = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const getBackgroundCSS = (): React.CSSProperties => {
    if (settings.mode === 'preset') {
      const preset = PRESET_THEMES.find((p) => p.id === settings.presetId) || PRESET_THEMES[0];
      return {
        background: preset.style.background,
        backgroundAttachment: 'fixed',
      };
    }

    if (settings.mode === 'color') {
      return {
        backgroundColor: settings.solidColor || '#4C1D95',
      };
    }

    if (settings.mode === 'gradient') {
      const angle = settings.gradientAngle ?? 135;
      const start = settings.gradientStart || '#4C1D95';
      const end = settings.gradientEnd || '#120422';
      return {
        background: `linear-gradient(${angle}deg, ${start} 0%, ${end} 100%)`,
        backgroundAttachment: 'fixed',
      };
    }

    if (settings.mode === 'image' && settings.imageUrl) {
      return {
        backgroundImage: `url("${settings.imageUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      };
    }

    return {
      background: PRESET_THEMES[0].style.background,
      backgroundAttachment: 'fixed',
    };
  };

  return (
    <ThemeContext.Provider
      value={{
        settings,
        updateSettings,
        applyPreset,
        setPurpleShade,
        resetToDefault,
        getBackgroundCSS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
