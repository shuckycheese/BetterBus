import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import BusStopsScreen from '../app/BusStops'; // Adjust the path as needed
import * as Location from 'expo-location';
import * as Speech from 'expo-speech';
import axios from 'axios';

// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({ coords: { latitude: 1.3521, longitude: 103.8198 } })),
}));

// Mock expo-speech
jest.mock('expo-speech', () => ({
  speak: jest.fn(),
}));

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BusStopsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<BusStopsScreen />);
    expect(getByPlaceholderText('search_placeholder')).toBeTruthy();
    expect(getByText('nearest_button')).toBeTruthy();
    expect(getByText('no_bus_stop_searched')).toBeTruthy();
    expect(getByText('no_shuttles_found')).toBeTruthy();
    expect(getByText('no_timings_found')).toBeTruthy();
  });

  it('handles search bus stop', async () => {
    const mockResponse = {
      data: {
        stops: ['Bus Stop 1', 'Bus Stop 2'],
      },
    };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const { getByPlaceholderText, getByText, findByText } = render(<BusStopsScreen />);
    fireEvent.changeText(getByPlaceholderText('search_placeholder'), 'some-bus-stop');
    fireEvent.press(getByText('Search'));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('http://3.26.45.118/search-bus-stop', {
        search: 'some-bus-stop',
      });
      expect(Speech.speak).toHaveBeenCalledWith('Found 2 bus stops.', expect.any(Object));
    });

    expect(await findByText('Bus Stop 1')).toBeTruthy();
    expect(await findByText('Bus Stop 2')).toBeTruthy();
  });

  it('handles find nearest bus stop', async () => {
    const mockResponse = {
      data: {
        stops: ['Nearest Bus Stop 1', 'Nearest Bus Stop 2'],
      },
    };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const { getByText, findByText } = render(<BusStopsScreen />);
    fireEvent.press(getByText('nearest_button'));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('http://3.26.45.118/nearest-bus-stop', {
        latitude: 1.3521,
        longitude: 103.8198,
      });
      expect(Speech.speak).toHaveBeenCalledWith('Found 2 nearest bus stops.', expect.any(Object));
    });

    expect(await findByText('Nearest Bus Stop 1')).toBeTruthy();
    expect(await findByText('Nearest Bus Stop 2')).toBeTruthy();
  });
});
