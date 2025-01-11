import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firestore } from '../../firebase-config';

const Header = () => {
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the currently signed-in user
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
          const userId = currentUser.uid; // Get the user ID
          console.log('Current User ID:', userId);

          // Fetch user data from Firestore
          const userDocRef = doc(firestore, 'users', userId);
          const userSnapshot = await getDoc(userDocRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            console.log('User data:', userData);
            setName(userData.firstName || 'Guest');
            setProfileImage(userData.profilePicture || '');
          } else {
            console.error('User document does not exist.');
          }
        } else {
          console.warn('No user is currently signed in.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#B2A561" />;
  }

  return (
    <View style={styles.header}>
      <View style={styles.headerTextContainer}>
        <Text style={styles.greeting}>Hello, {name}!</Text>
        <Text style={styles.subtitle}>What do you wanna learn today?</Text>
      </View>
      <Image
        source={{ uri: profileImage || 'https://via.placeholder.com/50' }}
        style={styles.profileImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#403D3D',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ddd',
    borderWidth: 1,
    borderColor: '#B2A561',
  },
});

export default Header;
