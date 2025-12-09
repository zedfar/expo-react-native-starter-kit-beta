import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/config/ToastConfig';
import '../global.css';

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const setColorScheme = useThemeStore((state) => state.setColorScheme);

  useEffect(() => {
    checkAuth();
    setColorScheme(systemColorScheme);
  }, [systemColorScheme]);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>

      <Toast config={toastConfig} topOffset={55} visibilityTime={3000} />
    </SafeAreaProvider>
  );
}
