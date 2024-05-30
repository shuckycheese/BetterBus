import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 30,
    color: '#333',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 8,
    width: 150,
    height: 60,
  },
  cameraButton: {
    backgroundColor: '#007BFF', // Blue
  },
  busStopButton: {
    backgroundColor: '#FF7F00', // Orange
  },
  icon: {
    marginRight: 10,
    fontSize: 24,
    color: '#fff',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
});