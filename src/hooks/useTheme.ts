import { useThemeStore } from '@/store/themeStore';
import { colors as themeColors } from '@/theme/colors';

/**
 * Hook for accessing theme state and actions
 * Uses Zustand store for global state management
 */
export function useTheme() {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const setColorScheme = useThemeStore((state) => state.setColorScheme);
  const toggleColorScheme = useThemeStore((state) => state.toggleColorScheme);
  const isDark = colorScheme === 'dark';

  // Get colors based on current color scheme
  const colors = isDark ? themeColors.dark : themeColors.light;

  return {
    colorScheme,
    setColorScheme,
    toggleColorScheme,
    isDark,
    colors,
  };
}