import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NavBar from '../components/NavBar';

export default function ModeSelect() {
  const navigation = useNavigation();

  const modes = [
    {
      title: 'AI Study\nMode',
      description: 'Personalized, interactive sessions with AI.',
      icon: require('../../assets/chat.png'),
      route: 'Chat'
    },
    {
      title: 'Flashcards\nMode', 
      description: 'Quick, engaging memory boosters.',
      icon: require('../../assets/flashcards.png'),
      route: 'Flashcards'
    },
    {
      title: 'Quiz\nMode',
      description: 'Dynamic quizzes to test your knowledge.',
      icon: require('../../assets/quiz.png'),
      route: 'Quiz'
    }
  ];

  const handleModeSelect = (route) => {
    navigation.navigate(route);
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
            style={styles.modeCard}
            onPress={() => handleModeSelect(mode.route)}
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
    color: '#333'
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
    color: '#333'
  },
  modeDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666'
  }
});