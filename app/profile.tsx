//Kyi Sin Thein //Kaung San Thwin
import Footer from '@/components/ui/Footer';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
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
        <ScrollView style={{ flex: 1, padding: 16 }} contentContainerStyle={{ alignItems: 'center', paddingBottom: 32 }}>
          <View style={{ width: '100%', maxWidth: 400 }}>
            <Text style={styles.welcomeText}>
              Welcome, <Text style={{ color: '#FFD700' }}>{profile?.name ?? ''}</Text>
            </Text>

            <View style={styles.profileCard}>
              <Text style={styles.profileTitle}>Profile Information</Text>
              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Name</Text>
                <Text style={styles.profileValue}>{profile?.name ?? ''}</Text>
              </View>
              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Birth Date</Text>
                <Text style={styles.profileValue}>{profile?.birth ? new Date(profile.birth).toISOString().slice(0, 10) : ''}</Text>
              </View>
              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Purpose</Text>
                <Text style={styles.profileValue}>{profile?.purpose ?? ''}</Text>
              </View>
              <View style={styles.profileRow}>
                <Text style={styles.profileLabel}>Gender</Text>
                <Text style={styles.profileValue}>{profile?.gender ?? ''}</Text>
              </View>
            </View>

            <View style={styles.othersSection}>
              <Text style={styles.othersTitle}>Others</Text>
              <TouchableOpacity style={styles.othersItem} onPress={() => navigation.navigate('Feedback')}>
                <Ionicons name="chatbubble-ellipses-outline" size={24} color="#fff" style={styles.othersIcon} />
                <Text style={styles.othersText}>Send feedback</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.othersItem} onPress={() => navigation.navigate('Setting')}>
                <Ionicons name="settings-outline" size={24} color="#fff" style={styles.othersIcon} />
                <Text style={styles.othersText}>Account Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.othersItem} onPress={() => navigation.navigate('About')}>
                <Ionicons name="information-circle-outline" size={24} color="#fff" style={styles.othersIcon} />
                <Text style={styles.othersText}>About</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutItem} onPress={async () => {
                await supabase.auth.signOut();
                navigation.navigate('Signin');
              }}>
                <Ionicons name="log-out-outline" size={24} color="#FF4500" style={styles.othersIcon} />
                <Text style={styles.logoutText}>Log out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      <Footer 
        onPressHome={() => navigation.navigate('Dashboard')} 
        onPressPlans={() => navigation.navigate('Pricing')} 
        onPressMain={() => navigation.navigate('Landing')} 
        onPressMessages={() => navigation.navigate('Messages')} 
        onPressProfile={() => navigation.navigate('Profile')} 
        onPressFreeRead={() => navigation.navigate('FreeRead')}
        onPressDailyReading={() => navigation.navigate('DailyReading')}
        onPressPairAnalysis={() => navigation.navigate('PairAnalysis')}
        onPressAskAQuestion={() => navigation.navigate('AskAQuestion')}
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
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 24,
    marginBottom: 16,
    lineHeight: 40,
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 28,
    marginBottom: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  profileTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 24,
    textAlign: 'center',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  profileLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
    flex: 1,
  },
  profileValue: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    flex: 1.2,
  },
  othersSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
  },
  othersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 16,
    textAlign: 'center',
  },
  othersItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  othersIcon: {
    marginRight: 12,
  },
  othersText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  logoutText: {
    color: '#FF4500',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
});