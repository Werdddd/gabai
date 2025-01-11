import React, { useState } from 'react';
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

const { width, height } = Dimensions.get('window');

const dummyFlashcards = [
  { reviewer: "React Native", question: "What is React Native?", answer: "A framework for building mobile apps using React." },
  { reviewer: "React Native", question: "What is a Component?", answer: "Reusable UI elements in React." },
  { reviewer: "React Native", question: "What is JSX?", answer: "A syntax extension for JavaScript used in React." },
  { reviewer: "React Native", question: "What is the Virtual DOM?", answer: "An in-memory representation of the real DOM for efficient updates." },
  { reviewer: "React Native", question: "What is State in React?", answer: "A way to store dynamic data and control component behavior." },
];

const Flashcard = ({ item }) => {
  const flipValue = useSharedValue(0); // Individual card state

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
  }));

  return (
    <TouchableWithoutFeedback onPress={handleFlip}>
      <View style={styles.cardContainer}>
        <Text style={styles.reviewerText}>{item.reviewer} Reviewer</Text>

        {/* Front Side */}
        <Animated.View style={[styles.card, frontAnimatedStyle]}>
        <Image source={require('../../assets/gabai-logo.png')} style={styles.logo} />
          <Text style={styles.questionText}>{item.question}</Text>
        </Animated.View>

        {/* Back Side */}
        <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
        <Image source={require('../../assets/gabai-whiteAI-logo.png')} style={styles.logo} />
          <Text style={styles.answerText}>{item.answer}</Text>
        </Animated.View>
      </View>
      
    </TouchableWithoutFeedback>
  );
};

const Flashcards = ({navigation}) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={dummyFlashcards}
        renderItem={({ item }) => <Flashcard item={item} />}
        keyExtractor={(item, index) => index.toString()}
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
    marginTop:30,
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
