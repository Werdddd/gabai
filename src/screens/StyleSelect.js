import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NavBar from '../components/NavBar';

export default function StyleSelect() {
  const navigation = useNavigation();

  const modes = [
    {
      title: 'Pomodoro\nTechnique',
      description: 'Boost focus with timed study and break intervals.',
      icon: require('../../assets/clock-icon.png'),
      route: 'Chat'
    },
    {
      title: 'Candle\nStyle', 
      description: 'Simulate traditional candlelight to create a focused study atmosphere.',
      icon: require('../../assets/flashcards.png'),
      route: 'Flashcards'
    },
    {
      title: 'Spaced\nRepetition',
      description: 'Enhance memory by reviewing material at optimized intervals.',
      icon: require('../../assets/timer.png'),
      route: 'Quiz'
    }
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
            style={styles.modeCard}
            onPress={() => navigation.navigate(mode.route)}
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

        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('ModeSelect')}>
                  <Text style={styles.loginButtonText}>Next</Text>
                </TouchableOpacity>
        
        </ScrollView>
        <NavBar navigation={navigation}/>
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
    marginTop:40,
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
    marginBottom:50,
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
    tintColor: '#C0A080'
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
    color: '#B2A561'
  },
  modeDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666'
  }
});