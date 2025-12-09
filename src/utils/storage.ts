import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  THEME: 'theme_mode',
  REMEMBER_EMAIL: 'remember_email',
  REMEMBER_FLAG: 'remember_flag',
};

class Storage {
  private isWeb = Platform.OS === 'web';

  // Fallback between SecureStore ⟷ AsyncStorage
  async setItem(key: string, value: string) {
    if (this.isWeb) return localStorage.setItem(key, value);
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      await AsyncStorage.setItem(key, value);
    }
  }

  async getItem(key: string) {
    if (this.isWeb) return localStorage.getItem(key);
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return await AsyncStorage.getItem(key);
    }
  }

  async removeItem(key: string) {
    if (this.isWeb) return localStorage.removeItem(key);
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      await AsyncStorage.removeItem(key);
    }
  }

  // Auth
  setToken(token: string) {
    return this.setItem(KEYS.TOKEN, token);
  }

  getToken() {
    return this.getItem(KEYS.TOKEN);
  }

  removeToken() {
    return this.removeItem(KEYS.TOKEN);
  }

  setUserData(data: any) {
    return this.setItem(KEYS.USER, JSON.stringify(data));
  }

  async getUserData() {
    const data = await this.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  }

  // Appearance
  setThemeMode(mode: string) {
    return this.setItem(KEYS.THEME, mode);
  }

  getThemeMode() {
    return this.getItem(KEYS.THEME);
  }

  // Remember Email UX (non-credential, safe)
  setRememberEmail(email: string | null) {
    if (!email) {
      this.removeItem(KEYS.REMEMBER_EMAIL);
      this.removeItem(KEYS.REMEMBER_FLAG);
      return;
    }
    this.setItem(KEYS.REMEMBER_FLAG, '1');
    return this.setItem(KEYS.REMEMBER_EMAIL, email);
  }

  async getRememberEmail() {
    const flag = await this.getItem(KEYS.REMEMBER_FLAG);
    if (!flag) return null;
    return await this.getItem(KEYS.REMEMBER_EMAIL);
  }

  async removeRememberEmail() {
    await AsyncStorage.removeItem('remember_email');
  }

  // Clear all
  async clearAll() {
    await Promise.all([
      this.removeItem(KEYS.TOKEN),
      this.removeItem(KEYS.USER),
      this.removeItem(KEYS.THEME),
      this.removeItem(KEYS.REMEMBER_EMAIL),
      this.removeItem(KEYS.REMEMBER_FLAG),
    ]);
  }
}

export const storage = new Storage();
