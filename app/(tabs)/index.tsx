import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// This root page will redirect to:
// - the tabs landing page for all users
// Later we can add logic to check if the user is signed in and redirect to dashboard

export default function LandingScreen() {
  return (
    <LinearGradient
    colors={['#36010F', '#7b1e05', '#36010F']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.container}
    >
      {/* Logo */}
      <View style={styles.headerContainer}>
      <Text style={styles.logo}>
        Fortun
        <Text style={styles.logoAccent}>AI</Text>
      </Text>
      <LinearGradient
            colors={['#FFD700', '#FF9900', '#FF5C39']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.headerLine}
          />
      </View>
      {/* Buttons */}
      <View style={styles.buttons}>
        {/* Sign In Button */}
        <Link href="/pricing" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </Link>

        {/* Register Button */}
        <Link href="/register" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD700', // Golden color for "Fortun"
    textAlign: 'center',
    marginBottom: 48,
  },
  logoAccent: {
    color: '#FFFFFF', // White color for "AI"
  },
  buttons: {
    width: '80%', // Adjust width as needed
    gap: 16,
  },
  button: {
    backgroundColor: '#FAF0E6', // Light beige button background
    paddingVertical: 16,
    borderRadius: 15, // Rounded corners for the buttons
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#36010F', // Dark reddish-brown button text
  },
  headerLine: {
    height: 4,
    width: 120,
    borderRadius: 2,
    marginTop: -40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
}); 