import { supabase } from '@/lib/supabase';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Footer from '../components/ui/Footer';


import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface Profile {
  name: string;
}

interface Slide {
  icon: string;
  iconLibrary: string;
  title: string;
  description: string;
}

export default function Dashboard() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const slides: Slide[] = [
    {
      icon: 'flash-outline',
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
      icon: 'sparkles',
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

  const renderIcon = (slide: Slide) => {
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
    <LinearGradient colors={['#36010F', '#922407']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome, {profile?.name || 'User'}!</Text>
        </View>

        {/* Carousel */}
        <View style={styles.carouselContainer}>
          <TouchableOpacity style={styles.carouselButton} onPress={prevSlide}>
            <Ionicons name="chevron-back" size={24} color="#FFD700" />
          </TouchableOpacity>
          
          <View style={styles.slideContainer}>
            <View style={styles.slide}>
              {renderIcon(slides[currentSlide])}
              <Text style={styles.slideTitle}>{slides[currentSlide].title}</Text>
              <Text style={styles.slideDescription}>{slides[currentSlide].description}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.carouselButton} onPress={nextSlide}>
            <Ionicons name="chevron-forward" size={24} color="#FFD700" />
          </TouchableOpacity>
        </View>

        {/* Navigation Cards */}
        <View style={styles.cardsContainer}>
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('FreeRead')}
          >
            <Ionicons name="book-outline" size={32} color="#FFD700" />
            <Text style={styles.cardTitle}>Free Reading</Text>
            <Text style={styles.cardDescription}>Get your free destiny reading</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('PairAnalysis')}
          >
            <Ionicons name="people-outline" size={32} color="#FFD700" />
            <Text style={styles.cardTitle}>Pair Analysis</Text>
            <Text style={styles.cardDescription}>Analyze relationships</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-outline" size={32} color="#FFD700" />
            <Text style={styles.cardTitle}>Profile</Text>
            <Text style={styles.cardDescription}>View your profile</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('Pricing')}
          >
            <Ionicons name="diamond-outline" size={32} color="#FFD700" />
            <Text style={styles.cardTitle}>Premium Plans</Text>
            <Text style={styles.cardDescription}>Upgrade your experience</Text>
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
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  carouselButton: {
    padding: 10,
  },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
  },
  slide: {
    alignItems: 'center',
    padding: 20,
  },
  slideIconStyle: {
    marginBottom: 10,
  },
  slideTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 5,
  },
  slideDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: (width - 60) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});