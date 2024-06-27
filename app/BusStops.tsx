import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ImageBackground, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Location from 'expo-location';
import * as Speech from 'expo-speech';
import { useTranslation } from 'react-i18next';

export default function BusStopsScreen() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [generalData, setGeneralData] = useState<any>(null);
  const [busData, setBusData] = useState<string[]>([]);
  const [timings, setTimings] = useState<string[]>([]);
  const [busStopData, setBusStopData] = useState<any[]>([]);
  const [filteredBusStops, setFilteredBusStops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedBusStop, setSearchedBusStop] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError(t('permission_denied'));
        return;
      }

      const authString = 'NUSnextbus:13dL?zY,3feWR^"T';
      const headers = new Headers();
      headers.set('Authorization', 'Basic ' + btoa(authString));

      const response = await fetch(`https://nnextbus.nus.edu.sg/BusStops`, { method: 'GET', headers: headers });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const jsonData = await response.json();
      const busStopsData: any[] = jsonData.BusStopsResult.busstops;
      setBusStopData(busStopsData);
    })();
  }, []);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const fetchData = async (query: string, longName: string | null = null) => {
    setIsLoading(true);
    setError(null);
    setSearchedBusStop(longName);

    try {
      const authString = 'NUSnextbus:13dL?zY,3feWR^"T';
      const headers = new Headers();
      headers.set('Authorization', 'Basic ' + btoa(authString));

      const response = await fetch(`https://nnextbus.nus.edu.sg/ShuttleService?busstopname=${query}`, { method: 'GET', headers: headers });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const jsonData = await response.json();
      const shuttleServices: any[] = jsonData.ShuttleServiceResult.shuttles;
      setGeneralData(shuttleServices);
      const uniqueShuttleNames = Array.from(new Set(shuttleServices.map((shuttle: any) => shuttle.name))) as string[];
      setBusData(uniqueShuttleNames);
      const shuttleTimings = shuttleServices.map((shuttle) => {
        return shuttle.arrivalTime === "-" ? "-" : shuttle.arrivalTime === "Arr" ? "Arr" : shuttle.arrivalTime + " min";
      });
      setTimings(shuttleTimings);

      const resultsText = uniqueShuttleNames.map((name, index) => `${name} ${t('arriving_in')} ${shuttleTimings[index]}`).join(', ');
      Speech.speak(resultsText);

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(t('error_fetching_data'));
      Speech.speak(t('error_fetching_data'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNearestPress = async () => {
    Speech.stop();
    setIsLoading(true);
    setError(null);

    try {
      const authString = 'NUSnextbus:13dL?zY,3feWR^"T';
      const headers = new Headers();
      headers.set('Authorization', 'Basic ' + btoa(authString));

      const response = await fetch(`https://nnextbus.nus.edu.sg/BusStops`, { method: 'GET', headers: headers });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const jsonData = await response.json();
      const busStopsData: any[] = jsonData.BusStopsResult.busstops;
      setBusStopData(busStopsData);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError(t('permission_denied'));
        setIsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const closest = findClosestBusStop(location.coords.latitude, location.coords.longitude, busStopsData);
      setSearchedBusStop(closest.LongName);

      Speech.speak(`${t('nearest_bus_stop_is')} ${closest.LongName}`);
      
      await fetchData(closest.name, closest.LongName);

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(t('error_fetching_data'));
      Speech.speak(t('error_fetching_data'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchPress = async () => {
    Speech.stop();

    const busStop = busStopData.find(stop => stop.name.toLowerCase() === searchQuery.toLowerCase());

    const longName = busStop ? busStop.LongName : searchQuery;

    Speech.speak(`${t('searching_for_bus_stop')} ${longName}`);
    await fetchData(searchQuery, longName);
  };

  const findClosestBusStop = (latitude: number, longitude: number, busStops: any[]) => {
    const toRad = (value: number) => (value * Math.PI) / 180;

    const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371; // km
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    let closest = busStops[0];
    let minDistance = haversineDistance(latitude, longitude, busStops[0].latitude, busStops[0].longitude);

    for (let busStop of busStops) {
      const distance = haversineDistance(latitude, longitude, busStop.latitude, busStop.longitude);
      if (distance < minDistance) {
        closest = busStop;
        minDistance = distance;
      }
    }

    return closest;
  };

  const filterBusStops = (query: string) => {
    if (!query) {
      setFilteredBusStops([]);
      return;
    }
    const filtered = busStopData.filter(stop => stop.LongName.toLowerCase().includes(query.toLowerCase()));
    setFilteredBusStops(filtered);
  };

  const handleSuggestionPress = async (busStop: any) => {
    setSearchQuery(busStop.LongName);
    setFilteredBusStops([]);
    Speech.speak(`${t('searching_for_bus_stop')} ${busStop.LongName}`);
    await fetchData(busStop.name, busStop.LongName);
  };

  return (
    <ImageBackground source={require('../assets/images/busStops background.png')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder={t('search_placeholder')}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              filterBusStops(text);
            }}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}>
            <Icon name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        {filteredBusStops.length > 0 && (
          <FlatList
            data={filteredBusStops}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSuggestionPress(item)}>
                <Text style={styles.suggestionText}>{item.LongName}</Text>
              </TouchableOpacity>
            )}
            style={styles.suggestionsContainer}
          />
        )}
        <TouchableOpacity style={styles.nearestButton} onPress={handleNearestPress}>
          <Icon name="map-marker" size={20} color="#fff" />
          <Text style={styles.nearestButtonText}>{t('nearest_button')}</Text>
        </TouchableOpacity>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={styles.resultsWrapper}>
            <View>
              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : (
                searchedBusStop != null ? (
                  <Text style={styles.busStopResult}>{searchedBusStop}</Text>
                ) : (
                  <Text style={styles.resultText1}>{t('no_bus_stop_searched')}</Text>
                )
              )}
            </View>
            <View style={styles.resultContainers}>
              <View style={styles.resultContainer}>
                {error ? (
                  <Text style={styles.errorText}>{error}</Text>
                ) : (
                  busData.length > 0 ? (
                    busData.map((name, index) => (
                      <Text key={index} style={styles.resultText}>{name}</Text>
                    ))
                  ) : (
                    <Text style={styles.resultText1}>{t('no_shuttles_found')}</Text>
                  )
                )}
              </View>
              <View style={styles.resultContainer1}>
                {error ? (
                  <Text style={styles.errorText}>{error}</Text>
                ) : (
                  busData.length > 0 ? (
                    timings.map((arrivalTiming, index) => (
                      <Text key={index} style={styles.resultText1}>{arrivalTiming}</Text>
                    ))
                  ) : (
                    <Text style={styles.resultText1}>{t('no_timings_found')}</Text>
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
    resizeMode: 'cover', 
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
    paddingTop: 40, 
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
  nearestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF7F00',
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  nearestButtonText: {
    marginLeft: 10,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    padding: 10,
  },
  busStopResult: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    marginVertical: 2,
    backgroundColor: '#B3E5FC',
    padding: 10,
    borderRadius: 10,
    overflow: 'hidden',
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
  closestBusStopText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  suggestionsContainer: {
    maxHeight: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  suggestionText: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
