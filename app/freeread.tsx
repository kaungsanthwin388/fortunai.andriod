//Kyi Sin Thein
import Footer from '@/components/ui/Footer';
import { BaziCalculator } from '@/lib/baziCalculator';
import { generateFreeReading } from '@/lib/deepseek';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

let Markdown: any = null;
if (Platform.OS !== 'web') {
  Markdown = require('react-native-markdown-display').default;
} else {
  // @ts-ignore
  Markdown = ({ children }: any) => <div style={{ color: '#fff', whiteSpace: 'pre-wrap' }}>{children}</div>;
}

interface UserProfile {
  birth: string;
  gender: string;
  name?: string;
}

interface AnalysisResult {
  summary?: string;
  swot?: string;
  special?: string;
}

const markdownStyles = {
  summary: {
    body: {
      color: '#fff',
      fontSize: 16,
      lineHeight: 26,
    },
    heading1: {
      color: '#FFB74D',
      fontWeight: 'bold',
      fontSize: 24,
      marginTop: 20,
      marginBottom: 12,
    },
    heading2: {
      color: '#FFB74D',
      fontWeight: 'bold',
      fontSize: 20,
      marginTop: 16,
      marginBottom: 10,
    },
    heading3: {
      color: '#FFB74D',
      fontWeight: 'bold',
      fontSize: 18,
      marginTop: 16,
      marginBottom: 8,
    },
    strong: {
      fontWeight: 'bold',
      color: '#FFB74D',
    },
    paragraph: {
      marginBottom: 12,
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
  },
  swot: {
    body: {
      color: '#fff',
      fontSize: 16,
      lineHeight: 26,
    },
    heading1: {
      color: '#4ADE80',
      fontWeight: 'bold',
      fontSize: 24,
      marginTop: 20,
      marginBottom: 12,
    },
    heading2: {
      color: '#4ADE80',
      fontWeight: 'bold',
      fontSize: 20,
      marginTop: 16,
      marginBottom: 10,
    },
    heading3: {
      color: '#4ADE80',
      fontWeight: 'bold',
      fontSize: 18,
      marginTop: 16,
      marginBottom: 8,
    },
    strong: {
      fontWeight: 'bold',
      color: '#4ADE80',
    },
    paragraph: {
      marginBottom: 12,
    },
    bullet_list: {
      marginLeft: 0,
    },
    list_item: {
      marginBottom: 6,
      color: '#fff',
    },
    unordered_list_icon: {
      color: '#4ADE80',
    },
    code_block: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      padding: 10,
      borderRadius: 8,
      marginVertical: 10,
    },
    hr: {
      borderColor: '#4ADE80',
      borderWidth: 1,
      marginTop: 10,
      marginBottom: 10,
    },
  },
  special: {
    body: {
      color: '#fff',
      fontSize: 16,
      lineHeight: 26,
    },
    heading1: {
      color: '#60A5FA',
      fontWeight: 'bold',
      fontSize: 24,
      marginTop: 20,
      marginBottom: 12,
    },
    heading2: {
      color: '#60A5FA',
      fontWeight: 'bold',
      fontSize: 20,
      marginTop: 16,
      marginBottom: 10,
    },
    heading3: {
      color: '#60A5FA',
      fontWeight: 'bold',
      fontSize: 18,
      marginTop: 16,
      marginBottom: 8,
    },
    strong: {
      fontWeight: 'bold',
      color: '#60A5FA',
    },
    paragraph: {
      marginBottom: 12,
    },
    bullet_list: {
      marginLeft: 0,
    },
    list_item: {
      marginBottom: 6,
      color: '#fff',
    },
    unordered_list_icon: {
      color: '#60A5FA',
    },
    code_block: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      padding: 10,
      borderRadius: 8,
      marginVertical: 10,
    },
    hr: {
      borderColor: '#60A5FA',
      borderWidth: 1,
      marginTop: 10,
      marginBottom: 10,
    },
  },
};

