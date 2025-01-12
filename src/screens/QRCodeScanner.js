import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import  Camera from 'expo-camera';

const QRCodeScanner = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);

    // Function to request camera permission
    const requestPermission = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
    };

    // Request permission on component mount
    useEffect(() => {
        (async () => {
            const { status } = await Camera.getCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);



    if (hasPermission === null) {
        return (
            <View style={styles.container}>
                <Text>Requesting for camera permissions...</Text>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

  const handleScan = async ({ data }) => {
    console.log('Scanned data:', data);
    // Navigate to the appropriate screen with the scanned data
    navigation.navigate('ModeSelect', { reviewerId: data });
  };

  if (hasPermission === null) {
    return <View><Text>Requesting for camera permission</Text></View>;
  }
  if (hasPermission === false) {
    return <View><Text>No access to camera</Text></View>;
  }
  

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        onBarCodeScanned={handleScan}
      >
        <View style={styles.closeButtonContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );

  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default QRCodeScanner; 