import { Stack } from 'expo-router';
import { useThemeStore } from '@/store/themeStore';

export default function NewsLayout() {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isDark = colorScheme === 'dark';

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
        },
        headerTintColor: isDark ? '#FFFFFF' : '#000000',
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
