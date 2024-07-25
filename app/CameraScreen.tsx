import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Button, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as Speech from 'expo-speech';

const CameraScreen = () => {
  const [busResult, setBusResult] = useState<string>('');
  const [apiCallSuccess, setApiCallSuccess] = useState<boolean | null>(null);
  const [busDetected, setBusDetected] = useState<boolean | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // State for loading indicator

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
      processImage(uri);
    }
  };

  const processImage = async (uri: string) => {
    try {
      setLoading(true); // Start loading indicator
      const base64Image = await getBase64(uri);
      const base64ImageData = base64Image.split(',')[1]; // Remove the data URL prefix

      const response = await axios.post('http://54.254.180.84:8000/process-frame', {  
        frame : base64ImageData,
      });

      setApiCallSuccess(true);

      const { result } = response.data;
      setBusResult(result); // Update state with the result from FastAPI
      setBusDetected(result !== 'Bus not found');

      if (result !== 'Bus not found') {
        // Use Expo Speech to play the result as audio
        Speech.speak(result, {
          onDone: () => {
            console.log('Speech finished');
          },
          onError: (error) => {
            Alert.alert('Error', 'Failed to play the sound');
            console.error(error);
          },
        });
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setApiCallSuccess(false);
      setBusDetected(false);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  const getBase64 = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image from gallery" onPress={pickImage} />
      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.selectedImage} />}
      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>Bus Result: {busResult}</Text>
      </View>
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>Bus Found: {busResult ? 'True' : 'False'}</Text>
      </View>
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>API Call Success: {apiCallSuccess === null ? 'N/A' : apiCallSuccess ? 'True' : 'False'}</Text>
      </View>
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>Bus Detected: {busDetected === null ? 'N/A' : busDetected ? 'True' : 'False'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedImage: {
    width: 300,
    height: 300,
    marginTop: 20,
  },
  resultContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  resultText: {
    fontSize: 16,
  },
  loader: {
    marginTop: 20,
  },
});

export default CameraScreen;