import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Modal,
  Pressable,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { storage } from '@/utils/storage';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/common/Button';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Haptics from 'expo-haptics';
import { notify } from '@/utils/notify';
import { runWithLoading } from '@/utils/runWithLoading';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Fingerprint,
  Info,
  UserCircle,
  HelpCircle,
  Sparkles,
  X,
  Check,
} from 'lucide-react-native';
import { FontAwesome } from '@expo/vector-icons';

// demo users for modal help
const MOCK_USERS = [
  { email: 'admin@example.com', password: 'admin123', role: 'Admin' },
  { email: 'user@example.com', password: 'user123', role: 'User' },
];

export default function LoginScreen() {
  const login = useAuthStore((state) => state.login);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const { colors } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // haptic anti-spam
  const lastHapticTime = useRef(0);
  const safeHaptic = (fn: () => void) => {
    const now = Date.now();
    if (now - lastHapticTime.current >= 700) {
      lastHapticTime.current = now;
      fn();
    }
  };

  // mount init
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 650, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 20, friction: 7, useNativeDriver: true }),
    ]).start();

    checkBiometricSupport();
    loadRememberedEmail();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricSupported(compatible && enrolled);
    } catch {
      setIsBiometricSupported(false);
    }
  };

  const loadRememberedEmail = async () => {
    const savedEmail = await storage.getRememberEmail();
    if (savedEmail) {
      setRememberMe(true);
      setEmail(savedEmail);
    }
  };

  const saveRemember = async (emailToSave: string) => {
    if (rememberMe) await storage.setRememberEmail(emailToSave);
    else await storage.removeRememberEmail();
  };

  // shake animation
  const shakeError = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 5, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const validateEmail = (v: string) => {
    setEmail(v);
    if (!v) return setEmailError(null);
    const ok = /\S+@\S+\.\S+/.test(v);
    setEmailError(ok ? null : 'Invalid email format');
  };

  // 🚀 secure biometric login (pakai token)
  const handleBiometric = async () => {
    safeHaptic(() => Haptics.selectionAsync());

    const token = await storage.getToken();
    if (!token) {
      notify.info('No active session', 'Login once to enable biometrics');
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login with biometrics',
      disableDeviceFallback: false,
    });

    if (!result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return notify.error('Authentication failed', 'Biometric did not match');
    }

    await runWithLoading(
      setLoading,
      notify.promise(checkAuth(), {
        loading: 'Verifying session...',
        success: 'Welcome back!',
        error: 'Session expired — please login again',
      }),
    );
  };

  // 🚀 normal login (UI ke AuthStore)
  const handleLogin = async (forcedEmail?: string, forcedPassword?: string) => {
    const emailToUse = forcedEmail || email;
    const passwordToUse = forcedPassword || password;
    if (!emailToUse || !passwordToUse) return;

    try {
      await runWithLoading(
        setLoading,
        notify.promise(login(emailToUse, passwordToUse), {
          loading: 'Signing you in...',
          success: 'Login Successful',
          error: 'Incorrect email or password',
        }),
        () => shakeError(), // dipanggil saat error terjadi
      );

      // hanya dipanggil jika login berhasil
      await saveRemember(emailToUse);
    } catch (e) {
      // error sudah ditampilkan di toast, jangan throw lagi
    }
  };

  const quickLogin = (u: typeof MOCK_USERS[0]) => {
    safeHaptic(() => Haptics.selectionAsync());
    setEmail(u.email);
    setPassword(u.password);
    setShowHelpModal(false);
    notify.info('Auto-filled', `${u.role} credentials inserted`);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
      <LinearGradient colors={[colors.gradientStart, colors.gradientMiddle, colors.gradientEnd]} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 justify-center px-6 py-8">
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }, { translateX: shakeAnim }] }}>
              <View style={{ width: '100%', maxWidth: 400, alignSelf: 'center' }}>
                {/* HEADER */}
                <View className="items-center mb-8">
                  <View className="mb-6 w-20 h-20 rounded-2xl items-center justify-center" style={{ backgroundColor: colors.primary + '22' }}>
                    <Sparkles size={48} color={colors.primary} strokeWidth={2.6} />
                  </View>
                  <Text className="text-3xl font-bold pb-1" style={{ color: colors.text }}>Welcome Back</Text>
                  <Text className="text-base" style={{ color: colors.textSecondary }}>Sign in to your account</Text>
                </View>

                {/* EMAIL */}
                <View className="mb-4">
                  <Text className="text-sm font-medium mb-2" style={{ color: colors.text }}>Email</Text>
                  <View className="flex-row items-center rounded-lg border h-14 px-4"
                    style={{ borderColor: emailError ? colors.error : colors.inputBorder, backgroundColor: colors.inputBg }}>
                    <Mail size={22} color={colors.primary} />
                    <TextInput
                      value={email}
                      onFocus={() => safeHaptic(() => Haptics.selectionAsync())}
                      onChangeText={validateEmail}
                      placeholder="you@example.com"
                      placeholderTextColor={colors.textSecondary}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      className="flex-1 ml-3 text-base"
                      style={{ color: colors.inputText }}
                    />
                  </View>
                  {emailError && <Text className="text-xs mt-1 px-1" style={{ color: colors.error }}>{emailError}</Text>}
                </View>

                {/* PASSWORD */}
                <View className="mb-2">
                  <Text className="text-sm font-medium mb-2" style={{ color: colors.text }}>Password</Text>
                  <View className="flex-row items-center rounded-lg border h-14 px-4"
                    style={{ borderColor: colors.inputBorder, backgroundColor: colors.inputBg }}>
                    <Lock size={22} color={colors.primary} />
                    <TextInput
                      value={password}
                      onFocus={() => safeHaptic(() => Haptics.selectionAsync())}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      placeholder="Enter your password"
                      placeholderTextColor={colors.textSecondary}
                      className="flex-1 ml-3 text-base"
                      style={{ color: colors.inputText }}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        safeHaptic(() => Haptics.selectionAsync());
                        setShowPassword((p) => !p);
                      }}>
                      {showPassword ? <EyeOff size={22} color={colors.textSecondary} /> : <Eye size={22} color={colors.textSecondary} />}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* REMEMBER + FORGOT */}
                <View className="flex-row items-center justify-between mb-4">
                  <TouchableOpacity className="flex-row items-center" onPress={() => setRememberMe((p) => !p)}>
                    <View className="w-5 h-5 rounded border mr-2 items-center justify-center"
                      style={{ borderColor: rememberMe ? colors.primary : colors.border, backgroundColor: rememberMe ? colors.primary : 'transparent' }}>
                      {rememberMe && <Check size={14} color="#fff" strokeWidth={3} />}
                    </View>
                    <Text className="text-sm" style={{ color: colors.textSecondary }}>Remember me</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => notify.info('Coming soon', 'Password reset not available yet')}>
                    <Text className="text-sm underline" style={{ color: colors.primary }}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>

                {/* LOGIN + BIOMETRIC */}
                <View className="flex-row items-center mb-6">
                  <View className="flex-1 mr-3">
                    <Button
                      title="Sign In"
                      onPress={() => handleLogin()}
                      loading={loading}
                      disabled={!email || !password}
                      fullWidth
                    />
                  </View>

                  {isBiometricSupported && (
                    <TouchableOpacity onPress={handleBiometric} activeOpacity={0.7}
                      className="h-14 w-14 rounded-lg items-center justify-center"
                      style={{ backgroundColor: colors.primary + '22' }}>
                      <Fingerprint size={26} color={colors.primary} />
                    </TouchableOpacity>
                  )}
                </View>

                {/* DIVIDER */}
                <View className="flex-row items-center mb-6">
                  <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
                  <Text className="mx-4 text-sm font-medium" style={{ color: colors.textSecondary }}>OR</Text>
                  <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
                </View>

                {/* GOOGLE */}
                <TouchableOpacity
                  onPress={() => notify.info('Google Login', 'Coming soon!')}
                  className="h-14 w-full rounded-lg flex-row items-center justify-center mb-8 border overflow-hidden"
                  style={{ borderColor: colors.googleBorder, backgroundColor: colors.googleBg }}
                >
                  <FontAwesome name="google" size={22} color={colors.googleText} style={{ marginRight: 10 }} />
                  <Text className="text-base font-semibold" style={{ color: colors.googleText }}>Continue with Google</Text>
                </TouchableOpacity>

                {/* FOOTER */}
                <View className="items-center gap-3">
                  <View className="flex-row">
                    <Text style={{ color: colors.textSecondary }}>Don't have an account? </Text>
                    <Link href="/(auth)/register" asChild>
                      <TouchableOpacity onPress={() => safeHaptic(() => Haptics.selectionAsync())}>
                        <Text className="font-semibold underline" style={{ color: colors.primary }}>Sign Up</Text>
                      </TouchableOpacity>
                    </Link>
                  </View>

                  <TouchableOpacity onPress={() => setShowHelpModal(true)} className="flex-row items-center">
                    <HelpCircle size={16} color={colors.textSecondary} style={{ marginRight: 4 }} />
                    <Text className="text-sm underline" style={{ color: colors.textSecondary }}>Need Help?</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </LinearGradient>

      {/* HELP MODAL */}
      <Modal visible={showHelpModal} transparent animationType="fade" onRequestClose={() => setShowHelpModal(false)}>
        <Pressable className="flex-1 justify-center items-center px-6" style={{ backgroundColor: colors.modalOverlay }}
          onPress={() => setShowHelpModal(false)}>
          <Pressable onPress={(e) => e.stopPropagation()} className="w-full rounded-2xl overflow-hidden" style={{ backgroundColor: colors.modalBg, maxWidth: 420 }}>

            {/* HEADER */}
            <View className="p-6 pb-4 border-b" style={{ borderColor: colors.border }}>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Info size={22} color={colors.primary} />
                  <Text className="text-xl font-bold ml-3" style={{ color: colors.text }}>Demo Credentials</Text>
                </View>
                <TouchableOpacity onPress={() => setShowHelpModal(false)}>
                  <X size={22} color={colors.text} />
                </TouchableOpacity>
              </View>
              <Text className="text-sm mt-2" style={{ color: colors.textSecondary }}>Tap an account below to autofill the login form.</Text>
            </View>

            {/* CONTENT */}
            <ScrollView className="max-h-96">
              <View className="p-6">
                {MOCK_USERS.map((u, i) => (
                  <TouchableOpacity key={i} onPress={() => quickLogin(u)} activeOpacity={0.7}
                    className="mb-4 p-4 rounded-xl" style={{ backgroundColor: colors.cardAlt, borderWidth: 1, borderColor: colors.border }}>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <View className="p-2 rounded-full mr-3" style={{ backgroundColor: `${colors.primary}22` }}>
                          <UserCircle size={22} color={colors.primary} />
                        </View>
                        <Text className="font-bold text-lg" style={{ color: colors.text }}>{u.role}</Text>
                      </View>
                      <View className="px-3 py-1 rounded-full" style={{ backgroundColor: `${colors.success}22` }}>
                        <Text className="text-xs font-semibold" style={{ color: colors.success }}>TAP TO USE</Text>
                      </View>
                    </View>

                    <View className="mt-3">
                      <Text className="text-sm font-mono mb-1" style={{ color: colors.text }}>📧 {u.email}</Text>
                      <Text className="text-sm font-mono" style={{ color: colors.text }}>🔑 {u.password}</Text>
                    </View>
                  </TouchableOpacity>
                ))}

                <Text className="text-center text-xs mt-3 mb-3" style={{ color: colors.textSecondary }}>
                  ⚠ Testing only — not real users
                </Text>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}
