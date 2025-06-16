import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Footer from '@/components/ui/Footer';

export default function SettingScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={['#36010F', '#7b1e05', '#36010F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerCard}>
            {/* <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/dashboard')}>
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity> */}
            <Text style={styles.headerTitle}>Account Settings</Text>
          </View>
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Your Name</Text>
            <Text style={styles.sectionItem}>Please enter your full name,or a display name you are comfortable with. </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value="win" // Replace with your actual state/value
                editable={false} // Assuming it's just a display for now
              />
            </View>
            <TouchableOpacity style={styles.updateButton}>
              <Text style={styles.updateButtonText}>Update Name</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Your Email</Text>
            <Text style={styles.sectionItem}>Please enter the email address you want to use to login.</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value="joinfortuna" // Replace with your actual state/value
                editable={false} // Assuming it's just a display for now
              />
            </View>
            <TouchableOpacity style={styles.updateButton}>
              <Text style={styles.updateButtonText}>Update Email</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sectionCard}>
            <Text style={styles.planTitle}>Your Plan</Text>
            <View style={styles.goldUnderline} />
            <Text style={styles.planDesc}>You are currently on the <Text style={{ color: '#FFD700', fontWeight: 'bold' }}>Pro Plan</Text> plan.</Text>
            <Text style={styles.planPrice}>$5/month</Text>
            <View style={styles.divider} />
            <Text style={styles.planNote}>Manage your subscription on Stripe.</Text>
            <TouchableOpacity style={styles.portalButton} onPress={() => { /* TODO: open Stripe portal */ }} activeOpacity={0.85}>
              <Text style={styles.portalButtonText}>Open customer portal</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Footer
          onPressHome={() => router.replace('/dashboard')}
          onPressPlans={() => router.replace('/pricing')}
          onPressMain={() => router.replace('/complete_profile')}
          onPressMessages={() => router.replace('/messages')}
          onPressProfile={() => router.replace('/profile')}
        />
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
    paddingBottom: 80, // To accommodate the Footer
  },
  headerCard: {
    width: '100%',
    
    borderTopLeftRadius: 0, // Removed rounded top corners for full width
    borderTopRightRadius: 0,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionCard: {
    width: '100%',
    backgroundColor: '#23293a',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FFD700',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  sectionItem: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
  },
  inputRow: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFD700',
    color: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: '#FFD700',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#181f2a',
    fontWeight: 'bold',
    fontSize: 16,
  },
  displayNameText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 18,
  },
  planTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 4,
    marginTop: 12,
  },
  goldUnderline: {
    height: 2,
    width: 40,
    backgroundColor: '#FFD700',
    borderRadius: 1,
    alignSelf: 'center',
    marginBottom: 12,
  },
  planDesc: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  planPrice: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 28,
    marginTop: 6,
    marginBottom: 10,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.10)',
    marginVertical: 16,
    width: '80%',
    alignSelf: 'center',
  },
  planNote: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  portalButton: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  portalButtonText: {
    color: '#181f2a',
    fontWeight: 'bold',
    fontSize: 16,
  },
});