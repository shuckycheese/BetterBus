import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
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
    <View style={styles.container}>
      <Image source={require('../assets/images/app-logo.png')} style={styles.logo} />
      <Text style={styles.title}>Welcome to BetterBus</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={{ ...styles.button, ...styles.cameraButton }}>
          <Icon name="camera" style={styles.icon} />
          <Text style={styles.buttonText}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.button, ...styles.busStopButton }}
          onPress={() => navigation.navigate('BusStops')}
        >
          <Icon name="bus" style={styles.icon} />
          <Text style={styles.buttonText}>Bus Stops</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
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
    flexDirection: 'column',
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

