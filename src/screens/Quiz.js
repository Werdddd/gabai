import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { getFirestore, addDoc, collection } from 'firebase/firestore';

export default function Quiz({ route, navigation }) {
    const reviewerId = route.params?.reviewerId;
    console.log("Quiz Screen - Received reviewerId:", reviewerId); 

    useEffect(() => {
        const generateAiQuizSet = async () => {
            try {
                const db = getFirestore();
                await addDoc(collection(db, 'quiz'), {
                    reviewerId: reviewerId,
                    score: score,
                    timestamp: new Date(),
                });
            } catch (error) {
                console.error('Error saving quiz attempt:', error);
            }
        };

        console.log(reviewerId);

        generateAiQuizSet();
    }, [reviewerId]);

   
    return (
       <View>
        <Text>Quiz</Text>
       </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    scoreContainer: {
        marginBottom: 20,
    },
    scoreText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    progressBar: {
        height: 10,
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
    },
    progress: {
        height: '100%',
        backgroundColor: '#DAA520', // Golden color
        borderRadius: 5,
    },
    questionContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 20,
    },
    questionText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        lineHeight: 24,
    },
    optionsContainer: {
        gap: 10,
    },
    optionButton: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
});
