import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, addDoc, collection } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { initializeApp } from 'firebase/app';
import { auth, firestore } from '../../firebase-config';
import { CONVERT_API_KEY, GEMINI_KEY} from '../../api-keys'
import axios from 'axios';

export default function Quiz({ route, navigation }) {
    const reviewerId = route.params?.reviewerId;
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [quizSet, setQuizSet] = useState([]);

    useEffect(() => {
        const generateAiQuizSet = async () => {
            try {
                // 1. Get the reviewer document
                const db = getFirestore();
                const reviewerDoc = await getDoc(doc(db, 'reviewer', reviewerId));
                
                if (!reviewerDoc.exists()) {
                    console.error('Reviewer document not found');
                    return;
                }

                const reviewerText = reviewerDoc.data().text;

                // 2. Generate quiz questions using Gemini
                const response = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_KEY}`,
                    {
                        contents: [{
                            role: "user",
                            parts: [{
                                text: `Based on this knowledge: "${reviewerText}", generate 5 multiple choice questions. 
                                Return the response in this exact JSON format:
                                [
                                    {
                                        "question": "the question text",
                                        "option1": "first option",
                                        "option2": "second option",
                                        "option3": "third option",
                                        "option4": "fourth option",
                                        "answer": "the correct option"
                                    }
                                ]
                                Ensure the response is valid JSON and the answer exactly matches one of the options.`
                            }]
                        }],
                        generationConfig: {
                            temperature: 0.7,  // Reduced for more consistent formatting
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 8192,
                            responseMimeType: "text/plain"
                        }
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                // Log the raw response text
                console.log("Raw Gemini Response:", response.data.candidates[0].content.parts[0].text);

                if (response.data.candidates && response.data.candidates[0].content.parts[0].text) {
                    let responseText = response.data.candidates[0].content.parts[0].text;
                    
                    // Clean up the response text if needed
                    responseText = responseText.trim();
                    if (responseText.startsWith('```json')) {
                        responseText = responseText.replace('```json', '').replace('```', '').trim();
                    }

                    try {
                        const generatedQuestions = JSON.parse(responseText);
                        console.log("Parsed Questions:", generatedQuestions);

                        // 3. Store each question separately in Firestore
                        for (const question of generatedQuestions) {
                            await addDoc(collection(db, 'quiz'), {
                                question: question.question,
                                option1: question.option1,
                                option2: question.option2,
                                option3: question.option3,
                                option4: question.option4,
                                answer: question.answer,
                                reviewerUid: reviewerId,
                                createdAt: new Date()
                            });
                        }

                        setQuizSet(generatedQuestions);
                    } catch (parseError) {
                        console.error('JSON Parse Error:', parseError);
                        console.error('Failed to parse text:', responseText);
                    }
                }
            } catch (error) {
                console.error('Error generating quiz:', error);
                if (error.response) {
                    console.error('API Error Response:', error.response.data);
                }
            }
        };

        if (reviewerId) {
            generateAiQuizSet();
        }
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
