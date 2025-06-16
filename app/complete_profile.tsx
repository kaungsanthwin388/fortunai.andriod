//Kaung San Thwin //Kyi Sin Thein
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Text,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, Stack, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import DateTimePicker from '@react-native-community/datetimepicker';
import Footer from '@/components/ui/Footer';
import { Header } from '@react-navigation/elements';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase'; // Make sure this import exists

type HeaderProps = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
};

const purposes = [
  'Love', 'Marriage', 'Business', 'Career', 'Education', 'Health', 'Finances', 'Social'
];
const genders = ['Male', 'Female', 'Other'];

export default function DashboardScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | undefined>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [purpose, setPurpose] = useState('');
  const [gender, setGender] = useState('');
  const [agree, setAgree] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Format date as mm/dd/yyyy
  const formattedDate = birthDate
    ? birthDate.toLocaleDateString('en-US')
    : '';

  // Date change handler
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  const handleCompleteProfile = async () => {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('No user found');
      return;
    }

    // Insert or upsert the profile data into 'userdata'
    const { error } = await supabase
      .from('userdata')
      .upsert([
        {
          user_id: user.id,
          name: firstName,
          birth: birthDate ? birthDate.toISOString() : null,
          purpose,
          gender,
        }
      ]); // Removed onConflict option

    if (error) {
      alert('Failed to save profile: ' + error.message);
      return;
    }

    // Navigate to profile.tsx and pass profile data as params
    router.replace({
      pathname: '/profile',
      params: {
        firstName,
        birthDate: birthDate ? birthDate.toISOString() : '',
        purpose,
        gender,
      },
    });
  };

  if (profileComplete) {
    // Remove the profile summary card and "Others" section here
    // Instead, immediately navigate to profile.tsx
    handleCompleteProfile();
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={['#FFD700', '#FF9900', '#FF5C39']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ flex: 1 }}
      >
        <View style={styles.overlay}>

          <ScrollView style={{ flex: 1, marginTop: -30, paddingHorizontal: 20 }}>
            <Text style={styles.pageTitle}>Complete Your Profile</Text>
            <Text style={styles.pageSubtitle}>Help us personalize your experience</Text>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Full Name"
              placeholderTextColor="#888"
            />
            <Text style={styles.label}>Birth Date</Text>
            {Platform.OS === 'web' ? (
              <input
                type="date"
                style={{
                  ...styles.input,
                  color: '#fff',
                  background: '#181f2a',
                  border: '1px solid #FF5C39',
                  borderRadius: 10,
                  padding: 15,
                  marginBottom: 12,
                  outline: 'none',
                  fontSize: 16,
                }}
                value={birthDate ? birthDate.toISOString().split('T')[0] : ''}
                onChange={e => setBirthDate(e.target.value ? new Date(e.target.value) : undefined)}
                required
              />
            ) : (
              <>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <View style={styles.dateInputContainer}>
                    <Text style={styles.dateInputText}>{birthDate ? formattedDate : 'mm/dd/yyyy'}</Text>
                    <Ionicons name="calendar-outline" size={24} color="#fff" />
                  </View>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={birthDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                    maximumDate={new Date()}
                  />
                )}
              </>
            )}
            <Text style={styles.label}>Purpose of Search</Text>
            <View style={styles.purposeGrid}>
              {purposes.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.purposeButton,
                    purpose === item && styles.purposeButtonActive,
                  ]}
                  onPress={() => setPurpose(item)}
                >
                  <Text style={styles.purposeButtonText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>Gender</Text>
            {genders.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.genderButton,
                  gender === item && styles.genderButtonActive, // Apply active style here
                ]}
                onPress={() => setGender(item)}
              >
                <Text style={styles.genderButtonText}>{item}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.checkboxRow}>
              <TouchableOpacity onPress={() => setAgree(!agree)} style={styles.checkboxBox}>
                {agree && <Ionicons name="checkmark" size={18} color="#fff" />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>
                I have read and agree to the <Text style={{ color: '#FF5C39' }}>Terms of Service</Text>
              </Text>
            </View>

            <TouchableOpacity
              disabled={!agree || !firstName || !birthDate || !purpose || !gender}
              onPress={handleCompleteProfile}
            >
              <Text style={styles.buttonText}>Complete Profile</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

      </LinearGradient>
    </>
  );
}

