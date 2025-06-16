import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://kofcitribiroufhhecem.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvZmNpdHJpYmlyb3VmaGhlY2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3OTc2NDIsImV4cCI6MjA1OTM3MzY0Mn0.fWTWnbpSBS5QCDi81n9goKA8dW7pqxE0MNntpj8y-1Y';

// Create a storage implementation that works in both web and native
const storage = Platform.select({
  web: {
    getItem: (key: string) => {
      if (typeof window === 'undefined') return null;
      return Promise.resolve(localStorage.getItem(key));
    },
    setItem: (key: string, value: string) => {
      if (typeof window === 'undefined') return;
      localStorage.setItem(key, value);
    },
    removeItem: (key: string) => {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(key);
    },
  },
  default: {
    getItem: async (key: string) => {
      try {
        return await AsyncStorage.getItem(key);
      } catch (error) {
        console.error('Error reading from AsyncStorage:', error);
        return null;
      }
    },
    setItem: async (key: string, value: string) => {
      try {
        await AsyncStorage.setItem(key, value);
      } catch (error) {
        console.error('Error writing to AsyncStorage:', error);
      }
    },
    removeItem: async (key: string) => {
      try {
        await AsyncStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing from AsyncStorage:', error);
      }
    },
  },
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  db: {
    schema: 'public'
  }
});

// Only add AppState listener in native environments
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}

// Add error logging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session?.user?.id);
});