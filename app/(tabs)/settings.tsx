import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Moon, Sun, LogOut } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { useTheme } from '@/hooks/useTheme';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { notify } from '@/utils/notify';
import { runWithLoading } from '@/utils/runWithLoading';

export default function SettingsScreen() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { colorScheme, setColorScheme } = useThemeStore();
  const { colors } = useTheme();
  const isDark = colorScheme === 'dark';

  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setProcessing] = useState(false);

  // haptic anti-spam
  const lastHaptic = useRef(0);
  const safeHaptic = (fn: () => void) => {
    const now = Date.now();
    if (now - lastHaptic.current > 700) {
      lastHaptic.current = now;
      fn();
    }
  };

  const toggleTheme = () => {
    safeHaptic(() => Haptics.selectionAsync());
    setColorScheme(isDark ? 'light' : 'dark');
    notify.info('Theme updated', isDark ? 'Light mode enabled' : 'Dark mode enabled');
  };

  const requestLogout = () => {
    safeHaptic(() => Haptics.selectionAsync());
    setShowConfirm(true);
  };

  const handleLogout = async () => {
    setShowConfirm(false);
    try {
      await runWithLoading(
        setProcessing,
        notify.promise(logout(), {
          loading: 'Signing you out…',
          success: 'Logged out successfully 👋',
          error: 'Logout failed',
        })
      );
      router.replace('/(auth)/login');
    } catch { }
  };

  return (
    <>
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 22 }}
      >
        {/* HEADER */}
        <Text
          className="text-2xl font-extrabold mb-6"
          style={{ color: colors.text }}
        >
          Settings
        </Text>

        {/* APPEARANCE SECTION */}
        <Card className="mb-5">
          <View className="flex-row items-center justify-between mb-4">
            <Text
              className="text-lg font-semibold"
              style={{ color: colors.text }}
            >
              Appearance
            </Text>
          </View>

          <TouchableOpacity
            onPress={toggleTheme}
            activeOpacity={0.7}
            className="flex-row items-center justify-between p-4 rounded-xl"
            style={{ backgroundColor: colors.surface }}
          >
            <View className="flex-row items-center">
              {isDark
                ? <Moon size={20} color={colors.primary} />
                : <Sun size={20} color={colors.primary} />}
              <Text
                className="ml-3 font-medium text-base"
                style={{ color: colors.text }}
              >
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
            <Text style={{ color: colors.textSecondary }}>{isDark ? 'On' : 'Off'}</Text>
          </TouchableOpacity>
        </Card>

        {/* LOGOUT */}
        <Card>
          <Button
            title="Logout"
            onPress={requestLogout}
            variant="secondary"
            fullWidth
            iconLeft={<LogOut size={18} color={colors.error} />}
          />
        </Card>
      </ScrollView>

      {/* CONFIRM LOGOUT */}
      <ConfirmDialog
        visible={showConfirm}
        title="Log Out"
        message="Are you sure you want to sign out of your account?"
        confirmText="Yes, logout"
        cancelText="Cancel"
        destructive
        loading={isProcessing}
        onConfirm={handleLogout}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
