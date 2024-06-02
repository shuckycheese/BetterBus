import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function BusStopsScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [generalData, setGeneralData] = useState<any>(null) // assign json data directly retrieved from api calls
  const [data, setData] = useState<string[]>([]);
  const [data1, setData1] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const authString = 'NUSnextbus:13dL?zY,3feWR^"T';
      const headers = new Headers();
      headers.set('Authorization', 'Basic ' + btoa(authString));

      const response = await fetch(`https://nnextbus.nus.edu.sg/ShuttleService?busstopname=${searchQuery}`, { method: 'GET', headers: headers });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const jsonData = await response.json();
      const shuttleServices: any[] = jsonData.ShuttleServiceResult.shuttles;
      setGeneralData(shuttleServices);
      const uniqueShuttleNames = Array.from(new Set(shuttleServices.map((shuttle: any) => shuttle.name))) as string[];
      setData(uniqueShuttleNames);
      const shuttleTimings = shuttleServices.map((shuttle, index) => {
        return shuttle.arrivalTime === "-" ? "-" : shuttle.arrivalTime + "min"
      });
      setData1(shuttleTimings);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground source = {require('../assets/images/busStops background.png')} style = {styles.background}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search for bus stops"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.searchButton} onPress={fetchData}>
            <Icon name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={styles.resultsWrapper}>
            <View style={styles.resultContainers}>
              <View style={styles.resultContainer}>
                {error ? (
                  <Text style={styles.errorText}>{error}</Text>
                ) : (
                  data.length > 0 ? (
                    data.map((name, index) => (
                      <Text key={index} style={styles.resultText}>{name}</Text>
                    ))
                  ) : (
                    <Text style={styles.resultText1}>No shuttles found</Text>
                  )
                )}
              </View>
              <View style={styles.resultContainer1}>
              {error ? (
                  <Text style={styles.errorText}>{error}</Text>
                ) : (
                  data.length > 0 ? (
                    data1.map((arrivalTiming, index) => (
                      <Text key={index} style={styles.resultText1}>{data1[index]}</Text>
                    ))
                  ) : (
                    <Text style={styles.resultText1}>No timings found</Text>
                  )
                )}
              </View>
            </View>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover', // Ensure the image covers the whole screen
  },
  container: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingTop: 40, // to position below the status bar
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  searchButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  resultsWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // semi-transparent white background
    padding: 10,
  },
  resultContainers: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
  },
  resultContainer1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginVertical: 2,
    backgroundColor: '#B3E5FC',
    padding: 10,
    borderRadius: 10,
    overflow: 'hidden',
    width: 150,
  },
  resultText1: {
    fontSize: 16,
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 10,
    borderRadius: 10,
    marginVertical: 2,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});
