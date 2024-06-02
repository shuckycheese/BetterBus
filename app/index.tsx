import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the type for your navigation stack
type RootStackParamList = {
  index: undefined;
  BusStops: undefined;
};

// Use the type for the navigation prop
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'index'>;

export default function HomePage() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <ImageBackground source={require('../assets/images/betterbus background.png')} style={styles.background}>
      <View style={styles.container}>
        <Image source={require('../assets/images/betterbus logo.png')} style={styles.logo} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={{ ...styles.button, ...styles.cameraButton }}>
            <View style={styles.buttonContent}>
              <Icon name="camera" style={styles.icon} />
              <Text style={styles.buttonText}>Camera</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ ...styles.button, ...styles.busStopButton }}
            onPress={() => navigation.navigate('BusStops')}
          >
            <View style={styles.buttonContent}>
              <Icon name="bus" style={styles.icon} />
              <Text style={styles.buttonText}>Bus Stops</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover', // Ensure the image covers the whole screen
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    color: '#00796B',
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    height: 80,
    marginBottom: 20,
  },
  cameraButton: {
    backgroundColor: '#007BFF', // Blue
  },
  busStopButton: {
    backgroundColor: '#FF7F00', // Orange
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  icon: {
    marginRight: 10,
    fontSize: 28,
    color: '#fff',
  },
  buttonText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
});