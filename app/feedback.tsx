//kyi sin thein//naychi
import Footer from '@/components/ui/Footer';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function FeedbackScreen() {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={['#36010F', '#7b1e05', '#36010F']} style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Send Feedback</Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Your Feedback</Text>
          <TextInput
            style={styles.input}
            placeholder="Type your feedback here..."
            placeholderTextColor="#aaa"
            multiline
            numberOfLines={6}
          />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
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
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  form: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#181f2a',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#601704',
    fontWeight: 'bold',
    fontSize: 18,
  },
});