// components/auth/ProtectedRoute.tsx
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { ShieldAlert } from 'lucide-react-native';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { colors } = useTheme();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <View
        className="flex-1 justify-center items-center p-6"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text
          className="mt-4 text-base font-semibold"
          style={{ color: colors.text }}
        >
          Checking authentication...
        </Text>
      </View>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // Check admin access if required
  if (requireAdmin && user?.role !== 'admin') {
    return (
      <View
        className="flex-1 justify-center items-center p-6"
        style={{ backgroundColor: colors.background }}
      >
        <View
          className="p-8 rounded-3xl items-center max-w-md"
          style={{ backgroundColor: `${colors.error}10` }}
        >
          <ShieldAlert size={64} color={colors.error} />
          <Text
            className="text-2xl font-extrabold mt-4 mb-2"
            style={{ color: colors.error }}
          >
            Access Denied
          </Text>
          <Text
            className="text-base text-center mb-2"
            style={{ color: colors.textSecondary }}
          >
            You don't have permission to access this page.
          </Text>
          <Text
            className="text-sm text-center italic"
            style={{ color: colors.textSecondary }}
          >
            This page is only accessible to administrators.
          </Text>
        </View>
      </View>
    );
  }

  return <>{children}</>;
}

// Usage Example in Settings Screen:
// import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
//
// export default function SettingsScreen() {
//   return (
//     <ProtectedRoute requireAdmin>
//       <View>
//         {/* Your settings content */}
//       </View>
//     </ProtectedRoute>
//   );
// }