// export default function CompleteProfileScreen() {
//   const router = useRouter();
//   const [firstName, setFirstName] = useState('');
//   const [birthDate, setBirthDate] = useState<Date | undefined>(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [purpose, setPurpose] = useState('');
//   const [gender, setGender] = useState('');
//   const [agree, setAgree] = useState(false);
//   const [profileComplete, setProfileComplete] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);

//   // Format date as mm/dd/yyyy
//   const formattedDate = birthDate
//     ? birthDate.toLocaleDateString('en-US')
//     : '';

//   // Date change handler
//   const onDateChange = (event: any, selectedDate?: Date) => {
//     setShowDatePicker(false);
//     if (selectedDate) {
//       setBirthDate(selectedDate);
//     }
//   };

//   if (profileComplete) {
//     return (
//       <>
//         <Stack.Screen options={{ headerShown: false }} />
//         <LinearGradient
//           colors={['#FFD700', '#FF9900', '#FF5C39']}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//           style={{ flex: 1 }}
//         >
//           <View style={styles.overlay}>
//             <ScrollView style={{ flex: 1, padding: 16 }} contentContainerStyle={{ alignItems: 'center', paddingBottom: 32 }}>
//               <View style={{ width: '100%', maxWidth: 400 }}>
//                 <Text style={styles.welcomeText}>
//                   Welcome,
//                   {''}
//                   <Text style={{ color: '#FFD700' }}>{firstName}</Text>
//                 </Text>

//                 <View style={styles.profileCard}>
//                   <Text style={styles.profileTitle}>Profile Information</Text>
//                   <TouchableOpacity style={styles.othersItem} onPress={() => router.replace('/profile')}>
//                     <Text style={styles.profileLabel}>Name</Text>
//                     <Text style={styles.profileValue}>{firstName}</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={styles.othersItem} onPress={() => router.replace('/profile')}>
//                     <Text style={styles.profileLabel}>Birth Date</Text>
//                     <Text style={styles.profileValue}>{formattedDate}</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={styles.othersItem} onPress={() => router.replace('/profile')}>
//                     <Text style={styles.profileLabel}>Purpose</Text>
//                     <Text style={styles.profileValue}>{purpose}</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={styles.othersItem} onPress={() => router.replace('/profile')}>
//                     <Text style={styles.profileLabel}>Gender</Text>
//                     <Text style={styles.profileValue}>{gender}</Text>
//                   </TouchableOpacity>
//                 </View>

//                 <View style={styles.othersSection}>
//                   <Text style={styles.othersTitle}>Others</Text>
//                   <TouchableOpacity style={styles.othersItem}>
//                     <Ionicons name="chatbubble-ellipses-outline" size={24} color="#fff" style={styles.othersIcon} />
//                     <Text style={styles.othersText}>Send feedback</Text>
//                     {/* <Ionicons name="chevron-forward-outline" size={20} color="#fff" /> */}
//                   </TouchableOpacity>
//                   <Link href="/setting" style={styles.othersItem}>
//                     <Ionicons name="settings-outline" size={24} color="#fff" style={styles.othersIcon} />
//                     <Text style={styles.othersText}>Account Settings</Text>
//                     {/* <Ionicons name="chevron-forward-outline" size={20} color="#fff" /> */}
//                   </Link>
//                   <TouchableOpacity style={styles.othersItem}>
//                     <Ionicons name="information-circle-outline" size={24} color="#fff" style={styles.othersIcon} />
//                     <Text style={styles.othersText}>About</Text>
//                     {/* <Ionicons name="chevron-forward-outline" size={20} color="#fff" /> */}
//                   </TouchableOpacity>
//                   <TouchableOpacity style={styles.logoutItem} onPress={() => router.replace('/')}>
//                     <Ionicons name="log-out-outline" size={24} color="#FF4500" style={styles.othersIcon} />
//                     <Text style={styles.logoutText}>Log out</Text>
//                   </TouchableOpacity>
//                 </View>

//               </View>
//             </ScrollView>
//           </View>
//           <Footer
//             onPressHome={() => router.replace('/')}
//             onPressPlans={() => router.replace('/pricing')}
//             onPressMain={() => router.replace('/dashboard')}
//             onPressMessages={() => router.replace('/')}
//             onPressProfile={() => router.replace('/setting')}
//           />
//         </LinearGradient>
//       </>
//     );
//   }

