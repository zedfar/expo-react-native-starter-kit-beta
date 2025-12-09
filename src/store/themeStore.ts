import { create } from 'zustand';
import { ColorSchemeName } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeState {
  mode: ThemeMode;
  colorScheme: ColorSchemeName;
  setThemeMode: (mode: ThemeMode) => void;
  setColorScheme: (scheme: ColorSchemeName) => void;
  toggleColorScheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'auto',
  colorScheme: 'light',

  setThemeMode: (mode) => set({ mode }),

  setColorScheme: (scheme) => set({ colorScheme: scheme }),

  toggleColorScheme: () => {
    const currentScheme = get().colorScheme;
    set({ colorScheme: currentScheme === 'dark' ? 'light' : 'dark' });
  },
}));
