import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NavBar from '../components/NavBar';

export default function StyleSelect() {
  const navigation = useNavigation();
  const [selectedCard, setSelectedCard] = useState(null);
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

  const modes = [
    {
      title: 'Pomodoro\nTechnique',
      description: 'Boost focus with timed study and break intervals.',
      icon: require('../../assets/clock-icon.png'),
      route: 'Chat',
    },
    {
      title: 'Candle\nStyle',
      description: 'Simulate traditional candlelight to create a focused study atmosphere.',
      icon: require('../../assets/flashcards.png'),
      route: 'Flashcards',
    },
    {
      title: 'Spaced\nRepetition',
      description: 'Enhance memory by reviewing material at optimized intervals.',
      icon: require('../../assets/timer.png'),
      route: 'Quiz',
    },
  ];

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Choose your study style</Text>

        {modes.map((mode, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.modeCard,
              selectedCard === index && styles.selectedCard,
            ]}
            onPress={() => {
              setSelectedCard(index);
              if (mode.title.includes('Pomodoro')) {
                setPomodoroActive(true);
                setTimer(1500); // Reset timer to 25 minutes
              } else {
                setPomodoroActive(false);
              }
              navigation.navigate(mode.route);
            }}
          >
            <Image source={mode.icon} style={styles.icon} resizeMode="contain" />
            <Text style={styles.modeTitle}>{mode.title}</Text>
            <Text style={styles.modeDescription}>{mode.description}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('ModeSelect')}
        >
          <Text style={styles.loginButtonText}>Next</Text>
        </TouchableOpacity>
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
    marginBottom: 30,
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
    backgroundColor: '#FBEFB0',
    borderColor: '#B2A561',
    borderWidth: 2,
  },
  loginButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#103E5B',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 50,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
});
