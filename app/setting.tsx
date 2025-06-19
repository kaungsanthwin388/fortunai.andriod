import Footer from '@/components/ui/Footer';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SettingScreen() {
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={['#36010F', '#7b1e05', '#36010F']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerCard}>
          {/* <TouchableOpacity style={styles.backButton} onPress={() => navigation.replace('Dashboard')}>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerCard: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: 'rgba(54, 1, 15, 0.95)',
    padding: 20,
    marginBottom: 0,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  sectionCard: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    padding: 24,
    marginTop: 20,
    marginBottom: 56,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.15)',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  sectionTitle: {
    color: '#FFD700',
    fontWeight: '600',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionItem: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    color: '#fff',
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    position: 'relative',
  },
  updateButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  updateButtonText: {
    color: '#36010F',
    fontWeight: 'bold',
    fontSize: 16,
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