// Header.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Header = ({ name, profileImage }) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerTextContainer}>
        <Text style={styles.greeting}>Hello, {name}!</Text>
        <Text style={styles.subtitle}>What do you wanna learn today?</Text>
      </View>
      <Image
        source={{ uri: profileImage }}
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
    marginBottom:10,
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
    borderWidth:1,
    borderColor:'#B2A561'
  },
});

export default Header;