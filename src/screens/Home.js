// HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import axios from 'axios';
import Header from '../components/Header';
import NavBar from '../components/NavBar';

const HomeScreen = ({navigation}) => {
  const [userData, setUserData] = useState({ name: '', profileImage: '' });
  const [reviewers, setReviewers] = useState([]);

  useEffect(() => {
    // Fetch user data from backend
    axios
      .get('https://your-backend.com/user')
      .then((response) => {
        const { name, profileImage } = response.data;
        setUserData({ name, profileImage });
      })
      .catch((error) => console.error('Error fetching user data:', error));

    // Fetch reviewers data
    axios
      .get('https://your-backend.com/reviewers')
      .then((response) => setReviewers(response.data))
      .catch((error) => console.error('Error fetching reviewers:', error));

    // Dummy data for now
    setReviewers([
      {
        id: 1,
        name: 'Data Structures & Algorithms',
        description:
          'The study of organizing data efficiently using structures like arrays and trees.',
        dateCreated: '01/08/25',
        iconColor: '#D4AF37',
      },
      {
        id: 2,
        name: 'Artificial Intelligence',
        description: 'Understanding intelligent agents and their behaviors.',
        dateCreated: '01/08/25',
        iconColor: '#002855',
      },
      {
        id: 3,
        name: 'Networks and Communications',
        description: 'Principles of data transmission and protocols.',
        dateCreated: '01/08/25',
        iconColor: '#FF4B4B',
      },
      {
        id: 4,
        name: 'Multimedia Systems',
        description: 'Techniques for handling and processing multimedia data.',
        dateCreated: '01/08/25',
        iconColor: '#32CD32',
      },
    ]);
  }, []);

  const renderReviewerCard = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: item.iconColor }]}>
        <Image
          source={require('../../assets/graduation-icon.png')} // Replace with your icon
          style={styles.icon}
        />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <Text style={styles.cardDate}>{item.dateCreated}</Text>
      </View>
      <View style={styles.arrowContainer}>
        <Text style={styles.arrow}>&gt;</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Component */}
      <Header name={userData.name} profileImage={userData.profileImage} />

      <View style={styles.searchBarContainer}>
        <TextInput
            style={styles.searchBar}
            placeholder="Search..."
            placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.searchButton}>
            <Image
            source={require('../../assets/search-icon.png')} // Replace with your icon path
            style={styles.searchIcon}
            />
        </TouchableOpacity>
      </View>

      {/* Reviewers Section */}
      <Text style={styles.sectionTitle}>Your Reviewers</Text>
      <FlatList
        data={reviewers}
        renderItem={renderReviewerCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.cardContainer}
      />
      <NavBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  searchBar: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  searchButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#333', // Optional: Set color if using a monochrome icon
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  cardContainer: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
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
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 18,
    color: '#ccc',
  },
});

export default HomeScreen;