//   return (
//     <>
//       <Stack.Screen options={{ headerShown: false }} />
//       <LinearGradient
//         colors={['#FFD700', '#FF9900', '#FF5C39']}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//         style={{ flex: 1 }}
//       >
//         <View style={styles.overlay}>

//           <ScrollView style={{ flex: 1, marginTop: -30, paddingHorizontal: 20 }}>
//             <Text style={styles.pageTitle}>Complete Your Profile</Text>
//             <Text style={styles.pageSubtitle}>Help us personalize your experience</Text>
//             <Text style={styles.label}>First Name</Text>
//             <TextInput
//               style={styles.input}
//               value={firstName}
//               onChangeText={setFirstName}
//               placeholder="First Name"
//               placeholderTextColor="#888"
//             />
//             <Text style={styles.label}>Birth Date</Text>
//             {Platform.OS === 'web' ? (
//               <input
//                 type="date"
//                 style={{
//                   ...styles.input,
//                   color: '#fff',
//                   background: '#181f2a',
//                   border: '1px solid #FF5C39',
//                   borderRadius: 10,
//                   padding: 15,
//                   marginBottom: 12,
//                   outline: 'none',
//                   fontSize: 16,
//                 }}
//                 value={birthDate ? birthDate.toISOString().split('T')[0] : ''}
//                 onChange={e => setBirthDate(e.target.value ? new Date(e.target.value) : undefined)}
//                 required
//               />
//             ) : (
//               <>
//                 <TouchableOpacity onPress={() => setShowDatePicker(true)}>
//                   <View style={styles.dateInputContainer}>
//                     <Text style={styles.dateInputText}>{birthDate ? formattedDate : 'mm/dd/yyyy'}</Text>
//                     <Ionicons name="calendar-outline" size={24} color="#fff" />
//                   </View>
//                 </TouchableOpacity>
//                 {showDatePicker && (
//                   <DateTimePicker
//                     value={birthDate || new Date()}
//                     mode="date"
//                     display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                     onChange={onDateChange}
//                     maximumDate={new Date()}
//                   />
//                 )}
//               </>
//             )}
//             <Text style={styles.label}>Purpose of Search</Text>
//             <View style={styles.purposeGrid}>
//               {purposes.map((item) => (
//                 <TouchableOpacity
//                   key={item}
//                   style={[
//                     styles.purposeButton,
//                     purpose === item && styles.purposeButtonActive,
//                   ]}
//                   onPress={() => setPurpose(item)}
//                 >
//                   <Text style={styles.purposeButtonText}>{item}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//             <Text style={styles.label}>Gender</Text>
//             {genders.map((item) => (
//               <TouchableOpacity
//                 key={item}
//                 style={[
//                   styles.genderButton,
//                   gender === item && styles.genderButtonActive, // Apply active style here
//                 ]}
//                 onPress={() => setGender(item)}
//               >
//                 <Text style={styles.genderButtonText}>{item}</Text>
//               </TouchableOpacity>
//             ))}
//             <View style={styles.checkboxRow}>
//               <TouchableOpacity onPress={() => setAgree(!agree)} style={styles.checkboxBox}>
//                 {agree && <Ionicons name="checkmark" size={18} color="#fff" />}
//               </TouchableOpacity>
//               <Text style={styles.checkboxLabel}>
//                 I have read and agree to the <Text style={{ color: '#FF5C39' }}>Terms of Service</Text>
//               </Text>
//             </View>

//             <TouchableOpacity

//               disabled={!agree || !firstName || !birthDate || !purpose || !gender} // Ensure gender is also selected
//               onPress={() => setProfileComplete(true)}
//             >
//               <Text style={styles.buttonText}>Complete Profile</Text>
//             </TouchableOpacity>
//           </ScrollView>
//         </View>

