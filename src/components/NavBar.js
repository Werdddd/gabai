import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Modal, Text } from 'react-native';
import Camera from 'expo-camera';
import { getFirestore, getDoc, doc, addDoc, collection } from 'firebase/firestore';
import { auth } from '../../firebase-config';

const NavBar = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Home'); // Default active tab
  const [isScannerVisible, setScannerVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    navigation.navigate(tabName); // Navigate to the corresponding screen
  };

  const handleScan = async ({ data }) => {
    try {
      const db = getFirestore();
      // Get the original reviewer
      const reviewerDoc = await getDoc(doc(db, 'reviewer', data));
      
      if (reviewerDoc.exists()) {
        const reviewerData = reviewerDoc.data();
        
        // Create new reviewer with current user's ID
        const newReviewerRef = await addDoc(collection(db, 'reviewer'), {
          ...reviewerData,
          userUid: auth.currentUser.uid,
          dateCreated: new Date()
        });

        setScannerVisible(false);
        navigation.navigate('ModeSelect', { reviewerId: newReviewerRef.id });
      }
    } catch (error) {
      console.error('Error duplicating reviewer:', error);
    }
  };

  return (
    <>
      <View style={styles.navBar}>
        {/* Home Tab */}
        <TouchableOpacity onPress={() => handleTabPress('Home')}>
          <Image
            source={
              activeTab === 'Home'
                ? require('../../assets/home-active.png') // Active home icon
                : require('../../assets/home-inactive.png') // Inactive home icon
            }
            style={styles.icon}
          />
        </TouchableOpacity>

        {/* Add Tab */}
        <TouchableOpacity onPress={() => handleTabPress('Upload')}>
          <Image
            source={
              activeTab === 'AddReview'
                ? require('../../assets/add-active.png') // Active add icon
                : require('../../assets/add-inactive.png') // Inactive add icon
            }
            style={styles.icon}
          />
        </TouchableOpacity>

        {/* Profile Tab */}
        <TouchableOpacity onPress={() => handleTabPress('Profile')}>
          <Image
            source={
              activeTab === 'Profile'
                ? require('../../assets/profile-active.png') // Active profile icon
                : require('../../assets/profile-inactive.png') // Inactive profile icon
            }
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('QRCodeScanner')}>
        <Image
          source={require('../../assets/scan-qr.jpg')}
          style={styles.icon}
        />
      </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  icon: {
    width: 24,
    height: 24,
  },
  closeScanner: {
    backgroundColor: '#666',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  closeScannerText: {
    color: 'white',
    fontSize: 16,
  },
});

export default NavBar;
