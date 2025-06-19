import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { registerRootComponent } from 'expo';
import React from 'react';

import AboutScreen from './app/about';
import AskAQuestionScreen from './app/ask_a_question';
import DailyReadingScreen from './app/dailyreading';
import DashboardScreen from './app/dashboard';
import FeedbackScreen from './app/feedback';
import FreeReadScreen from './app/freeread';
import LandingScreen from './app/index';
import MessagesScreen from './app/messages';
import PairAnalysisScreen from './app/pairAnalysis';
import PricingScreen from './app/pricing';
import ProfileScreen from './app/profile';
import RegisterScreen from './app/register';
import SettingScreen from './app/setting';
import SigninScreen from './app/signin';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['http://localhost:8081', 'fortunai://'],
  config: {
    screens: {
      Landing: '',
      Signin: 'signin',
      Register: 'register',
      Dashboard: 'dashboard',
      FreeRead: 'freeread',
      PairAnalysis: 'pairAnalysis',
      Profile: 'profile',
      Pricing: 'pricing',
      Messages: 'messages',
      DailyReading: 'dailyreading',
      AskAQuestion: 'askaquestion',
    },
  },
};

// Main App component
export function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen 
          name="Landing" 
          component={LandingScreen} 
          options={{ title: 'Fortunai', headerShown: false }}
        />
        <Stack.Screen 
          name="Signin" 
          component={SigninScreen} 
          options={{ title: 'Sign In', headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ title: 'Register', headerShown: false }}
        />
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen} 
          options={{ title: 'Dashboard', headerShown: false }}
        />
        <Stack.Screen 
          name="FreeRead" 
          component={FreeReadScreen} 
          options={{ title: 'Free Reading', headerShown: false }}
        />
        <Stack.Screen 
          name="PairAnalysis" 
          component={PairAnalysisScreen} 
          options={{ title: 'Pair Analysis', headerShown: false }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ title: 'Profile', headerShown: false }}
        />
        <Stack.Screen 
          name="Pricing" 
          component={PricingScreen} 
          options={{ title: 'Pricing', headerShown: false }}
        />
        <Stack.Screen 
          name="Messages" 
          component={MessagesScreen} 
          options={{ title: 'Messages', headerShown: false }}
        />
        <Stack.Screen name="Feedback" component={FeedbackScreen} options={{ title: 'Feedback', headerShown: false }} />
        <Stack.Screen name="About" component={AboutScreen} options={{ title: 'About', headerShown: false }} />
        <Stack.Screen name="Setting" component={SettingScreen} options={{ title: 'Account Settings', headerShown: false }} />
        <Stack.Screen name="AskAQuestion" component={AskAQuestionScreen} options={{ title: 'Ask A Question', headerShown: false }} />
        <Stack.Screen name="DailyReading" component={DailyReadingScreen} options={{ title: 'Daily Reading', headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Register the main component
registerRootComponent(App); 