import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Footer from '../components/ui/Footer';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { ActivityIndicator } from 'react-native';
import { ImageBackground } from 'react-native';

const { width } = Dimensions.get('window');

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const slides = [
    {
      icon: 'nuclear-outline',
      iconLibrary: 'Ionicons',
      title: 'AI-Powered',
      description: 'Unlock AI deep insights.'
    },
    {
      icon: 'crystal-ball',
      iconLibrary: 'MaterialCommunityIcons',
      title: 'Mystical',
      description: 'Blend of ancient wisdom & AI'
    },
    {
      icon: 'sparkles-outline',
      iconLibrary: 'Ionicons',
      title: 'Insights',
      description: 'Gain insights into your destiny'
    },
    {
      icon: 'star-outline',
      iconLibrary: 'Ionicons',
      title: 'Guidance',
      description: 'Navigate your path with clarity'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const renderIcon = (slide) => {
    if (slide.iconLibrary === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons name={slide.icon} size={48} color="#FFD700" style={styles.slideIconStyle} />;
    }
    return <Ionicons name={slide.icon} size={48} color="#FFD700" style={styles.slideIconStyle} />;
  };

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
        .select('name')
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
    <LinearGradient colors={['#36010F', '#7b1e05', '#7b1e05']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.header}>FortunAI</Text>

        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>
            Hello,{' '}
            <Text style={styles.userName}>{profile?.name ?? 'User'}</Text>
          </Text>
          <Text style={styles.subtitle}>What insight today?</Text>
        </View>

        {/* Auto Slider Card */}
        <View style={styles.sliderContainer}>
          <TouchableOpacity style={styles.navButton} onPress={prevSlide}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.slideCard}>
            {renderIcon(slides[currentSlide])}
            <Text style={styles.slideTitle}>{slides[currentSlide].title}</Text>
            <Text style={styles.slideDescription}>{slides[currentSlide].description}</Text>
          </View>

          <TouchableOpacity style={styles.navButton} onPress={nextSlide}>
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Discover Button */}
        <TouchableOpacity style={styles.discoverButton} onPress={() => router.push('/dailyreading')}>
          <Text style={styles.discoverText}>Discover your insight</Text>
        </TouchableOpacity>
      </ScrollView>

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
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  header: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 100,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  greetingSection: {
    alignItems: 'center',
    marginBottom: 50,
    
  },
  greeting: {
    fontSize: 35,
    color: '#FFD700',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'lucida Console'
  },
  userName: {
    color: '#fff',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 18,
    color: '#FFD700',
    opacity: 0.9,
    textAlign: 'center',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
    paddingHorizontal: 10,
  },
  navButton: {
    backgroundColor: 'transparent',
  },
  slideCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingVertical: 50,
    paddingHorizontal: 0,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  slideIconStyle: {
    marginBottom: 15,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 8,
  },
  slideDescription: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  discoverButton: {
    backgroundColor: '#FF8C00',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignSelf: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  discoverText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});