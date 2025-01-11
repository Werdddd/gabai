import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NavBar from '../components/NavBar';
import PomodoroTimer from '../components/PomodoroTimer';

export default function ModeSelect({ route, navigation }) {
  const [selectedCard, setSelectedCard] = useState(null); 
  const reviewerId = route.params?.reviewerId;
  console.log("ModeSelect Screen - Received reviewerId:", reviewerId); // Debug log

  const modes = [
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

  const handleModeSelection = (mode) => {
    console.log("ModeSelect Screen - Navigating with reviewerId:", reviewerId);
    navigation.navigate(mode.route, { reviewerId: reviewerId }); // Ensure mode.route is a string
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
      
        <Text style={styles.header}>Choose your reviewer style</Text>

        {modes.map((mode, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.modeCard,
              selectedCard === index && styles.selectedCard // Apply highlight if selected
            ]}
            onPress={() => {
              
              setSelectedCard(index);
              handleModeSelection(mode); // Pass the entire mode object
            }}
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
      </ScrollView>
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
});
