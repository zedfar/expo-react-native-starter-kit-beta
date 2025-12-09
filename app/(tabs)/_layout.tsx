import { Tabs, Redirect } from 'expo-router';
import { Newspaper, Settings } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';

export default function TabsLayout() {
  const { isAuthenticated } = useAuthStore();
  const colorScheme = useThemeStore((state) => state.colorScheme);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#6B7280',
        tabBarStyle: {
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
          borderTopColor: isDark ? '#374151' : '#E5E7EB',
        },
        headerStyle: {
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
        },
        headerTintColor: isDark ? '#FFFFFF' : '#000000',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'News',
          tabBarIcon: ({ color, size }) => <Newspaper size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
