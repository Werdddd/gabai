import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import axios from 'axios';
import { GEMINI_KEY } from '../../api-keys';

import { firestore } from '../../firebase-config';

import PomodoroTimer from '../components/PomodoroTimer';

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

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.summaryTitle}>Summary</Text>
          </View>
          <Text style={styles.summaryText}>{summary}</Text>
        </View>

        <View style={styles.timerWrapper}>
          <PomodoroTimer />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#103E5B',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 20,
  },
  cardHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#B2A561',
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    padding: 15,
  },
  timerWrapper: {
    marginTop: 20,
    alignItems: 'center',
  },
});
