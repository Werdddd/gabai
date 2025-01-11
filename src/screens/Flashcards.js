import React, { useEffect, useState } from 'react';
import { CONVERT_API_KEY, GEMINI_KEY } from '../../api-keys';
import axios from 'axios';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import NavBar from '../components/NavBar';
import { getFirestore, addDoc, collection, getDocs, doc, getDoc, writeBatch } from 'firebase/firestore';
import { auth } from '../../firebase-config';

const { width, height } = Dimensions.get('window');

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
                text: `Create multiple flashcards based on the following content and output them as JSON:\n\n${text}`,
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
      const docRef = doc(collection(db, 'flashcards'));
      batch.set(docRef, {
        front: flashcard.front,
        back: flashcard.back,
        reviewerUid: reviewerUid,
        userUid: auth.currentUser.uid,
        createdAt: new Date()
      });
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

const addFlashcard = async (front, back, reviewerUid) => {
  try {
    const db = getFirestore();
    const docRef = await addDoc(collection(db, 'flashcards'), {
      front: front,
      back: back,
      reviewerUid: reviewerUid,
      userUid: auth.currentUser.uid,
      createdAt: new Date()
    });
    console.log('Flashcard added with ID:', docRef.id);
  } catch (error) {
    console.error('Error adding flashcard:', error);
  }
};

const fetchFlashcards = async () => {
  try {
    const db = getFirestore();
    const flashcardsRef = collection(db, 'flashcards');
    const flashcardsSnapshot = await getDocs(flashcardsRef);
    return flashcardsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    return [];
  }
};

const Flashcard = ({ item }) => {
  const flipValue = useSharedValue(0);

  const handleFlip = () => {
    flipValue.value = withTiming(flipValue.value === 0 ? 180 : 0, { duration: 600 });
  };

  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${interpolate(flipValue.value, [0, 180], [0, 180])}deg` },
    ],
    opacity: interpolate(flipValue.value, [0, 90], [1, 0], Extrapolate.CLAMP),
  }));

  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${interpolate(flipValue.value, [0, 180], [180, 360])}deg` },
    ],
    opacity: interpolate(flipValue.value, [90, 180], [0, 1], Extrapolate.CLAMP),
  }

));


  return (
    <TouchableWithoutFeedback onPress={handleFlip}>
      <View style={styles.cardContainer}>
        <Text style={styles.reviewerText}>{item.reviewer} Reviewer</Text>

        {/* Front Side */}
        <Animated.View style={[styles.card, frontAnimatedStyle]}>
          <Image source={require('../../assets/gabai-logo.png')} style={styles.logo} />
          <Text style={styles.questionText}>{item.front}</Text>
        </Animated.View>

        {/* Back Side */}
        <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
          <Image source={require('../../assets/gabai-whiteAI-logo.png')} style={styles.logo} />
          <Text style={styles.answerText}>{item.back}</Text>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const Flashcards = ({ navigation }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFlashcards = async () => {
    try {
      setLoading(true);
      const loadedFlashcards = await fetchFlashcards();
      setFlashcards(loadedFlashcards);
    } catch (error) {
      console.error('Error loading flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFlashcards();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading flashcards...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={flashcards}
        renderItem={({ item }) => <Flashcard item={item} />}
        keyExtractor={(item) => item.id}
        snapToAlignment="start"
        snapToInterval={height}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
      />
      <NavBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    top: -50,
  },
  reviewerText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    position: 'absolute',
    top: 90,
    color: '#333',
  },
  card: {
    width: width * 0.9,
    height: height * 0.6,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardBack: {
    backgroundColor: '#B2A561',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 24,
    color: '#1d1d1d',
    textAlign: 'center',
    marginTop: 30,
  },
  answerText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginTop: -230,
    marginBottom: 70,
  },
});

export default Flashcards;
