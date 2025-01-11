import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

const NavBar = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Home'); // Default active tab

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    navigation.navigate(tabName); // Navigate to the corresponding screen
  };

  return (
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
    </View>
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
});

export default NavBar;
