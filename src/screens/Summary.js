import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import axios from 'axios';
import { GEMINI_KEY } from '../../api-keys';

import { firestore } from '../../firebase-config';




export default function Summary({ route, navigation }) {
  const reviewerId = route.params?.reviewerId;
  const [summary, setSummary] = useState('');
  const [reviewerName, setReviewerName] = useState("");

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

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>{reviewerName}</Text>
        <Text style={styles.subtitle}>Reviewer</Text>
      </View>


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
  header: {
    marginBottom: 20,
    alignItems: 'center',
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
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
