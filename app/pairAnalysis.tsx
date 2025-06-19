import Footer from '@/components/ui/Footer';
import { BaziCalculator } from '@/lib/bazi';
import { generateFreeReading } from '@/lib/deepseek';
import { supabase } from '@/lib/supabase'; // Assuming supabase is configured
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const purposesList = [
  'Romantic Relationship',
  'Business Partnership',
  'Friendship',
  'Family Relationship',
  'Mentorship',
  'Team Dynamics',
  'Creative Collaboration',
];

const markdownStyles = {
  body: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  heading1: {
    color: '#FFD700',
    fontWeight: '800',
    fontSize: 24,
    marginTop: 24,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  heading2: {
    color: '#FFA726',
    fontWeight: '700',
    fontSize: 20,
    marginTop: 20,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  strong: {
    color: '#FFD700',
    fontWeight: '700',
  },
  bullet_list: {
    marginLeft: 0,
    marginBottom: 16,
  },
  list_item: {
    color: '#fff',
    marginBottom: 8,
    lineHeight: 24,
  },
  unordered_list_icon: {
    color: '#FFD700',
  },
  paragraph: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    opacity: 0.9,
  },
};

export default function PairAnalysis() {
  const navigation = useNavigation();
  const [partnerName, setPartnerName] = useState('');
  const [partnerBirthDate, setPartnerBirthDate] = useState<Date | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [analysisText, setAnalysisText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formattedDate = partnerBirthDate ? partnerBirthDate.toISOString().split('T')[0] : '';

  const handlePurposeToggle = (purpose: string) => {
    setSelectedPurposes((prev) =>
      prev.includes(purpose)
        ? prev.filter((p) => p !== purpose)
        : [...prev, purpose]
    );
  };

  const isFormValid = partnerName && partnerBirthDate && selectedPurposes.length > 0;

  const fetchPairAnalysis = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. User Authentication
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      
     // 2.Check if user has an active subscription
    const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .single();

    if (!subscription || subscription.status !== 'active') {
      navigation.navigate('Pricing');
      return;
    }
      
      // 3. Get today's date in user's timezone
      const now = new Date();
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const todayDateString = new Date(now.toLocaleString('en-US', { timeZone: userTimezone }))
        .toLocaleDateString('en-CA', { timeZone: userTimezone });

      console.log('Checking for analysis for date:', todayDateString, 'in timezone:', userTimezone);

      // 4. Check if already generated today
      const { data: existingAnalysis, error: analysisError } = await supabase
        .from('pair')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', todayDateString)
        .single();

      if (!analysisError && existingAnalysis) {
        throw new Error("You've already generated a Pair Analysis today. Please try again tomorrow.");
      }

      // 5. Validate form input
      if (!partnerName || !partnerBirthDate || selectedPurposes.length === 0) {
        throw new Error('Partner details and purpose required');
      }

      // 6. Get user profile
      const { data: profile } = await supabase
        .from('userdata')
        .select('birth, gender')
        .eq('user_id', user.id)
        .single();
      if (!profile || !profile.birth) throw new Error('Profile not found');

      // 7. Calculate BaZi
      const userBirthDate = new Date(profile.birth);
      const userCalculator = new BaziCalculator(userBirthDate, profile.gender);
      const userAnalysis = userCalculator.getCompleteAnalysis();

      const partnerBirthDateObj = new Date(partnerBirthDate);
      if (isNaN(partnerBirthDateObj.getTime())) {
        throw new Error('Partner birth date is invalid.');
      }
      const partnerCalculator = new BaziCalculator(partnerBirthDateObj, 'male');
      const partnerAnalysis = partnerCalculator.getCompleteAnalysis();

      // 8. DeepSeek API
      const prompt = `Analyze the compatibility and relationship dynamics between these two individuals for the following purposes: ${selectedPurposes.join(', ')}. Focus on their strengths as a pair, potential challenges, and growth opportunities specific to these relationship types. Use "you" language and flowing paragraphs. No questions or disclaimers and no Chinese characters.
User Analysis: ${JSON.stringify(userAnalysis)}
Partner Analysis: ${JSON.stringify(partnerAnalysis)}`;

      const response = await generateFreeReading(prompt);

      let formattedAnalysis = response
        .replace(/fortunes:?\s*/gi, '')
        .replace(/[{}\[\]"]+/g, '')
        .replace(/,\s*([A-Z]|$)/g, '$1')
        .trim();

      // 9. Save to Supabase
      const { error: insertError } = await supabase
        .from('pair')
        .upsert({
          user_id: user.id,
          date: todayDateString,
          summary: formattedAnalysis,
          created_at: new Date().toISOString(),
        });

      if (insertError) throw new Error(insertError.message);

      setAnalysisText(formattedAnalysis);
      setShowResult(true);
    } catch (err: unknown) {
      console.error('Analysis Error:', err);
      setError(err instanceof Error ? err.message : 'Unable to generate analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LinearGradient colors={['#36010F', '#922407']} style={styles.container}>
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Pair Analysis</Text>
          <Text style={styles.headerSubtitle}>Discover your compatibility and relationship dynamics</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {showResult ? (
            <View style={styles.resultCardBeautiful}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultMainTitle}>Relationship Analysis</Text>
                <View style={styles.purposeTags}>
                  {selectedPurposes.map((purpose) => (
                    <View key={purpose} style={styles.purposePill}>
                      <Text style={styles.purposePillText}>{purpose}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <Text style={markdownStyles.body}>
                {analysisText}
              </Text>
              <TouchableOpacity style={styles.generateButton} onPress={() => setShowResult(false)}>
                <Ionicons name="refresh" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.generateButtonText}>Generate New Analysis</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Enter Partner Details</Text>
              <Text style={styles.label}>
                <Ionicons name="person-outline" size={20} color="#FFD700" style={{ marginRight: 8 }} />
                Partner's First Name
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter partner's first name"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={partnerName}
                onChangeText={setPartnerName}
              />
              <Text style={styles.label}>
                <Ionicons name="calendar-outline" size={20} color="#FFD700" style={{ marginRight: 8 }} />
                Partner's Birth Date
              </Text>
              {Platform.OS === 'web' ? (
                <input
                  type="date"
                  style={{
                    ...styles.input,
                    color: '#fff',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1.5px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 16,
                    outline: 'none',
                    fontSize: 16,
                  }}
                  value={formattedDate}
                  onChange={(e) => setPartnerBirthDate(e.target.value ? new Date(e.target.value) : undefined)}
                />
              ) : (
                <>
                  <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                    <Text
                      style={{
                        color: partnerBirthDate ? '#FFD700' : 'rgba(255, 255, 255, 0.5)',
                        fontSize: 16,
                      }}
                    >
                      {partnerBirthDate ? formattedDate : 'Select birth date'}
                    </Text>
                    <Ionicons name="calendar-outline" size={20} color="#FFD700" style={{ position: 'absolute', right: 16, top: 16 }} />
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={partnerBirthDate || new Date()}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={(_, date) => {
                        setShowDatePicker(false);
                        if (date) setPartnerBirthDate(date);
                      }}
                      maximumDate={new Date()}
                    />
                  )}
                </>
              )}
              <Text style={styles.label}>
                <MaterialCommunityIcons name="target" size={20} color="#FFD700" style={{ marginRight: 8 }} />
                Purpose of Analysis
              </Text>
              <View style={styles.checkboxGroup}>
                {purposesList.map((purpose) => (
                  <TouchableOpacity
                    key={purpose}
                    style={styles.checkboxRow}
                    onPress={() => handlePurposeToggle(purpose)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.checkboxBox, selectedPurposes.includes(purpose) && styles.checkboxBoxChecked]}>
                      {selectedPurposes.includes(purpose) && <Ionicons name="checkmark" size={18} color="#fff" />}
                    </View>
                    <Text style={styles.checkboxLabel}>{purpose}</Text>
                  </TouchableOpacity>
                ))}
              </View>
                        <TouchableOpacity 
            style={styles.generateButton} 
            onPress={() => fetchPairAnalysis()}
          >
            <Ionicons name="refresh" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.generateButtonText}>Generate New Analysis</Text>
          </TouchableOpacity>
              {loading && (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Analyzing compatibility...</Text>
                </View>
              )}
              {error && <Text style={styles.errorText}>{error}</Text>}
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  headerSubtitle: {
    color: '#FFD700',
    fontSize: 16,
    opacity: 0.9,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 35,
    left: 35,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  formCard: {
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
  label: {
    color: '#FFD700',
    fontWeight: '600',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
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
  checkboxGroup: {
    marginTop: 12,
    marginBottom: 24,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFD700',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxBoxChecked: {
    backgroundColor: '#FF9900',
    borderColor: '#FF9900',
  },
  checkboxLabel: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  generateButton: {
    flexDirection: 'row',
    backgroundColor: '#FF9900',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#FF9900',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  generateButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  resultCardBeautiful: {
    backgroundColor: 'rgba(75, 28, 28, 0.95)',
    borderRadius: 24,
    padding: 28,
    marginTop: 20,
    marginBottom: 56,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  resultMainTitle: {
    color: '#FFD700',
    fontWeight: '800',
    fontSize: 28,
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  purposeTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  purposePill: {
    backgroundColor: 'rgba(255, 153, 0, 0.2)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 153, 0, 0.3)',
  },
  purposePillText: {
    color: '#FFD700',
    fontWeight: '600',
    fontSize: 14,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    color: '#FFD700',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  formTitle: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  resultHeader: {
    marginBottom: 24,
  },
  generateButtonDisabled: {
    opacity: 0.5,
    backgroundColor: 'rgba(255, 153, 0, 0.5)',
  },
});