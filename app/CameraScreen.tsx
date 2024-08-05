import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Button, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import axios from 'axios';
import * as Speech from 'expo-speech';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

const CameraScreen = () => {
  const [busResult, setBusResult] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const resizeImageUri = async (uri: string) => {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }], 
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    return manipResult.uri;
  };

  const takePicture = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 1,
        });
 
        if (photo && photo.uri && photo.base64) {
          const resizedImageUri = await resizeImageUri(photo.uri);
          setSelectedImage(resizedImageUri);
          processImage(resizedImageUri);
        } else {
          Alert.alert('Error', 'Failed to get photo URI or base64');
        }
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture');
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

  const uploadPicture = async () => {
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
      setLoading(true);
      const base64Image = await getBase64(uri);
      const base64ImageData = base64Image.split(',')[1];

      const response = await axios.post('http://3.26.45.118/process-frame', {  
        frame : base64ImageData,
      });

      const { result } = response.data;
      setBusResult(result);

      if (result !== 'Bus not found') {
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
    } finally {
      setLoading(false);
    }
  };

  const resetScreen = () => {
    setSelectedImage(null);
    setBusResult('');
  };

  return (
    <View style={styles.container}>
      {selectedImage ? (
        <>
          <Image testID = "full-screen-image" source={{ uri: selectedImage }} style={styles.fullScreenImage} />
          <TouchableOpacity style={styles.resetButton} onPress={resetScreen}>
            <Text style={styles.text}>Reset</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <CameraView 
            style={styles.camera}
            facing={facing}
            ref={cameraRef}
          />
          <TouchableOpacity style={styles.resetButton} onPress={resetScreen}>
            <Text style={styles.text}>Reset</Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}>Capture Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={uploadPicture}>
              <Text style={styles.text}>Upload</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>Bus Result: {busResult}</Text>
      </View>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: '70%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
  fullScreenImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  resultContainer: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
  },
  loader: {
    marginTop: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  resetButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default CameraScreen;
