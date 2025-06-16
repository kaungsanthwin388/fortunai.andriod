//kyi sin thein//naychi
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Footer from '../components/ui/Footer';

export default function FeedbackScreen() {
  return (
    <LinearGradient colors={['#36010F', '#922407']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Send Feedback</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Share Your Thoughts</Text>
          <TextInput
            style={styles.input}
            placeholder="Type your feedback here..."
            placeholderTextColor="#ccc"
            multiline
            numberOfLines={6}
          />
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          </TouchableOpacity>
        </View>
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
  header: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  content: {
    padding: 16,
    marginBottom: 100,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFB74D',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    textAlignVertical: 'top',
    minHeight: 120,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#B71C1C',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});