import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function PomodoroTimer() {
  const [timer, setTimer] = useState(60); // Study time set to 1 minute
  const [isStudyTime, setIsStudyTime] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timerInterval;
    if (isRunning) {
      timerInterval = setInterval(() => {
        setTimer((prev) => {
          if (prev > 0) return prev - 1;

          // Toggle between study and rest timers
          setIsStudyTime(!isStudyTime);
          return isStudyTime ? 300 : 60; // 5 min rest or 1 min study
        });
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [isRunning, isStudyTime]);

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>
        {isStudyTime ? 'Study Time' : 'Rest Time'}: {Math.floor(timer / 60)}:
        {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsRunning((prev) => !prev)}
      >
        <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  timerContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    backgroundColor: '#103E5B',
    borderRadius: 8,
    alignItems: 'center',
  },
  timerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#B2A561',
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
