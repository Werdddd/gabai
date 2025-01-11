import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { auth, firestore } from '../../firebase-config';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

export default function Quiz({ route, navigation }) {
    const reviewerId = route.params?.reviewerId;
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const [reviewerName, setReviewerName] = useState("");

    useEffect(() => {
        const fetchQuestions = async () => {
            if (!reviewerId) {
                console.warn("ReviewerId is not defined.");
                return;
            }
        
            setIsLoading(true); // Ensure loading state is set at the start
            try {
                console.log("Fetching questions for reviewerId:", reviewerId);
        
                const q = query(
                    collection(firestore, 'quiz'),
                    where("reviewerUid", "==", reviewerId) // Filters only matching reviewerUid
                );
                const querySnapshot = await getDocs(q);
        
                if (querySnapshot.empty) {
                    console.log("No questions found for this reviewerId.");
                    setQuestions([]); // Set empty questions if none are found
                } else {
                    const fetchedQuestions = querySnapshot.docs.map(doc => doc.data());
                    console.log("Fetched questions:", fetchedQuestions);
                    setQuestions(fetchedQuestions);
                }
            } catch (error) {
                console.error('Error fetching questions:', error.message || error);
            } finally {
                setIsLoading(false); // Always reset loading state
            }
        };
        

        if (reviewerId) {
            fetchQuestions();
        } else {
            console.error('No reviewerId provided.');
            setIsLoading(false);
        }
    }, [reviewerId]);

    useEffect(() => {
        const fetchReviewerName = async () => {
            if (!reviewerId) return;

            try {
                const reviewerDoc = await getDoc(doc(firestore, 'reviewer', reviewerId));
                if (reviewerDoc.exists()) {
                    setReviewerName(reviewerDoc.data().name);
                }
            } catch (error) {
                console.error('Error fetching reviewer name:', error);
            }
        };

        fetchReviewerName();
    }, [reviewerId]);

    const handleAnswer = (selectedOption) => {
        setSelectedAnswer(selectedOption);
        setIsAnswered(true);
        
        if (selectedOption === questions[currentQuestion].answer) {
            setScore(prevScore => prevScore + 1);
        }
    };

    const handleNavigation = (direction) => {
        if (direction === 'next' && currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else if (direction === 'prev' && currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text>Loading questions...</Text>
            </View>
        );
    }

    if (questions.length === 0) {
        return (
            <View style={styles.container}>
                <Text>No questions found for this reviewer.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{reviewerName}</Text>
                <Text style={styles.subtitle}>Reviewer</Text>
            </View>

            <View style={styles.scoreContainer}>
                <View style={styles.scoreHeader}>
                    <Text style={styles.scoreText}>{currentQuestion + 1}/{questions.length}</Text>
                    <Text style={styles.scoreText}>Score: {score}/{questions.length}</Text>
                </View>
                <View style={styles.progressBar}>
                    <View 
                        style={[
                            styles.progress, 
                            { width: `${((currentQuestion + 1) / questions.length) * 100}%` }
                        ]} 
                    />
                </View>
            </View>

            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>
                    {questions[currentQuestion].question}
                </Text>
            </View>

            <View style={styles.optionsContainer}>
                {['option1', 'option2', 'option3', 'option4'].map((option, index) => {
                    const optionValue = questions[currentQuestion][option];
                    const isCorrect = optionValue === questions[currentQuestion].answer;
                    const isSelected = selectedAnswer === optionValue;
                    
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.optionButton,
                                isAnswered && isSelected && !isCorrect && styles.wrongAnswer,
                                isAnswered && isCorrect && styles.correctAnswer,
                            ]}
                            onPress={() => !isAnswered && handleAnswer(optionValue)}
                            disabled={isAnswered}
                        >
                            <Text style={styles.optionText}>
                                {optionValue}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <View style={styles.navigationButtons}>
                <TouchableOpacity
                    style={[styles.navButton, currentQuestion === 0 && styles.disabledButton]}
                    onPress={() => handleNavigation('prev')}
                    disabled={currentQuestion === 0}
                >
                    <Text style={styles.navButtonText}>Previous</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[styles.navButton, currentQuestion === questions.length - 1 && styles.disabledButton]}
                    onPress={() => handleNavigation('next')}
                    disabled={currentQuestion === questions.length - 1}
                >
                    <Text style={styles.navButtonText}>Next</Text>
                </TouchableOpacity>
            </View>
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
        backgroundColor: '#DAA520',
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
    wrongAnswer: {
        backgroundColor: '#ffebee',
        borderColor: '#ef5350',
    },
    correctAnswer: {
        backgroundColor: '#e8f5e9',
        borderColor: '#66bb6a',
    },
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingHorizontal: 20,
    },
    navButton: {
        backgroundColor: '#DAA520',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        width: '45%',
        alignItems: 'center',
    },
    navButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    disabledButton: {
        opacity: 0.5,
    },
    scoreHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
});
