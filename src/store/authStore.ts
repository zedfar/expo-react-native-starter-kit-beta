import { create } from 'zustand';
import { authService } from '@/services/authService';
import { storage } from '@/utils/storage';
import type { User } from '@/types/auth.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

/**
 * Normalize pesan error dari API (axios, fetch, native Error)
 */
const extractErr = (e: any): string => {
  return (
    e?.response?.data?.message ||    // axios JSON
    e?.data?.message ||              // fetch JSON
    e?.message ||                    // native error
    'Something went wrong'
  );
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email, password) => {
    try {
      set({ error: null, isLoading: true });

      const res = await authService.login({ email, password });

      // 🔐 Simpan session ke SecureStore
      await storage.setToken(res.token);
      await storage.setUserData(res.user);

      set({
        user: res.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

    } catch (err) {
      const msg = extractErr(err);

      set({
        error: msg,
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });

      // ⛔ WAJIB agar notify.promise & UI mengetahui login gagal
      throw new Error(msg);
    }
  },

  register: async (email, password, name) => {
    try {
      set({ error: null, isLoading: true });

      const res = await authService.register({ email, password, name });

      await storage.setToken(res.token);
      await storage.setUserData(res.user);

      set({
        user: res.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

    } catch (err) {
      const msg = extractErr(err);

      set({
        error: msg,
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });

      throw new Error(msg);
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.warn('Logout API error (ignored):', e);
    } finally {
      // 🔥 Hapus session dari device
      await storage.clearAll();
      set({ user: null, isAuthenticated: false, error: null });
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });

      const token = await storage.getToken();
      if (!token) {
        set({ isLoading: false, isAuthenticated: false, user: null });
        return;
      }

      // 🔍 Konfirmasi token ke server
      const user = await authService.getCurrentUser();
      await storage.setUserData(user);

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

    } catch (err) {
      // token invalid → reset session
      await storage.clearAll();
      set({
        isLoading: false,
        user: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
