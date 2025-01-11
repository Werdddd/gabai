import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { firestore } from '../../firebase-config'; // Adjust this path as necessary
import { collection, getDocs } from 'firebase/firestore';

export default function HomeScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const reviewerCollection = collection(firestore, 'reviewer');
      const snapshot = await getDocs(reviewerCollection);
      const fetchedData = snapshot.docs.map((doc) => ({
        id: doc.id, // Include the document ID
        ...doc.data(),
      }));
      setData(fetchedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderReviewerCard = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: item.cardColor || '#ff0000' }]}>
        <Image
          source={require('../../assets/graduation-icon.png')} // Replace with your icon
          style={styles.icon}
        />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription}>{item.aiDescription}</Text>
        <Text style={styles.cardDate}>
          {item.dateCreated
            ? new Date(item.dateCreated.seconds * 1000).toLocaleDateString()
            : ''}
        </Text>
      </View>
      <View style={styles.arrowContainer}>
        <Text style={styles.arrow}>&gt;</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#103E5B" />
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={data}
      renderItem={renderReviewerCard}
      keyExtractor={(item) => item.id}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    width: 30,
    height: 30,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#103E5B',
  },
  cardDescription: {
    fontSize: 14,
    color: '#333',
    marginVertical: 5,
  },
  cardDate: {
    fontSize: 12,
    color: '#888',
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 20,
    color: '#888',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
