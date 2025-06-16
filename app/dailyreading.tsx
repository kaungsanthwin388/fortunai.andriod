// Kyi Sin Thein
// dailyreading.tsx
import { BaziCalculator } from '@/lib/bazi';
import { generateFreeReading } from '@/lib/deepseek';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Markdown from 'react-native-markdown-display'; // <-- Using markdown-display
import Footer from '../components/ui/Footer';
import { supabase } from '../lib/supabase';

const DEEPSEEK_API_KEY = 'sk-8e8b3cf59fb74f49be40ce28c96ccf49';

interface Analysis {
  summary?: string;
  date?: string;
  created_at?: string;
}

export default function DailyReadingScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const fetchDailyReading = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Authenticate user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      // 2. Get user profile (birth, gender)
      const { data: profile, error: profileError } = await supabase
        .from('userdata')
        .select('birth, gender')
        .eq('user_id', user.id)
        .single();
      if (profileError || !profile || !profile.birth) throw new Error('Profile or birth date not found');

      // 3. Get today's date in user's timezone
      const now = new Date();
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const todayDateString = new Date(now.toLocaleString('en-US', { timeZone: userTimezone }))
        .toLocaleDateString('en-CA', { timeZone: userTimezone });

      // 4. Check cache
      const { data: existingAnalysis, error: analysisError } = await supabase
        .from('daily')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', todayDateString)
        .single();
      if (!analysisError && existingAnalysis) {
        setAnalysis(existingAnalysis);
        setLoading(false);
        return;
      }

      // 5. Calculate BaZi
      const birthDate = profile.birth ? new Date(profile.birth) : null;
      const gender = profile.gender === 'male' ? 'male' : 'female';
      if (!birthDate) throw new Error('Birth date is missing or invalid');
      
      const userBazi = new BaziCalculator(birthDate, gender);
      const todayBazi = new BaziCalculator(now, gender);
      
      const userBaziResult = userBazi.calculateBazi();
      const todayBaziResult = todayBazi.calculateBazi();
      
      const userBaziEnglish = userBazi.getCompleteAnalysis(userBaziResult);
      const todayBaziEnglish = todayBazi.getCompleteAnalysis(todayBaziResult);

      // 6. Generate reading using DeepSeek
      const summary = await generateFreeReading(userBaziEnglish, todayBaziEnglish);

      // 7. Store result
      const { data: newAnalysis, error: insertError } = await supabase
        .from('daily')
        .upsert({
          user_id: user.id,
          date: todayDateString,
          summary: summary,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (insertError) throw new Error(insertError.message);
      setAnalysis(newAnalysis);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyReading();
  }, []);

  return (
    <LinearGradient colors={['#36010F', '#922407']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daily Analysis</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          {/* <Text style={styles.sectionTitle}>Today's Guidance</Text> */}
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : error ? (
            <Text style={{ color: 'red' }}>{error}</Text>
          ) : (
            <>
              {analysis && analysis.summary ? (
                <View style={styles.markdownContainer}>
                <Markdown
                  style={{
                    body: {
                      color: '#fff',
                      fontSize: 16,
                      lineHeight: 26,
                    },
                    heading1: {
                             color: '#FFB74D',
                             fontWeight: 'bold',
                             marginTop: 10,
                             marginBottom: 10,
                             fontSize: 20,
                          },
                          heading2: {
                            color: '#FFB74D',
                            fontWeight: 'bold',
                            marginTop: 10,
                            marginBottom: 10,
                            fontSize: 20,
                         },
                         heading3: {
                          color: '#FFB74D',
                          fontWeight: 'bold',
                          marginTop: 10,
                          marginBottom: 10,
                          fontSize: 20,
                       },
                    strong: {
                      fontWeight: 'bold',
                        color: '#FFB74D',
                    },
                    bullet_list: {
                      marginLeft: 0,
                    },
                    list_item: {
                      marginBottom: 6,
                      color: '#fff',
                    },
                    unordered_list_icon: {
                        color: '#FFB74D',
                    },
                    code_block: {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      padding: 10,
                      borderRadius: 8,
                      marginVertical: 10,
                    },
                    hr: {
                        borderColor: '#FFB74D',
                      borderWidth: 1,
                      marginTop: 10,
                      marginBottom: 10,
                    },
                  }}
                >
                  {analysis.summary}
                </Markdown>
                </View>
              ) : (
                <Text style={styles.analysisText}>No analysis available.</Text>
              )}
            </>
          )}
          <TouchableOpacity style={styles.regenerateButton} onPress={fetchDailyReading}>
            <Ionicons name="refresh-circle" size={24} color="#fff" />
            <Text style={styles.regenerateButtonText}>Regenerate</Text>
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
  analysisText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  regenerateButton: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B71C1C',
    paddingVertical: 12,
    borderRadius: 8,
  },
  regenerateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  markdownContainer: {
    flex: 1,
    padding: 10,
  },
});