//       </LinearGradient>
//     </>
//   );
// }

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
    elevation: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 28,
    color: '#fff',
    letterSpacing: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(140, 91, 5, 1)', // Darker background for better contrast
    paddingHorizontal: 20, // Add consistent horizontal padding
  },

  pageTitle: {
    fontSize: 30, // Even larger for emphasis
    fontWeight: 'bold',
    color: '#f9bc0d',
    marginTop: 60 + 24, // Adjust top margin for header and spacing
    marginBottom: 12,
    textAlign: 'center', // Center the title
  },
  pageSubtitle: {
    color: '#ccc',
    marginBottom: 32,
    textAlign: 'center',
    fontSize: 16, // Slightly larger subtitle
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 20, // Increased vertical spacing
    marginBottom: 8,
    fontSize: 18, // Larger label font
  },
  input: {
    backgroundColor: '#181f2a',
    borderRadius: 10, // Slightly more rounded
    borderWidth: 1,
    borderColor: '#FF5C39',
    color: '#fff',
    padding: 15, // Increased padding
    marginBottom: 12, // Increased vertical spacing
    fontSize: 16,
  },
  purposeGrid: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12, // Adjust gap
    justifyContent: 'space-around', // Distribute buttons more evenly
    width: '100%',
  },
  purposeButton: {
    backgroundColor: '#B71C1C',
    borderRadius: 25, // More rounded buttons
    paddingVertical: 14, // Increased padding
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#FF5C39',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%', // Slightly smaller to account for gap
    marginBottom: 12, // Add margin between rows
  },
  purposeButtonActive: {
    borderColor: '#FFD700',
    borderBottomWidth: 5, // More prominent active indicator
    borderBottomColor: '#FFD700',
  },
  purposeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17, // Larger text
  },
  genderButton: {
    backgroundColor: '#B71C1C',
    borderRadius: 25, // More rounded
    paddingVertical: 14, // Increased padding
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#FF5C39',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10, // Increased vertical margin
    width: '100%', // Full width for gender buttons
  },
  genderButtonActive: {
    borderColor: '#FFD700',
    borderBottomWidth: 5,
    borderBottomColor: '#FFD700',
  },
  genderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17, // Larger text
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20, // Increased vertical margin
  },
  checkboxBox: {
    width: 25, // Slightly larger checkbox
    height: 25,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FF5C39',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#181f2a',
  },
  checkboxLabel: {
    color: '#fff',
    fontSize: 16, // Slightly larger
  },
  button: {
    backgroundColor: '#FF5C39',
    borderRadius: 10, // More rounded
    paddingVertical: 16, // Increased padding
    alignItems: 'center',
    marginTop: 20, // Increased top margin
    marginBottom: 40, // Increased bottom margin
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20, // Larger button text
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 40,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f9bc0d',
    backgroundColor: '#f9bc0d',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 24,
    marginBottom: 16,
    lineHeight: 40,
    textAlign: 'center',
  },
  signOutButton: {
    position: 'absolute',
    top: 70,
    right: 20,
    backgroundColor: '#FF2D2D',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    zIndex: 20,
  },
  signOutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  profileCard: {
    backgroundColor: 'rgba(17,24,39,0.95)',
    borderRadius: 25, // More rounded
    padding: 24,
    marginVertical: 32,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  profileTitle: {
    color: '#FF5C39',
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 18,
    textAlign: 'center',
  },
  profileLabel: {
    color: '#ccc',
    fontSize: 16,
    marginTop: 14,
  },
  profileValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 4,
  },
  goldButton: {
    backgroundColor: '#FFD700',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  goldButtonText: {
    color: '#111827', // Dark text on gold
    fontWeight: 'bold',
    fontSize: 20,
  },
  redButton: {
    backgroundColor: '#FF2D2D',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  dateInputContainer: {
    backgroundColor: '#181f2a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF5C39',
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateInputText: {
    color: '#fff',
    fontSize: 16,
  },
  othersSection: {
    marginTop: 10,
    backgroundColor: 'rgba(17,24,39,0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 50,
  },
  othersTitle: {
    color: '#FF5C39',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  othersItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#333',
    justifyContent: 'space-between',
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    justifyContent: 'flex-start', // Align items to the start for logout
  },
  othersIcon: {
    marginRight: 16,
  },
  othersText: {
    color: '#fff',
    fontSize: 18,
    flex: 1, // Take up remaining space
  },
  logoutText: {
    color: '#FF4500',
    fontSize: 18,
    marginLeft: 16,
    flex: 1,
  },
});