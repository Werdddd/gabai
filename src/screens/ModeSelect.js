import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NavBar from '../components/NavBar';
import { getFirestore, addDoc, collection, getDocs, doc, getDoc, writeBatch } from 'firebase/firestore';
import { auth } from '../../firebase-config';
import { GEMINI_KEY } from '../../api-keys';
import axios from 'axios';

const fetchReviewerText = async (reviewerUid) => {
  try {
    const db = getFirestore();
    const reviewerRef = doc(db, 'reviewer', reviewerUid);
    const reviewerDoc = await getDoc(reviewerRef);

    if (reviewerDoc.exists()) {
      return reviewerDoc.data().text;
    } else {
      console.error('No such document for reviewer UID:', reviewerUid);
      throw new Error('Reviewer not found');
    }
  } catch (error) {
    console.error('Error fetching reviewer text:', error);
    throw error;
  }
};

const generateFlashcards = async (text) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_KEY}`,
      {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Create multiple flashcards consists question and an answer based on the following content (5 minimum) and output them as JSON:\n\n${text}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
          responseMimeType: 'application/json',
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.candidates && response.data.candidates.length > 0) {
      const generatedFlashcards = JSON.parse(response.data.candidates[0].content.parts[0].text);
      return generatedFlashcards;
    }

    throw new Error('Invalid response from Gemini API');
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw error;
  }
};

const storeFlashcards = async (flashcards, reviewerUid) => {
  try {
    const db = getFirestore();
    const batch = writeBatch(db);

    flashcards.forEach((flashcard) => {
      if (flashcard.question && flashcard.answer) { // Check for 'question' and 'answer' keys
        const docRef = doc(collection(db, 'flashcards'));
        batch.set(docRef, {
          front: flashcard.question, // Map 'question' to 'front'
          back: flashcard.answer,   // Map 'answer' to 'back'
          reviewerUid: reviewerUid,
          userUid: auth.currentUser.uid,
          createdAt: new Date(),
        });
      } else {
        console.error('Invalid flashcard data:', flashcard);
      }
    });

    await batch.commit();
    console.log('Flashcards stored successfully');
  } catch (error) {
    console.error('Error storing flashcards:', error);
  }
};


const handleFlashcardCreation = async (reviewerUid) => {
  try {
    // Step 1: Fetch reviewer text
    const reviewerText = await fetchReviewerText(reviewerUid);

    // Step 2: Generate flashcards using Gemini API
    const flashcards = await generateFlashcards(reviewerText);

    // Step 3: Store flashcards in Firestore
    await storeFlashcards(flashcards, reviewerUid);

    console.log('Flashcards created and stored successfully');
  } catch (error) {
    console.error('Error in handleFlashcardCreation:', error);
  }
};

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

  const handleModeSelect = async (route) => {
    if (route === 'Flashcards') {
      const reviewerUid = '5Et7oHpDw9HQbeHX4UWp'; // Replace with actual UID
      await handleFlashcardCreation(reviewerUid);
    }
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