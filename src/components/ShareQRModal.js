import React, { useRef } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const ShareQRModal = ({ isVisible, onClose, reviewerId }) => {
  const qrRef = useRef();

  const handleDownload = async () => {
    try {
      // Create a temporary SVG file
      const filePath = `${FileSystem.cacheDirectory}qr-${reviewerId}.svg`;
      let svg = '';
      // Get SVG string from QR code
      qrRef.current.toDataURL((data) => {
        svg = data;
      });
      
      await FileSystem.writeAsStringAsync(filePath, svg);
      
      // Share the file
      await Sharing.shareAsync(filePath);
    } catch (error) {
      console.error('Error sharing QR code:', error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Share Reviewer</Text>
          
          <View style={styles.qrContainer}>
            <QRCode
              value={reviewerId}
              size={200}
              getRef={(ref) => (qrRef.current = ref)}
            />
          </View>

          <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
            <Text style={styles.buttonText}>Download QR Code</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  qrContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
  },
  downloadButton: {
    backgroundColor: '#B2A561',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#666',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ShareQRModal; 