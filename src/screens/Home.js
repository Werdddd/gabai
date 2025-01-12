import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { firestore, auth } from '../../firebase-config'; // Adjust this path as necessary
import { collection, getDocs } from 'firebase/firestore';
import Header from '../components/Header';
import NavBar from '../components/NavBar';

export default function HomeScreen({navigation}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({ name: '', profileImage: '' });

  const fetchData = async () => {
    try {
      const reviewerCollection = collection(firestore, 'reviewer');
      const snapshot = await getDocs(reviewerCollection);
      const fetchedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter(reviewer => reviewer.userUid === auth.currentUser.uid); // Filter by current user's UID
      
      // Sort by dateCreated in descending order
      const sortedData = fetchedData.sort((a, b) => {
        const dateA = a.dateCreated?.seconds || 0;
        const dateB = b.dateCreated?.seconds || 0;
        return dateB - dateA;
      });
      setData(sortedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderReviewerCard = ({ item }) => {
    console.log("Home Screen - Card reviewerId:", item.id); // Debug log
    
    return (
        <TouchableOpacity 
            style={styles.card}
            onPress={() => {
                console.log("Home Screen - Navigating with reviewerId:", item.id); // Debug log
                navigation.navigate('ModeSelect', { reviewerId: item.id });
            }} // Pass reviewerId to ModeSelect
        >
            <View style={[styles.iconContainer, { backgroundColor: item.cardColor || '#ff0000' }]}>
                <Image
                    source={require('../../assets/graduation-icon.png')}
                    style={styles.icon}
                />
            </View>
            <View style={styles.cardScrollContainer}>
                {/* Scrollable card content */}
                <ScrollView 
                    style={styles.cardContent} 
                    nestedScrollEnabled={true}
                >
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardDescription}>{item.aiDescription}</Text>
                    <Text style={styles.cardDate}>
                        {item.dateCreated
                            ? new Date(item.dateCreated.seconds * 1000).toLocaleDateString()
                            : ''}
                    </Text>
                </ScrollView>

            </View>
            <View style={styles.arrowContainer}>
                <Text style={styles.arrow}>&gt;</Text>
            </View>
        </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#103E5B" />
      </View>
    );
  }

  return (
     <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
    <ScrollView style={styles.container}>
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
    contentContainerStyle={styles.container}
    data={data}
    renderItem={renderReviewerCard}
    keyExtractor={(item) => item.id}
    showsVerticalScrollIndicator={false}  // Optional for cleaner UI
  />
      {/* <NavBar navigation={navigation} /> */}
      </ScrollView>
      <NavBar navigation={navigation} />
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  cardListContainer: {
    maxHeight: 300,  // Adjust based on desired visible space
    overflow: 'hidden', // Helps maintain layout integrity
  },
  card: {
    flexDirection: 'row',
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
  cardScrollContainer: {
    flex: 1,
  },
  cardContent: {
    maxHeight: 100,  // Set maxHeight for scroll area
    paddingRight: 10,
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
