//Kyi Sin Thein
//askaquestion.tsx
import { BaziCalculator } from '@/lib/bazi';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Markdown from 'react-native-markdown-display'; // For styled Markdown
import Footer from '../components/ui/Footer';
import { supabase } from '../lib/supabase';

const DEEPSEEK_API_KEY = 'sk-8e8b3cf59fb74f49be40ce28c96ccf49'; // Replace with environment-safe method later

export default function AskQuestionScreen() {
  const navigation = useNavigation();
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) {
      setError('Please enter a question.');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      // 1. Authenticate user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      // 2. Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('userdata')
        .select('birth, gender')
        .eq('user_id', user.id)
        .single();

      if (profileError || !profile || !profile.birth) {
        throw new Error('Profile or birth date not found. Please update your profile.');
      }

      // 3. Check if already asked today
      const now = new Date();
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const todayDateString = new Date(now.toLocaleString('en-US', { timeZone: userTimezone }))
        .toLocaleDateString('en-CA', { timeZone: userTimezone });

      const { data: existing } = await supabase
        .from('chat')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', todayDateString)
        .single();

      if (existing) {
        setError('You can only ask one question per day.');
        setLoading(false);
        return;
      }

      // 4. Parse birthDate from Supabase and prepare components for BaziCalculator
      let birthDateValue = profile.birth;
      if (typeof birthDateValue === 'object' && 'birthdate' in birthDateValue) {
        birthDateValue = birthDateValue.birthdate;
      }
      if (typeof birthDateValue !== 'string') {
        throw new Error('Profile birth date is not a string. Please update your profile.');
      }

      const birthDateStr = birthDateValue.trim().split('T')[0]; // Ensure YYYY-MM-DD format
      let year, month, day;

      if (/^\d{4}-\d{2}-\d{2}$/.test(birthDateStr)) {
        [year, month, day] = birthDateStr.split('-').map(Number);
        // Use 1-based month for BaziCalculator, but 0-based for JS Date object creation
        // The month for BaziCalculator will be month.
      } else {
        // Handle invalid format directly before creating Date object
        throw new Error('Profile birth date must be in YYYY-MM-DD format. Please update your profile.');
      }

      // We need a specific hour for BaziCalculator. If the user only provided date,
      // we'll default to a common hour like 12 (noon) local time.
      const defaultLocalHour = 12; // Assuming the BaziCalculator expects a local hour (0-23)

      // Create a Date object using local time to ensure getFullYear/Month/Date/Hours match expected
      // This is a dummy date object primarily for passing to BaziCalculator.
      // The actual calculations inside BaziCalculator likely rely on the components directly.
      const birthDateForLogging = new Date(year, month - 1, day, defaultLocalHour, 0, 0); // Month is 0-indexed for Date constructor


      // Final validation (redundant with the previous check but good for safety)
      if (isNaN(birthDateForLogging.getTime())) {
        throw new Error('Failed to parse birth date. Please ensure it\'s valid.');
      }

      // --- Debugging Logs (Keep these for now to confirm the fix) ---
      console.log('--- Date Debugging ---');
      console.log('profile.birth raw:', profile.birth);
      console.log('birthDateStr (parsed):', birthDateStr);
      console.log('Parsed Year:', year, 'Month:', month, 'Day:', day, 'Default Local Hour:', defaultLocalHour);
      console.log('birthDateForLogging (Date object, local time):', birthDateForLogging);
      console.log('birthDateForLogging instanceof Date:', birthDateForLogging instanceof Date);
      console.log('birthDateForLogging.getTime():', birthDateForLogging.getTime());
      console.log('birthDateForLogging Local FullYear:', birthDateForLogging.getFullYear());
      console.log('birthDateForLogging Local Month (0-indexed):', birthDateForLogging.getMonth());
      console.log('birthDateForLogging Local Date:', birthDateForLogging.getDate());
      console.log('birthDateForLogging Local Hours:', birthDateForLogging.getHours());
      console.log('--------------------');
      // --- End Debugging Logs ---

      // 5. Create BaziCalculator instance
      const gender = profile.gender || 'male';
      // Pass the components directly. The `BaziCalculator` constructor explicitly takes numbers.
      console.log('BaziCalculator args:', birthDateForLogging, gender);
      const bazi = new BaziCalculator(birthDateForLogging, gender);
      const userBazi = bazi.getCompleteAnalysis();

      // 6. Prepare prompt for DeepSeek API
      // const prompt = `Answer the following question in a detailed and insightful way, taking into account the user's Bazi birth chart information. Use a friendly and conversational tone. No questions or disclaimers or Chinese characters.\n\nUser's Bazi Chart:\n${JSON.stringify(userBazi)}\n\nQuestion: ${question}`;
      const prompt = `Answer the following question in a detailed and insightful way, taking into account the user's Bazi birth chart information. 
      Use a friendly and conversational tone. No questions or disclaimers or Chinese characters. Use natural markdown formatting for structure like headings, bold, and lists.\n\nUser's Bazi Chart:\n${JSON.stringify(userBazi)}\n\nQuestion: ${question}`;
      // Add "Do NOT use any special formatting like bolding, italics, or lists. Just plain text."

      // 7. Call DeepSeek API
      const res = await fetch('https://api.deepseek.com/v1/chat/completions ', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`DeepSeek API error: ${text}`);
      }

      const data = await res.json();
      const summary = data.choices?.[0]?.message?.content || '';

      // 8. Save response to Supabase
      const { error: saveError } = await supabase
        .from('chat')
        .insert({
          user_id: user.id,
          date: todayDateString,
          question,
          summary,
          created_at: new Date().toISOString(),
        });

      if (saveError) throw new Error('Failed to save answer');

      // 9. Update UI
      setResponse(summary);
      setIsAnswered(true);
    } catch (err: any) { // Type 'any' for err for flexibility in error handling
      console.error("Error in handleAsk:", err); // More descriptive console error
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setIsAnswered(false);
    setQuestion('');
    setResponse('');
    setError('');
  };

  return (
    <LinearGradient colors={['#36010F', '#922407']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ask FortunAI</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {isAnswered ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Your Question</Text>
            <TextInput
              style={styles.questionInput}
              value={question}
              editable={false}
              multiline
              placeholderTextColor="#ccc"
            />
            <Markdown
              style={{
                body: {
                  color: '#fff',
                  fontSize: 16,
                  lineHeight: 26,
                },
                h3: {
                  color: '#FFB74D',
                  fontWeight: 'bold',
                  marginTop: 16,
                  marginBottom: 8,
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
                link: {
                  color: '#FFB74D', // Highlight color for links
                  textDecorationLine: 'none', // Remove underline
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
         bold: {
           fontWeight: 'bold',
           color: '#FFB74D', // Bold text color
         },
         strong: {
          fontWeight: 'bold',
          color: '#FFB74D', // Bold text color
        },
         italic: {
          fontStyle: 'italic',
          color: '#FFB74D', // Italic text color
        },
        code_block: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: 10,
          borderRadius: 8,
          marginVertical: 10,
        },
        hr: {
          borderColor: '#FFB74D', // Change line color to orange
          borderWidth: 1,
          marginTop: 10,
          marginBottom: 10,
        },
              }}
            >
              {response}
            </Markdown>
            <TouchableOpacity style={styles.askAnotherButton} onPress={reset}>
              <Ionicons name="refresh" size={24} color="#fff" />
              <Text style={styles.askAnotherButtonText}>Ask Another</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.questionCard}>
            <Text style={styles.questionCardHeader}>Ask Your Question</Text>
            <TextInput
              style={styles.questionInput}
              placeholder="What's on your mind?"
              value={question}
              onChangeText={setQuestion}
              multiline
              placeholderTextColor="#ccc"
            />
            <TouchableOpacity
              style={styles.getAnswerButton}
              onPress={handleAsk}
              disabled={loading}
            >
              <Ionicons name="paper-plane" size={24} color="#fff" />
              <Text style={styles.getAnswerButtonText}>
                {loading ? 'Getting Answer...' : 'Get Answer'}
              </Text>
            </TouchableOpacity>
            {error ? <Text style={{ color: '#ff4d4f', marginTop: 8 }}>{error}</Text> : null}
            {loading && <ActivityIndicator size="large" color="#e94560" style={{ marginTop: 16 }} />}
          </View>
        )}
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
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 30,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    // width: '70%',
    alignSelf: 'center',
  },
  questionSection: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 12,
    marginTop: 40,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  questionInput: {
    height: 'auto',
    marginTop: 16,
    paddingLeft: 20,
    paddingTop: 15,
    backgroundColor: '#8f2c0c',
    borderRadius: 8,
    color: '#fff',
    
  },
  getAnswerButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B71C1C',
    paddingVertical: 12,
    borderRadius: 8,
  },
  getAnswerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 24,
    borderRadius: 12,
    marginTop: 40,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
 

  responseSection: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 12,
    marginTop: 40,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    minHeight: 200,
  },
  responseText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  askAnotherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B71C1C',
    paddingVertical: 12,
    borderRadius: 8,
  },
  askAnotherButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7EC8E3',
    marginBottom: 8,
  },
  questionBox: {
    backgroundColor: '#22334D',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#444',
    marginVertical: 12,
  },
  webCard: {
    backgroundColor: '#23344D',
    borderRadius: 12,
    padding: 24,
    marginTop: 40,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  webCardTitle: {
    color: '#7EC8E3',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  webCardQuestionBox: {
    backgroundColor: '#2D4060',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  webCardQuestion: {
    color: '#fff',
    fontSize: 16,
  },
  webCardDivider: {
    height: 1,
    backgroundColor: '#3A4A63',
    marginVertical: 16,
  },
  webCardAnswer: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  questionCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 24,
    marginTop: 48,
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'stretch',
  },
  questionCardHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFB74D',
    marginBottom: 16,
    textAlign: 'left',
  },
  webCardQuestion: {
    color: '#fff',
    fontSize: 16,
  },
  webCardDivider: {
    height: 1,
    backgroundColor: '#3A4A63',
    marginVertical: 16,
  },
  webCardAnswer: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
});

 