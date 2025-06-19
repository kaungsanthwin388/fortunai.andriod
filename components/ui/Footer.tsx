import { Feather as Icon } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FooterProps {
  onPressHome: () => void;
  onPressPlans: () => void;
  onPressMain: () => void;
  onPressMessages: () => void;
  onPressProfile: () => void;
  onPressFreeRead: () => void;
  onPressDailyReading: () => void;
  onPressPairAnalysis: () => void;
  onPressAskAQuestion: () => void;
}

const FortuneBoxes = ({
  onClose,
  onPressFreeRead,
  onPressDailyReading,
  onPressPairAnalysis,
  onPressAskAQuestion,
}: {
  onClose: () => void;
  onPressFreeRead: () => void;
  onPressDailyReading: () => void;
  onPressPairAnalysis: () => void;
  onPressAskAQuestion: () => void;
}) => {
  const slideAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.fortuneBoxesContainer,
        {
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      {/* Close Button */}
      {/* <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Icon name="x" size={24} color="#fff" />
      </TouchableOpacity> */}

      {/* Boxes */}
      <View style={styles.box1}>
        <TouchableOpacity style={styles.boxLink1} onPress={onPressFreeRead}>
          <Text style={styles.boxText}>Your Free Fortune Reading</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.box}>
        <TouchableOpacity style={styles.boxLink} onPress={onPressDailyReading}>
          <Text style={styles.boxText}>Daily Reading (Pro)</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.box}>
        <TouchableOpacity style={styles.boxLink} onPress={onPressPairAnalysis}>
          <Text style={styles.boxText}>Pair Analysis (Pro)</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.box}>
        <TouchableOpacity style={styles.boxLink} onPress={onPressAskAQuestion}>
          <Text style={styles.boxText}>Ask A Question (Pro)</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default function Footer({
  onPressHome,
  onPressPlans,
  onPressMain,
  onPressMessages,
  onPressProfile,
  onPressFreeRead,
  onPressDailyReading,
  onPressPairAnalysis,
  onPressAskAQuestion,
}: FooterProps) {
  const [showFortuneBoxes, setShowFortuneBoxes] = useState(false);

  const handleMainButtonPress = () => {
    setShowFortuneBoxes(!showFortuneBoxes);
  };

  return (
    <View style={styles.footerContainer}>
      {showFortuneBoxes && (
        <FortuneBoxes 
          onClose={handleMainButtonPress}
          onPressFreeRead={onPressFreeRead}
          onPressDailyReading={onPressDailyReading}
          onPressPairAnalysis={onPressPairAnalysis}
          onPressAskAQuestion={onPressAskAQuestion}
        />
      )}
      <View style={styles.footer}>
        {/* Home */}
        <TouchableOpacity onPress={onPressHome} style={styles.item}>
          <Icon name="home" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Plans */}
        <TouchableOpacity onPress={onPressPlans} style={styles.item}>
          <Icon name="star" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Main (center) */}
        <TouchableOpacity
          onPress={handleMainButtonPress}
          style={styles.mainButton}
        >
          {showFortuneBoxes ? (
            <Icon name="x" size={28} color="#fff" /> // Show close icon
          ) : (
            <Icon name="grid" size={28} color="#fff" /> // Show grid icon
          )}
        </TouchableOpacity>

        {/* Messages with badge */}
        <TouchableOpacity onPress={onPressMessages} style={styles.item}>
          <View>
            <Icon name="message-square" size={24} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity onPress={onPressProfile} style={styles.item}>
          <Icon name="user" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#601704',
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 12,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 15,
    color: '#fff',
  },
  mainButton: {
    backgroundColor: '#FFD700',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 10, // Ensure the button is above the boxes
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  fortuneBoxesContainer: {
    position: 'absolute',
    top: -310, // Adjust as needed to position above the button
    left: 0,
    right: 0,
    alignItems: 'center', // Center horizontally
    zIndex: 11, // Ensure the boxes are above other elements
    paddingHorizontal: 20,
  },
  box: {
    backgroundColor: '#FFA500', // Example color, adjust as needed
    padding: 15,
    borderRadius: 30,
    marginVertical: 10,
    width: '80%', // Make boxes take full width
    height: 50,
    alignItems: 'center',
  },
  box1: {
    backgroundColor: '#c41f08', // Example color, adjust as needed
    padding: 15,
    borderRadius: 30,
    marginVertical: 10,
    width: '80%', // Make boxes take full width
    alignItems: 'center',
    height: 50,
  },
  boxText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  closeButton: {
    position: 'absolute',
    top: -30, // Position above the boxes
    right: 0,
    backgroundColor: '#FFD700',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 12,
  },
    boxLink: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    boxLink1: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
});