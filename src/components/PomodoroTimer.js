import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TimerContext } from './TimerContext';

export default function PomodoroTimer() {
  const { timer, isStudyTime, isRunning, setIsRunning } = useContext(TimerContext);

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
    marginTop: 50,
    padding: 20,
    backgroundColor: '#103E5B',
    borderRadius: 10,
    alignItems: 'center',
  },
  timerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#B2A561',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
