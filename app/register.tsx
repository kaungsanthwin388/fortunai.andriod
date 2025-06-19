// Kyi sin thein
// app/(auth)/register.tsx

import { ThemedText } from '@/components/ThemedText';
import { supabase } from '@/lib/supabase'; // Adjust path if needed
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const navigation = useNavigation();

  // Handle sign up methods
  const handleGoogleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:8081/complete_profile', // or your deployed URL + /complete_profile
        },
      });

      if (error) {
        alert(error.message);
        return;
      }
      // No need to handle anything else here; user will be redirected
    } catch (err) {
      alert('Google sign up failed');
    }
  };

  const handleAppleSignUp = () => {
    // Implement Apple sign-up logic here
    // For now, we'll just navigate to the dashboard
    navigation.replace('CompleteProfile');
  };

  return (
    <LinearGradient
      colors={['#36010F', '#7b1e05', '#36010F']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Back arrow */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Landing')}
        style={styles.backButton}
      >
        <FontAwesome name="arrow-left" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Header + underline */}
      <View style={styles.headerContainer}>
        <ThemedText type="title" style={styles.headerText}>
          Create an Account
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
          onPress={handleGoogleSignUp}
        >
          <FontAwesome
            name="google"
            size={24}
            color="#DB4437"
            style={styles.icon}
          />
          <ThemedText style={[styles.buttonText, styles.googleText]}>
            Sign Up with Google
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.appleButton]}
          activeOpacity={0.8}
          onPress={handleAppleSignUp}
        >
          <FontAwesome
            name="apple"
            size={24}
            color="#FFFFFF"
            style={styles.icon}
          />
          <ThemedText style={[styles.buttonText, styles.appleText]}>
            Sign Up with Apple
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Footer link */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Signin')}
        style={styles.footer}
      >
        <ThemedText style={styles.footerText}>
          Already have an account?{' '}
          <ThemedText style={styles.registerLink}>Sign In</ThemedText>
        </ThemedText>
      </TouchableOpacity>
    </LinearGradient>
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
    top: 45,
    left: 45,
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
    paddingLeft: 20,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  icon: {
    marginRight: 15,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#36010F',
    flex: 1,
  },
  googleText: {
    marginLeft: 15,
  },
  appleText: {
    color: '#FFFFFF',
    marginLeft: 15,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
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