const preprocessMarkdown = (content: string): string => {
  if (!content) return '';
  
  return content
    .replace(/\bbazi\b/gi, '')
    .replace(/\bBaZi\b/g, '')
    .replace(/\bBa Zi\b/gi, '')
    .replace(/\bFour Pillars\b/gi, '')
    .replace(/\bfour pillars\b/gi, '')
    .replace(/Based on the provided BaZi analysis,?\s*/gi, '')
    .replace(/According to the BaZi analysis,?\s*/gi, '')
    .replace(/From the BaZi perspective,?\s*/gi, '')
    .replace(/\*\*Personality Overview:\*\*/gi, '### Personality Overview')
    .replace(/\*\*SWOT Analysis:\*\*/gi, '### SWOT Analysis')
    .replace(/\*\*Life Path Guidance:\*\*/gi, '### Life Path Guidance')
    .replace(/\*\*Strengths:\*\*/gi, '### Strengths')
    .replace(/\*\*Opportunities:\*\*/gi, '### Opportunities')
    .replace(/\*\*Weaknesses:\*\*/gi, '### Weaknesses')
    .replace(/\*\*Threats:\*\*/gi, '### Threats')
    // Remove all markdown formatting symbols
    .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold formatting **text**
        // Remove italic formatting *text*
    .replace(/#{1,6}\s*/g, '')       // Remove all heading symbols ### 
    .replace(/---+/g, '')            // Remove horizontal rules ---
            // Replace multiple spaces with single space
    .trim();
};

const SubSection: React.FC<{
  title: string;
  content: string;
  icon: string;
  color: string;
  type: 'summary' | 'swot' | 'special';
}> = ({ title, content, icon, color, type }) => {
  if (!content) return null;

  return (
    <View style={styles.subSection}>
      <View style={styles.subSectionHeader}>
        <Ionicons name={icon as any} size={20} color={color} />
        <Text style={[styles.subSectionTitle, { color }]}>{title}</Text>
      </View>
      <View style={styles.subSectionContent}>
        {Platform.OS !== 'web' ? (
          <Markdown style={markdownStyles[type]}>
            {content}
          </Markdown>
        ) : (
          <Text style={styles.webText}>{content}</Text>
        )}
      </View>
    </View>
  );
};

const RenderContent: React.FC<{
  content: string;
  type: 'summary' | 'swot' | 'special';
}> = ({ content, type }) => {
  if (!content) return null;

  const processedContent = preprocessMarkdown(content);
  
  // Filter out SWOT-specific content for summary section
  let filteredContent = processedContent;
  if (type === 'summary') {
    filteredContent = processedContent
      .replace(/### SWOT Analysis[\s\S]*?(?=###|$)/gi, '')
      .replace(/### Strengths[\s\S]*?(?=###|$)/gi, '')
      .replace(/### Weaknesses[\s\S]*?(?=###|$)/gi, ''   )
      .replace(/### Opportunities[\s\S]*?(?=###|$)/gi, '')
      .replace(/### Threats[\s\S]*?(?=###|$)/gi, '')
      .trim();
  }

  return (
    <View style={styles.contentContainer}>
      {Platform.OS !== 'web' ? (
        <Markdown style={markdownStyles[type]}>
          {filteredContent}
        </Markdown>
      ) : (
        <Text style={styles.webText}>{filteredContent}</Text>
      )}
    </View>
  );
};

const GenerateAnalysisButton: React.FC<{
  type: 'swot' | 'special';
  onGenerate: (type: 'swot' | 'special') => void;
  loading: boolean;
  hasSubscription: boolean;
}> = ({ type, onGenerate, loading, hasSubscription }) => {
  const buttonText = type === 'swot' ? 'Generate SWOT Analysis' : 'Generate Special Analysis';
  const upgradeText = type === 'swot' ? 'Upgrade to unlock SWOT Analysis' : 'Upgrade to unlock Special Analysis';
  
  return (
    <TouchableOpacity
      style={[
        styles.generateButton,
        !hasSubscription && styles.upgradeButton,
        loading && styles.generateButtonDisabled
      ]}
      onPress={() => hasSubscription ? onGenerate(type) : null}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <>
          <Ionicons 
            name={hasSubscription ? "sparkles" : "lock-closed"} 
            size={20} 
            color="white" 
          />
          <Text style={styles.generateButtonText}>
            {hasSubscription ? buttonText : upgradeText}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const splitByHeaders = (content: string): string[] => {
  if (!content) return [];
  return content.split(/(?=###\s)/g).filter(section => section.trim());
};

export default function FreeAnalysisPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [generatingType, setGeneratingType] = useState<'swot' | 'special' | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Get authenticated user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser) {
        router.replace('/signin');
        return;
      }
      setUser(authUser);

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('userdata')
        .select('birth, gender, name')
        .eq('user_id', authUser.id)
        .single();

      if (profileError || !profileData) {
        router.replace('/complete_profile');
        return;
      }
      setProfile(profileData);

      // Check subscription status
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('subscription_status')
        .eq('id', authUser.id)
        .single();

      if (!userError && userData) {
        setHasSubscription(userData.subscription_status === 'active');
      }

      // Check for existing results
      const { data: existingResults } = await supabase
        .from('results')
        .select('summary, swot, special')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (existingResults) {
        setAnalysisResult(existingResults);
      } else {
        // Generate initial free reading
        await generateInitialReading(profileData);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const generateInitialReading = async (userProfile: UserProfile) => {
    try {
      const userBirthDate = new Date(userProfile.birth);
      console.log('User Profile Data:', userProfile);
      console.log('User Birth Date (parsed):', userBirthDate);

      if (isNaN(userBirthDate.getTime())) {
        throw new Error('Invalid birth date provided. Please check your profile information.');
      }

      const calculator = new BaziCalculator(userBirthDate, userProfile.gender, 8, true);
      const analysis = calculator.getCompleteAnalysis();

      const prompt = `Provide a comprehensive personality analysis for this individual. Focus on their core traits, natural tendencies, and character strengths. Use "you" language and flowing paragraphs. No questions or disclaimers and no Chinese characters.\n\nAnalysis: ${JSON.stringify(analysis)}`;

      const response = await generateFreeReading(prompt);
      const formattedResponse = response
        .replace(/fortunes?:?\s*/gi, '')
        .replace(/\*\*(.*?)\*\*/g, '**$1**')
        .replace(/\n\s*\n/g, '\n\n')
        .trim();

      const newResult = { summary: formattedResponse };
      setAnalysisResult(newResult);

      // Save to database
      await supabase
        .from('results')
        .insert({
          user_id: user.id,
          summary: formattedResponse
        });
    } catch (err: any) {
      setError(err.message || 'Failed to generate initial reading');
    }
  };

  const generateAnalysis = async (type: 'swot' | 'special') => {
    if (!profile || !hasSubscription) return;
    
    try {
      setGeneratingType(type);
      setError('');
      
      const userBirthDate = new Date(profile.birth);
      console.log('User Profile Data (for SWOT/Special):', profile);
      console.log('User Birth Date (parsed for SWOT/Special):', userBirthDate);
      
      if (isNaN(userBirthDate.getTime())) {
        throw new Error('Invalid birth date provided. Please check your profile information.');
      }

      const calculator = new BaziCalculator(userBirthDate, profile.gender, 8, true);
      const analysis = calculator.getCompleteAnalysis();

      let prompt = '';
      if (type === 'swot') {
        prompt = `Provide a detailed SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) for this individual. Focus on personal development and life strategy. Use "you" language and flowing paragraphs. No questions or disclaimers and no Chinese characters.\n\nAnalysis: ${JSON.stringify(analysis)}`;
      } else {
        prompt = `Provide special life guidance and insights for this individual. Focus on unique opportunities, hidden potentials, and personalized advice for their life journey. Use "you" language and flowing paragraphs. No questions or disclaimers and no Chinese characters.\n\nAnalysis: ${JSON.stringify(analysis)}`;
      }

      const response = await generateFreeReading(prompt);
      const formattedResponse = response
        .replace(/fortunes?:?\s*/gi, '')
        .replace(/\*\*(.*?)\*\*/g, '**$1**')
        .replace(/\n\s*\n/g, '\n\n')
        .trim();

      const updatedResult = {
        ...analysisResult,
        [type]: formattedResponse
      };
      setAnalysisResult(updatedResult);

      // Update database
      await supabase
        .from('results')
        .update({ [type]: formattedResponse })
        .eq('user_id', user.id);
        
    } catch (err: any) {
      setError(err.message || `Failed to generate ${type} analysis`);
    } finally {
      setGeneratingType(null);
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={['#36010F', '#922407']} style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Loading your destiny reading...</Text>
        </View>
        <Footer />
      </LinearGradient>
    );
  }

  if (!analysisResult?.summary) {
    return (
      <LinearGradient colors={['#36010F', '#922407']} style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.noReadingContainer}>
          <Text style={styles.noReadingTitle}>No Reading Available</Text>
          <TouchableOpacity
            style={styles.backToDashboard}
            onPress={() => router.push('/dashboard')}
          >
            <Text style={styles.backToDashboardText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
        {/* <Footer
        onPressHome={() => router.replace('/dashboard')}
        onPressPlans={() => router.replace('/pricing')}
        onPressMain={() => router.replace('/')}
        onPressMessages={() => router.replace('/messages')}
        onPressProfile={() => router.replace('/profile')}
      /> */}
      </LinearGradient>
    );
  }

  // Process content sections
  const personalityContent = preprocessMarkdown(analysisResult.summary || '');
  const swotContent = preprocessMarkdown(analysisResult.swot || '');
  const guidanceContent = preprocessMarkdown(analysisResult.special || '');

  // Split content into sections
  const personalitySections = splitByHeaders(personalityContent);
  const swotSections = splitByHeaders(swotContent);
  const guidanceSections = splitByHeaders(guidanceContent);

  return (
    <LinearGradient colors={['#36010F', '#922407']} style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Destiny Reading</Text>
        <TouchableOpacity onPress={() => router.push('/dashboard')} style={styles.dashboardButton}>
          <Text style={styles.dashboardText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View> */}

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>Your Destiny Reading</Text>
          <Text style={styles.introDescription}>
            Discover the three pillars of your destiny through ancient wisdom and modern insights.
          </Text>
          
          <View style={styles.pillarsContainer}>
            <View style={styles.pillar}>
              <Ionicons name="person-circle" size={24} color="#FFB74D" />
              <Text style={styles.pillarTitle}>Personality Overview</Text>
              {/* <Text style={styles.pillarDescription}>Core traits and natural tendencies</Text> */}
            </View>
            <View style={styles.pillar}>
              <Ionicons name="trending-up" size={24} color="#4ADE80" />
              <Text style={styles.pillarTitle}>Strengths & Opportunities</Text>
              {/* <Text style={styles.pillarDescription}>SWOT analysis for personal growth</Text> */}
            </View>
            <View style={styles.pillar}>
              <Ionicons name="compass" size={24} color="#60A5FA" />
              <Text style={styles.pillarTitle}>Life Path Suggestions</Text>
              {/* <Text style={styles.pillarDescription}>Guidance for your journey ahead</Text> */}
            </View>
          </View>
        </View>

        {/* Personality Overview Section */}
        {personalityContent && (
          <View style={styles.analysisSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-circle" size={30} color="#FFB74D" />
              <Text style={[styles.sectionTitle, { color: '#FFB74D' }]}>Personality Overview</Text>
            </View>
            <View style={styles.sectionCard}>
              <RenderContent content={personalityContent} type="summary" />
              {/* {personalitySections.map((section, index) => {
                const title = section.match(/###\s*(.+)/)?.[1] || `Section ${index + 1}`;
                return (
                  <SubSection
                    key={index}
                    title={title}
                    content={section}
                    icon="star"
                    color="#FFB74D"
                    type="summary"
                  />
                );
              })} */}
            </View>
          </View>
        )}

        {/* SWOT Analysis Section */}
        <View style={styles.analysisSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="trending-up" size={30} color="#4ADE80" />
            <Text style={[styles.sectionTitle, { color: '#4ADE80' }]}>Strengths & Opportunities</Text>
          </View>
          <View style={styles.sectionCard}>
            {swotContent ? (
              <>
                <RenderContent content={swotContent} type="swot" />
                {/* {swotSections.map((section, index) => {
                  const title = section.match(/###\s*(.+)/)?.[1] || `Section ${index + 1}`;
                  return (
                    <SubSection
                      key={index}
                      title={title}
                      content={section}
                      icon="checkmark-circle"
                      color="#4ADE80"
                      type="swot"
                    />
                  );
                })} */}
              </>
            ) : (
              <GenerateAnalysisButton
                type="swot"
                onGenerate={generateAnalysis}
                loading={generatingType === 'swot'}
                hasSubscription={hasSubscription}
              />
            )}
          </View>
        </View>

        {/* Life Path Guidance Section */}
        <View style={styles.analysisSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="compass" size={30} color="#60A5FA" />
            <Text style={[styles.sectionTitle, { color: '#60A5FA' }]}>Life Path Suggestions</Text>
          </View>
          <View style={styles.sectionCard}>
            {guidanceContent ? (
              <>
                <RenderContent content={guidanceContent} type="special" />
                {/* {guidanceSections.map((section, index) => {
                  const title = section.match(/###\s*(.+)/)?.[1] || `Section ${index + 1}`;
                  return (
                    <SubSection
                      key={index}
                      title={title}
                      content={section}
                      icon="compass"
                      color="#60A5FA"
                      type="special"
                    />
                  );
                })} */}
              </>
            ) : (
              <GenerateAnalysisButton
                type="special"
                onGenerate={generateAnalysis}
                loading={generatingType === 'special'}
                hasSubscription={hasSubscription}
              />
            )}
          </View>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'rgba(139, 69, 19, 0.3)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  dashboardButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dashboardText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  noReadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noReadingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  backToDashboard: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backToDashboardText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  introSection: {
    marginTop: 40,
    marginBottom: 20,
  },
  introTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'rgb(255, 183, 77)',
    textAlign: 'center',
    marginBottom: 20,
  },
  introDescription: {
    fontSize: 14,
    color: '#D1D5DB',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  pillarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  pillar: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.34)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  pillarTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
    lineHeight: 16,
  },
  pillarDescription: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 14,
  },
  analysisSection: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  sectionCard: {
    backgroundColor: 'rgba(108, 111, 115, 0.36)',
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(103, 41, 246, 0.47)',
  },
  contentContainer: {
    marginBottom: 16,
  },
  webText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 26,
    whiteSpace: 'pre-wrap',
  },
  subSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(139, 92, 246, 0.2)',
  },
  subSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subSectionContent: {
    marginLeft: 28,
  },
  generateButton: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 20,
    gap: 8,
  },
  upgradeButton: {
    backgroundColor: '#F59E0B',
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
  },
});