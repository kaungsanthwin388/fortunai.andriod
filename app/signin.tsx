// app/signin.tsx

import { ThemedText } from '@/components/ThemedText';
import { supabase } from '@/lib/supabase';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

// Initialize WebBrowser
WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const router = useRouter();

  // Handle sign in methods
  const handleGoogleSignIn = async () => {
    try {
      // Get the redirect URL based on platform
      const redirectUrl = Platform.select({
        web: 'http://localhost:8081/profile',
        default: 'fortunai://profile'
      });

      console.log('Starting Google sign in with redirect URL:', redirectUrl);

      // Sign in with Google
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: Platform.OS !== 'web',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('OAuth error:', error);
        alert(error.message);
        return;
      }

      // For Android, we need to handle the OAuth flow manually
      if (Platform.OS !== 'web' && data?.url) {
        console.log('Opening auth session for Android');
        try {
          const result = await WebBrowser.openAuthSessionAsync(
            data.url,
            redirectUrl,
            {
              showInRecents: true,
              preferEphemeralSession: false,
            }
          );

          console.log('Auth session result:', result.type);

          if (result.type === 'success') {
            // Get the user after successful authentication
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            if (userError || !user) {
              console.error('User error:', userError);
              alert('Failed to get user data');
              return;
            }

            console.log('User authenticated:', user.id);

            // Create or update user profile
            const { error: upsertError } = await supabase
              .from('userdata')
              .upsert({
                user_id: user.id,
                name: user.user_metadata?.full_name || 'User',
                birth: null,
                purpose: 'Not set',
                gender: 'Not set',
                email: user.email
              }, {
                onConflict: 'user_id'
              });

            if (upsertError) {
              console.error('Profile error:', upsertError);
              alert('Error saving profile');
              return;
            }

            console.log('Profile created/updated');

            // Fetch the profile
            const { data: profile, error: profileError } = await supabase
              .from('userdata')
              .select('name, birth, purpose, gender')
              .eq('user_id', user.id)
              .single();

            if (profileError || !profile) {
              console.error('Profile fetch error:', profileError);
              alert('Could not fetch profile data');
              return;
            }

            console.log('Profile fetched:', profile);

            // Navigate to profile
            router.replace({
              pathname: '/profile',
              params: {
                firstName: profile.name,
                birthDate: profile.birth,
                purpose: profile.purpose,
                gender: profile.gender,
              },
            });
          } else {
            console.log('Auth session cancelled or failed');
            alert('Sign in was cancelled or failed');
          }
        } catch (browserError) {
          console.error('Browser error:', browserError);
          alert('Error opening browser for sign in');
        }
      } else {
        // Web flow - the redirect will handle the rest
        console.log('Web flow initiated');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      alert('An error occurred during sign in');
    }
  };

  const handleAppleSignIn = async () => {
    // Implement Apple sign-in logic here (similar to Google)
    // For now, we'll just navigate to the dashboard
    router.replace('/');
  };

  return (
    <>
      {/* remove default nav header */}
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient
        colors={['#36010F', '#7b1e05', '#36010F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Back arrow */}
        {/* <TouchableOpacity
          onPress={() => router.push('/')}
          style={styles.backButton}
        >
          <FontAwesome name="arrow-left" size={28} color="#FFFFFF" />
        </TouchableOpacity> */}

        {/* Header + underline */}
        <View style={styles.headerContainer}>
          <ThemedText type="title" style={styles.headerText}>
            Welcome Back!
            
          </ThemedText>
          <LinearGradient
            colors={['#FFD700', '#FF9900', '#FF5C39']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.headerLine}
          />
        </View>

        {/* Buttons */}
        <View style={styles.content}>
          <TouchableOpacity
            style={[styles.button, styles.googleButton]}
            activeOpacity={0.8}
            onPress={handleGoogleSignIn}
          >
            <FontAwesome
              name="google"
              size={24}
              color="#DB4437"
              style={styles.icon}
            />
            <ThemedText style={[styles.buttonText, styles.googleText]}>
              Login with Google
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.appleButton]}
            activeOpacity={0.8}
            onPress={handleAppleSignIn}
          >
            <FontAwesome
              name="apple"
              size={24}
              color="#FFFFFF"
              style={styles.icon}
            />
            <ThemedText style={[styles.buttonText, styles.appleText]}>
              Login with Apple
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Footer link */}
        <TouchableOpacity
          onPress={() => router.push('/register')}
          style={styles.footer}
        >
          <ThemedText style={styles.footerText}>
            Don't have an account?{' '}
            <ThemedText style={styles.registerLink}>Register</ThemedText>
          </ThemedText>
        </TouchableOpacity>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',    // center everything vertically
    alignItems: 'center',        // center everything horizontally
  },
  backButton: {
    position: 'absolute',
    top: 35,
    left: 35,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  headerLine: {
    height: 4,
    width: 120,
    borderRadius: 2,
    marginTop: 8,
  },
  content: {
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 280,
    paddingVertical: 14,
    borderRadius: 25,
    marginBottom: 16,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  icon: {
   
    marginLeft: 55,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#36010F',
  },
  googleText: {
    marginLeft: 15,
  },
  appleText: {
    color: '#FFFFFF',
    marginLeft: 15,
  },
  footer: {
    position: 'absolute',
    top: 550,
    alignSelf: 'center',
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  registerLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#fa8911',
  },
});