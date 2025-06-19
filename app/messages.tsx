import Footer from '@/components/ui/Footer';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../lib/supabase'; // Adjust path if needed

dayjs.extend(relativeTime);

export default function MessagesScreen() {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    supabase
      .from('messages')
      .select('id, created_at, message, title')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setMessages(data);
        setLoading(false);
      });
  }, []);

  return (
    <LinearGradient colors={['#36010F', '#922407']} style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={() => {
          setLoading(true);
          supabase
            .from('messages')
            .select('id, created_at, message, title')
            .order('created_at', { ascending: false })
            .then(({ data, error }) => {
              if (!error && data) setMessages(data);
              setLoading(false);
            });
        }}
        renderItem={({ item }) => (
          <View style={styles.messageCard}>
            <View style={styles.avatarSection}>
              {/* <Image source={adminAvatar} style={styles.avatar} /> */}
              <Text style={styles.adminLabel}>FortunAI</Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.message}</Text>
            <Text style={styles.date}>{item.created_at ? dayjs(item.created_at).fromNow() : ''}</Text>
          </View>
        )}
      />
      {messages.length === 0 && !loading && (
        <Text style={styles.emptyMessage}>No notifications available.</Text>
      )}
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
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 24,
    alignSelf: 'center',
  },
  listContent: {
    paddingBottom: 80,
  },
  messageCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 18,
    marginBottom: 1,
    elevation: 2,
    marginTop: 20,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  adminLabel: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 15,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 10,
  },
  body: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 10,
    marginTop: 10,
    lineHeight: 30,
  },
  date: {
    color: '#FFD700',
    fontSize: 13,
    alignSelf: 'flex-end',
  },
  emptyMessage: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});