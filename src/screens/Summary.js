import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import axios from 'axios';
import { GEMINI_KEY } from '../../api-keys';
import PomodoroTimer from '../components/PomodoroTimer';

export default function Summary({ route, navigation }) {
  const reviewerId = route.params?.reviewerId;
  const [summary, setSummary] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const db = getFirestore();
        const q = query(collection(db, 'summary'), where('reviewerId', '==', reviewerId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const summaryData = querySnapshot.docs[0].data();
          setSummary(summaryData.summary);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching summary:', error);
      }
    };

    if (reviewerId) {
      fetchSummary();
    }
  }, [reviewerId]);

  return (
    <View style={styles.container}>
      <PomodoroTimer/>
      <Text style={styles.title}>Summary</Text>
      <Text style={styles.summaryText}>{summary}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
