//Nay chi win
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import { AntDesign, Ionicons } from '@expo/vector-icons'; 
import Footer from '@/components/ui/Footer';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { AppState } from 'react-native';

const App = () => {
  const router = useRouter();
  
  return (
    <LinearGradient colors={['#36010F', '#7b1e05', '#36010F']} style={{ flex: 1 }}>
      <ScrollView style={styles.container}>

        {/* Header */}
        <LinearGradient colors={['#FFD54F', '#FF8F00']} style={styles.header}>
          <Text style={styles.logo}>FortunAI</Text>
          <AntDesign name="menu" size={24} color="white" />
        </LinearGradient>

        {/* About Us Section */}
        <View style={styles.content}>
          <Text style={styles.title}>
            Ahead, clarity for pivotal decisions, or a deeper understanding of your life's path,{' '}
            <Text style={styles.logoInline}>FortunAI</Text> offers personalized insights that
            blend centuries-old wisdom with the precision of modern technology. Embrace the
            rhythm of the universe—download FortunAI today and align your steps with destiny's flow.
          </Text>

          <View style={styles.featuresList}>
            <FeatureItem text="Five Elements Theory" />
            <FeatureItem text="Celestial Alignments" />
            <FeatureItem text="Ancient Oracle Techniques" />
            <FeatureItem text="Modern AI Interpretations" />
          </View>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Start Your Journey</Text>
          </TouchableOpacity>
        </View>

        {/* Main Features Section */}
        <View style={styles.main}>
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>Mystical Features</Text>
            <Text style={styles.heroSubtitle}>
              Discover how FortunAI can help you:
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconContainerWarm}>
              <Ionicons name="book-outline" size={30} color="white" />
            </View>
            <Text style={styles.featureTitleWarm}>Traditional Fortune Telling</Text>
            <Text style={styles.featureDescription}>
              Get personalized fortune readings using ancient wisdom and modern technology
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconContainerWarm}>
              <Ionicons name="time-outline" size={30} color="white" />
            </View>
            <Text style={styles.featureTitleWarm}>Daily Insights</Text>
            <Text style={styles.featureDescription}>
              Receive daily predictions and guidance for your life journey
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconContainerWarm}>
              <Ionicons name="sparkles-outline" size={30} color="white" />
            </View>
            <Text style={styles.featureTitleWarm}>AI-Powered Analysis</Text>
            <Text style={styles.featureDescription}>
              Enter your question or context below to receive an AI-powered analysis.
            </Text>
          </View>
        </View>

        {/* Footer */}
        
    <Footer 
          onPressHome={() => router.replace('/dashboard')} 
          onPressPlans={() => router.replace('/pricing')} 
          onPressMain={() => router.replace('/')} 
          onPressMessages={() => router.replace('/messages')} 
          onPressProfile={() => router.replace('/profile')} 
        />
      </ScrollView>
    </LinearGradient>
  );
};

// Feature Item
const FeatureItem = ({ text, checked = true }) => (
  <View style={styles.featureItem}>
    <View style={styles.checkboxContainer}>
      {checked ? <AntDesign name="checkcircle" size={20} color="#E53935" /> : <AntDesign name="checkcircleo" size={20} color="#D3D3D3" />}
    </View>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
    paddingVertical: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  title: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
    textAlign: 'justify',
  },
  logoInline: {
    color: '#FF8F00',
    fontWeight: 'bold',
  },
  featuresList: {
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxContainer: {
    marginRight: 10,
  },
  featureText: {
    color: '#ffffff',  // Changed from '#4e342e' to white
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF8F00',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  main: {
    paddingHorizontal: 20,
    marginBottom: 60,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10, // Changed from 50 to 10
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20, // Added margin bottom
  },
  featureCard: {
    backgroundColor: '#ffe0b2',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20, // Changed from 90 to 20
    marginTop: 0, // Changed from -60 to 0
  },
  featureIconContainerWarm: {
    backgroundColor: '#FFB300',
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureTitleWarm: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#e65100',
  },
  featureDescription: {
    color: '#5d4037',
    lineHeight: 20,
  },
  footer: {
    backgroundColor: '#FF8F00',
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 20,
  },
  searchBar: {
    backgroundColor: '#fbc02d',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    paddingRight: 10,
  },
});

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default App;
