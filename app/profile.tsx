//Kyi Sin Thein //Kaung San Thwin
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Footer from '../components/ui/Footer';

export default function ProfileScreen() {
  const router = useRouter();
  type ProfileType = {
    name: string
    birth: string | null
    purpose: string
    gender: string
  } | null

  const [profile, setProfile] = useState<ProfileType>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('userdata')
        .select('name, birth, purpose, gender')
        .eq('user_id', user.id)
        .single();
      if (!error && data) {
        setProfile(data);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#36010F', '#7b1e05', '#36010F']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* <Text style={styles.title}>Profile</Text> */}
        <ScrollView style={{ flex: 1, padding: 16 }} contentContainerStyle={{ alignItems: 'center', paddingBottom: 32 }}>
          <View style={{ width: '100%', maxWidth: 400 }}>
            <Text style={styles.welcomeText}>
              Welcome, <Text style={{ color: '#FFD700' }}>{profile?.name ?? ''}</Text>
            </Text>

            <View style={styles.profileCard}>
              <Text style={styles.profileTitle}>Profile Information</Text>
              <TouchableOpacity style={styles.othersItem}>
                <Text style={styles.profileLabel}>Name</Text>
                <Text style={styles.profileValue}>{profile?.name ?? ''}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.othersItem}>
                <Text style={styles.profileLabel}>Birth Date</Text>
                {/* <Text style={styles.profileValue}>{profile?.birth ? new Date(profile.birth).toLocaleDateString('en-US') : ''}</Text> */}
                <Text style={styles.profileValue}>{profile?.birth ? new Date(profile.birth).toISOString().slice(0, 10) : ''}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.othersItem}>
              <Text style={styles.profileLabel}>Purpose</Text>
              <Text style={styles.profileValue}>{profile?.purpose ?? ''}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.othersItem}>
              <Text style={styles.profileLabel}>Gender</Text>
              <Text style={styles.profileValue}>{profile?.gender ?? ''}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.othersSection}>
              <Text style={styles.othersTitle}>Others</Text>
              <TouchableOpacity style={styles.othersItem} onPress={() => router.replace('/feedback')}>
                <Ionicons name="chatbubble-ellipses-outline" size={24} color="#fff" style={styles.othersIcon} />
                <Text style={styles.othersText}>Send feedback</Text>
              </TouchableOpacity>
              <Link href="/setting" style={styles.othersItem}>
                <Ionicons name="settings-outline" size={24} color="#fff" style={styles.othersIcon} />
                <Text style={styles.othersText}>Account Settings</Text>
              </Link>
              <TouchableOpacity style={styles.othersItem} onPress={() => router.replace('/about')}>
                <Ionicons name="information-circle-outline" size={24} color="#fff" style={styles.othersIcon} />
                <Text style={styles.othersText}>About</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutItem} onPress={async () => {
                await supabase.auth.signOut();
                router.replace('/');
              }}>
                <Ionicons name="log-out-outline" size={24} color="#FF4500" style={styles.othersIcon} />
                <Text style={styles.logoutText}>Log out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      <Footer 
        onPressHome={() => router.replace('/dashboard')} 
        onPressPlans={() => router.replace('/pricing')} 
        onPressMain={() => router.replace('/')} 
        onPressMessages={() => router.replace('/messages')} 
        onPressProfile={() => router.replace('/profile')} 
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
  },
  header: {
    height: 60,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
    elevation: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 28,
    color: '#fff',
    letterSpacing: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(140, 91, 5, 1)', // Darker background for better contrast
    paddingHorizontal: 20, // Add consistent horizontal padding
  },

  pageTitle: {
    fontSize: 30, // Even larger for emphasis
    fontWeight: 'bold',
    color: '#f9bc0d',
    marginTop: 60 + 24, // Adjust top margin for header and spacing
    marginBottom: 12,
    textAlign: 'center', // Center the title
  },
  pageSubtitle: {
    color: '#ccc',
    marginBottom: 32,
    textAlign: 'center',
    fontSize: 16, // Slightly larger subtitle
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 20, // Increased vertical spacing
    marginBottom: 8,
    fontSize: 18, // Larger label font
  },
  input: {
    backgroundColor: '#181f2a',
    borderRadius: 10, // Slightly more rounded
    borderWidth: 1,
    borderColor: '#FF5C39',
    color: '#fff',
    padding: 15, // Increased padding
    marginBottom: 12, // Increased vertical spacing
    fontSize: 16,
  },
  purposeGrid: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12, // Adjust gap
    justifyContent: 'space-around', // Distribute buttons more evenly
    width: '100%',
  },
  purposeButton: {
    backgroundColor: '#B71C1C',
    borderRadius: 25, // More rounded buttons
    paddingVertical: 14, // Increased padding
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#FF5C39',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%', // Slightly smaller to account for gap
    marginBottom: 12, // Add margin between rows
  },
  purposeButtonActive: {
    borderColor: '#FFD700',
    borderBottomWidth: 5, // More prominent active indicator
    borderBottomColor: '#FFD700',
  },
  purposeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17, // Larger text
  },
  genderButton: {
    backgroundColor: '#B71C1C',
    borderRadius: 25, // More rounded
    paddingVertical: 14, // Increased padding
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#FF5C39',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10, // Increased vertical margin
    width: '100%', // Full width for gender buttons
  },
  genderButtonActive: {
    borderColor: '#FFD700',
    borderBottomWidth: 5,
    borderBottomColor: '#FFD700',
  },
  genderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17, // Larger text
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20, // Increased vertical margin
  },
  checkboxBox: {
    width: 25, // Slightly larger checkbox
    height: 25,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FF5C39',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#181f2a',
  },
  checkboxLabel: {
    color: '#fff',
    fontSize: 16, // Slightly larger
  },
  button: {
    backgroundColor: '#FF5C39',
    borderRadius: 10, // More rounded
    paddingVertical: 16, // Increased padding
    alignItems: 'center',
    marginTop: 20, // Increased top margin
    marginBottom: 40, // Increased bottom margin
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20, // Larger button text
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 40,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f9bc0d',
    backgroundColor: '#f9bc0d',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 24,
    marginBottom: 16,
    lineHeight: 40,
    textAlign: 'center',
  },
  signOutButton: {
    position: 'absolute',
    top: 70,
    right: 20,
    backgroundColor: '#FF2D2D',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    zIndex: 20,
  },
  signOutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  profileCard: {
    marginTop: 50,
    backgroundColor: 'rgba(17,24,39,0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  profileTitle: {
    color: '#FF5C39',
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 18,
    textAlign: 'center',
  },
  profileLabel: {
    color: '#ccc',
    fontSize: 20,
    marginTop: 14,
  },
  profileValue: {
    color: '#FFD700',
    
    fontSize: 18,
    marginTop: 10,
  },
  goldButton: {
    backgroundColor: '#FFD700',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  goldButtonText: {
    color: '#111827', // Dark text on gold
    fontWeight: 'bold',
    fontSize: 20,
  },
  redButton: {
    backgroundColor: '#FF2D2D',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  dateInputContainer: {
    backgroundColor: '#181f2a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF5C39',
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateInputText: {
    color: '#fff',
    fontSize: 16,
  },
  othersSection: {
    marginTop: 10,
    backgroundColor: 'rgba(17,24,39,0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 50,
  },
  othersTitle: {
    color: '#FF5C39',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    
  },
  othersItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#333',
    justifyContent: 'space-between',
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    justifyContent: 'flex-start', // Align items to the start for logout
  },
  othersIcon: {
    marginRight: 16,
  },
  othersText: {
    color: '#fff',
    fontSize: 18,
    flex: 1, // Take up remaining space
  },
  logoutText: {
    color: '#FF4500',
    fontSize: 18,
    marginLeft: 16,
    flex: 1,
  },
});