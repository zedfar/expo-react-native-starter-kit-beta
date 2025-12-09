import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/common/Button';
import { notify } from '@/utils/notify';
import { runWithLoading } from '@/utils/runWithLoading';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Mail,
  UserCircle,
  Sparkles,
  Info,
} from 'lucide-react-native';

// Shared Components
import { InputField } from '@/components/shared/InputField';
import { PasswordField } from '@/components/shared/PasswordField';

export default function RegisterScreen() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const { colors } = useTheme();

  // Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  // UI utils
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Haptic throttle
  const lastHapticTime = useRef(0);
  const safeHaptic = (fn: () => void) => {
    const t = Date.now();
    if (t - lastHapticTime.current >= 700) {
      lastHapticTime.current = t;
      fn();
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 650, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 20, friction: 7, useNativeDriver: true }),
    ]).start();
  }, []);

  // Validation
  const validateEmail = (v: string) => {
    setEmail(v);
    const emailRegex = /\S+@\S+\.\S+/;
    setEmailError(!v ? null : emailRegex.test(v) ? null : 'Invalid email format');
  };

  const getStrength = (v: string) => {
    let s = 0;
    if (v.length >= 8) s++;
    if (/[A-Z]/.test(v)) s++;
    if (/[0-9]/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    return s;
  };

  const handlePassword = (v: string) => {
    setPassword(v);
    const sc = getStrength(v);

    setPasswordError(
      !v ? null :
        sc <= 1 ? 'Password is too weak' :
          sc === 2 ? 'Password could be stronger' :
            null
    );

    setConfirmError(confirmPassword && v !== confirmPassword ? 'Passwords do not match' : null);
  };

  const handleConfirmPassword = (v: string) => {
    setConfirmPassword(v);
    setConfirmError(!v ? null : v !== password ? 'Passwords do not match' : null);
  };

  const canSubmit =
    !!name && !!email && !!password && !!confirmPassword &&
    !emailError && !passwordError && !confirmError;

  const strengthScore = getStrength(password);
  const strengthLabel =
    !password ? '' :
      strengthScore <= 1 ? 'Weak' :
        strengthScore === 2 ? 'Medium' : 'Strong';
  const strengthColor =
    strengthScore <= 1 ? colors.error :
      strengthScore === 2 ? colors.warning : colors.success;

  // Register
  const handleRegister = async () => {
    if (!canSubmit) {
      notify.warning('Check form', 'Fix highlighted fields first');
      return;
    }
    try {
      await runWithLoading(
        setLoading,
        notify.promise(
          register(email, password, name),
          {
            loading: 'Creating your account...',
            success: 'Account created 🎉',
            error: 'Registration failed',
          }
        ),
      );
      router.replace('/(auth)/login');
    } catch {
      // notify already handled
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientMiddle, colors.gradientEnd]}
        className="flex-1"
      >
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 justify-center px-6 py-8">
            <Animated.View
              style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
            >
              <View style={{ width: '100%', maxWidth: 400, alignSelf: 'center' }}>
                {/* HEADER */}
                <View className="items-center mb-8">
                  <View
                    className="w-20 h-20 mb-6 rounded-2xl items-center justify-center"
                    style={{ backgroundColor: colors.primary + '22' }}
                  >
                    <Sparkles size={48} color={colors.primary} />
                  </View>
                  <Text className="text-3xl font-bold pb-1 text-center" style={{ color: colors.text }}>
                    Create Account
                  </Text>
                  <Text className="text-base text-center" style={{ color: colors.textSecondary }}>
                    Sign up to get started
                  </Text>
                </View>

                {/* FORM */}
                <InputField
                  label="Full Name"
                  value={name}
                  onChange={setName}
                  icon={<UserCircle size={22} color={colors.primary} />}
                  colors={colors}
                  onHaptic={safeHaptic}
                  placeholder="Your full name"
                />

                <InputField
                  label="Email"
                  value={email}
                  onChange={validateEmail}
                  icon={<Mail size={22} color={colors.primary} />}
                  colors={colors}
                  error={emailError}
                  keyboardType="email-address"
                  onHaptic={safeHaptic}
                  placeholder="you@example.com"
                />

                {/* Password */}
                <PasswordField
                  label="Password"
                  value={password}
                  onChange={handlePassword}
                  show={showPassword}
                  setShow={setShowPassword}
                  colors={colors}
                  error={passwordError}
                  onHaptic={safeHaptic}
                  placeholder="Create a strong password"
                />

                {/* Strength meter */}
                {password ? (
                  <View className="mt-2 flex-row items-center mb-3">
                    <View className="flex-row flex-1 gap-1 mr-2">
                      {[1, 2, 3, 4].map((i) => (
                        <View
                          key={i}
                          className="flex-1 h-1.5 rounded-full"
                          style={{
                            backgroundColor: strengthScore >= i ? strengthColor : colors.borderLight,
                          }}
                        />
                      ))}
                    </View>
                    <Text className="text-xs font-medium" style={{ color: strengthColor }}>
                      {strengthLabel}
                    </Text>
                  </View>
                ) : null}

                <PasswordField
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={handleConfirmPassword}
                  show={showConfirmPassword}
                  setShow={setShowConfirmPassword}
                  colors={colors}
                  error={confirmError}
                  onHaptic={safeHaptic}
                  placeholder="Re-enter your password"
                />

                {/* BUTTON */}
                <Button
                  title="Create Account"
                  onPress={handleRegister}
                  fullWidth
                  loading={loading}
                  disabled={!canSubmit}
                />

                {/* FOOTER */}
                <View className="items-center mt-6">
                  <View className="flex-row">
                    <Text style={{ color: colors.textSecondary }}>
                      Already have an account?{' '}
                    </Text>
                    <Link href="/(auth)/login" asChild>
                      <TouchableOpacity onPress={() => Haptics.selectionAsync()}>
                        <Text className="font-semibold underline" style={{ color: colors.primary }}>
                          Sign In
                        </Text>
                      </TouchableOpacity>
                    </Link>
                  </View>
                </View>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
