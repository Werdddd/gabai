import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Overview = () => {
  const navigation = useNavigation(); // For navigation
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1)); // Start with opacity 1 for the first image

  // Slideshow content
  const slides = [
    {
      image: require("../../assets/60.png"),
      title: "Welcome to GabAI:",
      subtitle: "Your AI-Assisted Study Companion",
    },
    {
      image: require("../../assets/64.png"),
      title: "Personalized Learning",
      subtitle: "Adapt to your learning style with flashcards, quizzes, and summaries.",
    },
    {
      image: require("../../assets/63.png"),
      title: "Study Techniques",
      subtitle: "Master your study habits using Pomodoro, Spaced Repetition, and more.",
    },
    {
        image: require("../../assets/62.png"),
        title: "Share & Collaborate",
        subtitle: "Connect, share study materials, and support multilingual learning.",
      },
  ];

  // Function to trigger the fade-in and fade-out animation for the image
  const animateImage = () => {
    // Fade out the current image
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      // After fade-out, fade in the new image
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleNext = () => {
    if (currentStep < slides.length - 1) {
      setCurrentStep(currentStep + 1); // Move to the next slide
      animateImage(); // Trigger image fade animation when moving to the next slide
    } else {
      navigation.navigate("Login"); // Redirect to login after the last slide
    }
  };

  const handleSkip = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      {/* Image with animation */}
      <Animated.Image
        source={slides[currentStep].image}
        style={[styles.image, { opacity: fadeAnim }]}
      />

      {/* Bottom Container */}
      <View style={styles.bottomContainer}>
        {/* Text */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{slides[currentStep].title}</Text>
          <Text style={styles.subtitle}>{slides[currentStep].subtitle}</Text>
        </View>
        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.buttonText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  image: {
    width: 300, // Set fixed width in pixels
    height: 300, // Set fixed height in pixels
    resizeMode: "contain", // Ensures the image fits within the specified size
    marginBottom: 90, // Adjust spacing below the image
    marginTop: 110,
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10, // Adjust spacing between text and buttons
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
  bottomContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#103E5B",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start", // Aligns elements closer to the top
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: -4 }, // Shadow offset (x, y)
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 8, // Shadow blur radius
    elevation: 10, // Adds shadow for Android
    zIndex: 1, // Ensures shadow is above other elements
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 70, // Increased spacing above buttons
  },
  skipButton: {
    backgroundColor: "#B2A561",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  nextButton: {
    backgroundColor: "#B2A561",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Overview;
