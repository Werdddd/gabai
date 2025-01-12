import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NavBar from '../components/NavBar';
import PomodoroTimer from '../components/PomodoroTimer';
import { useGlobalContext } from '../components/GlobalState';
import ShareQRModal from '../components/ShareQRModal';
import QRCode from 'react-native-qrcode-svg';

export default function ModeSelect({ route, navigation }) {
  const [selectedReviewerCard, setSelectedReviewerCard] = useState(null);
  const {pickedStudyStyle, setPickedStudyStyle } = useGlobalContext();
  const [selectedStudyCard, setSelectedStudyCard] = useState(null);
  const reviewerId = route.params?.reviewerId;
  const [isPomodoroActive, setPomodoroActive] = useState(false);
  const [timer, setTimer] = useState(1500); // 25 minutes in seconds
  const [isStudyTime, setIsStudyTime] = useState(true);
  const [showOptions, setShowOptions] = useState(false); // Toggle options card
  const [isRunning, setIsRunning] = useState(false); // Control timer state

  useEffect(() => {
    let timerInterval;

    if (isRunning) {
      timerInterval = setInterval(() => {
        setTimer((prev) => {
          if (prev > 0) return prev - 1;

          // Toggle between study and rest
          setIsStudyTime(!isStudyTime);
          return isStudyTime ? 300 : 1500; // 5 min rest or 25 min study
        });
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [isRunning, isStudyTime]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const [isShareModalVisible, setShareModalVisible] = useState(false);

  const reviewerModes = [
    {
      title: 'Summary \nMode',
      description: 'Personalized, interactive sessions with AI.',
      icon: require('../../assets/chat.png'),
      route: 'Summary',
      params: { reviewerId }
    },
    {
      title: 'Flashcards\nMode',
      description: 'Quick, engaging memory boosters.',
      icon: require('../../assets/flashcards.png'),
      route: 'Flashcards',
      params: { reviewerId }
    },
    {
      title: 'Quiz\nMode',
      description: 'Dynamic quizzes to test your knowledge.',
      icon: require('../../assets/quiz.png'),
      route: 'Quiz',
      params: { reviewerId }
    }
  ];

  const studyModes = [
    {
      title: 'Pomodoro Technique',
      description: 'Boost focus with timed study and break intervals.',
      icon: require('../../assets/clock-icon.png'),
      route: 'Chat',
    },
    {
      title: 'Candle Style',
      description: 'Simulate traditional candlelight to create a focused study atmosphere.',
      icon: require('../../assets/flashcards.png'),
      route: 'Flashcards',
    },
    {
      title: 'Spaced Repetition',
      description: 'Enhance memory by reviewing material at optimized intervals.',
      icon: require('../../assets/timer.png'),
      route: 'Quiz',
    },
  ];

  const handleModeSelection = (mode, type) => {
    console.log("ModeSelect Screen - Navigating with reviewerId:", reviewerId);
    setSelectedStudyCard(mode.title);
    setPickedStudyStyle(mode.title);
    console.log('Picked Study Style:', mode.title); 
    // if (type === 'reviewer') {
    //   setSelectedReviewerCard(mode);
    // } else {
    //   setSelectedStudyCard(mode);
    // }
  };

  return (
    <>
      {selectedStudyCard === "Pomodoro Technique" && <PomodoroTimer/>}

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
      
        <Text style={styles.header}>Choose your reviewer style</Text>

        {reviewerModes.map((mode, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.modeCard,
              selectedReviewerCard === mode && styles.selectedCard 
            ]}
            onPress={() => handleModeSelection(mode, 'reviewer')}
          >
            <Image
              source={mode.icon}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.modeTitle}>{mode.title}</Text>
            <Text style={styles.modeDescription}>{mode.description}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.header}>Choose your study style</Text>

        {studyModes.map((mode, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.modeCard,
              selectedStudyCard === mode && styles.selectedCard // Apply highlight if selected
            ]}
            onPress={() => handleModeSelection(mode, 'study')}
          >
            <Image
              source={mode.icon}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.modeTitle}>{mode.title}</Text>
            <Text style={styles.modeDescription}>{mode.description}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => {
              if (selectedReviewerCard && selectedStudyCard) {
                navigation.navigate(selectedReviewerCard.route, { reviewerId: reviewerId });
              }
            }}
          >
            <Text style={styles.loginButtonText}>Next</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.shareButton}
            onPress={() => setShareModalVisible(true)}
          >
            <Image
              source={require('../../assets/scan-qr.jpg')}
              style={styles.shareIcon}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {isPomodoroActive && (
        <TouchableOpacity
          style={styles.floatingTimer}
          onPress={() => setShowOptions(true)}
        >
          <Text style={styles.timerText}>
            {isStudyTime ? 'Study Time' : 'Rest Time'}: {formatTime(timer)}
          </Text>
        </TouchableOpacity>
      )}

      {showOptions && (
        <View style={styles.optionsCard}>
          <Text style={styles.optionsTitle}>Pomodoro Timer Options</Text>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setIsRunning(!isRunning)}
          >
            <Text style={styles.optionButtonText}>
              {isRunning ? 'Pause Timer' : 'Start Timer'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              setTimer(1500);
              setIsStudyTime(true);
              setIsRunning(false);
            }}
          >
            <Text style={styles.optionButtonText}>Reset Timer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, styles.closeButton]}
            onPress={() => setShowOptions(false)}
          >
            <Text style={styles.optionButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}

      <NavBar navigation={navigation} />

      <ShareQRModal
        isVisible={isShareModalVisible}
        onClose={() => setShareModalVisible(false)}
        reviewerId={reviewerId}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 18,
    color: '#333',
    marginTop: 40,
  },
  modeCard: {
    width: '80%',
    padding: 30,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    backgroundColor: '#FBEFB0', // Highlight color for selected card
    borderColor: '#B2A561',
    borderWidth: 2,
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 10,
    tintColor: '#C0A080',
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
    color: '#B2A561',
  },
  modeDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
  loginButton: {
    width: '80%',
    backgroundColor: '#103E5B',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    height: 40
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  floatingTimer: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#ffecb3',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  optionsCard: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#103E5B',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5,
  },
  closeButton: {
    backgroundColor: '#B22222',
  },
  optionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: '#B2A561',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
  },
  shareIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
 
    marginBottom: 40
  },
});
