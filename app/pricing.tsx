// ... existing code ...//Nay chi win
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import Icon from 'react-native-vector-icons/Feather'; 
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Footer from '@/components/ui/Footer';


const HeaderSection = () => {
  return (
    <View style={headerStyles.headerContainer}>
      <Text style={headerStyles.title}>Today!</Text>
      <TouchableOpacity style={headerStyles.billingButton}>
        <LinearGradient
          colors={['#FFA000', '#FF6D00']} 
          style={headerStyles.billingGradient}
        >
          <Text style={headerStyles.billingText}>Monthly billing</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const headerStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15, // Adjust as needed for top spacing
    marginBottom: 40, // Space between header and card
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff', // Assuming a dark background
  },
  billingButton: {
    borderRadius: 8,
    overflow: 'hidden', // Clip the gradient to the border radius
  },
  billingGradient: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  billingText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

const PlanCard = () => {
  return (
    <LinearGradient
      colors={['#330000', '#1A0000']} 
      style={cardStyles.cardContainer}
    >
      <View style={cardStyles.iconContainer}>
       
        <Icon name="star" size={24} color="#fff" />
        
      </View>
      <Text style={cardStyles.planTitle}>Pro Plan</Text>
      <Text style={cardStyles.planDescription}>
        Get daily readings between the day's energy to your energy and unlock daily
        pair readings with someone else's birth chart!
      </Text>
      <View style={cardStyles.priceContainer}>
        <Text style={cardStyles.price}>$5</Text>
        <Text style={cardStyles.priceUnit}>/month</Text>
      </View>
      <TouchableOpacity style={cardStyles.button}>
        <Text style={cardStyles.buttonText}>Manage</Text>
      </TouchableOpacity>
      <View style={cardStyles.currentPlanBadge}>
        <Text style={cardStyles.currentPlanText}>Current Plan</Text>
      </View>
    </LinearGradient>
  );
};

const cardStyles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20, // Added horizontal margin
    marginBottom: 20,    // Added bottom margin
    elevation: 5, // For shadow on Android
    shadowColor: '#000', // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    position: 'relative', // To position the badge
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconImage: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
  },
  planTitle: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 10,
  },
  planDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 20,
    lineHeight: 22,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  price: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 32,
    marginRight: 5,
  },
  priceUnit: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  button: {
    backgroundColor: '#FF6D00',
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.2,
  },
  currentPlanBadge: {
    backgroundColor: '#FF6D00', // Darker orange
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    position: 'absolute',
    top: 15,
    right: 15,
  },
  currentPlanText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

const HeroSection = () => {
    const router = useRouter();

    return (
      <View style={heroStyles.background}>
        <LinearGradient
          colors={['#1A0000', '#330000']} // Replace with your desired gradient or use a solid color
          style={heroStyles.gradient}
        >
          <View style={heroStyles.container}>
            <Text style={heroStyles.title}>Ready to discover your destiny?</Text>
            <Text style={heroStyles.subtitle}>
              Join thousands of others who have found clarity and purpose through FortunAI.
            </Text>

            <TouchableOpacity
            style={heroStyles.button}
            onPress={() => router.replace('/dashboard')}
            >
            <Text style={heroStyles.buttonText}>Get Started For Free</Text>
          </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  };
  
const heroStyles = StyleSheet.create({
    background: {
        
        width: '100%',
        height: 370,
        backgroundColor: '#1A0000', 
        justifyContent: 'center',
      },
 
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#E53935', 
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 10,
    width: '80%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOpacity: 0.10,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

const CombinedScreen = () => {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#36010F', '#7b1e05', '#36010F']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >

    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.container}>
    <HeaderSection />
    <PlanCard />
    <HeroSection />


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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
      },
      scrollContainer: {
        paddingTop: 20,
        paddingBottom:100 , 
      },
});

export default CombinedScreen;