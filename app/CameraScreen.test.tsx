import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CameraScreen from './CameraScreen';
import axios from 'axios';
import * as Speech from 'expo-speech';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock expo-camera
jest.mock('expo-camera', () => ({
  CameraView: 'CameraView',
  CameraType: {
    front: 'front',
    back: 'back',
  },
  useCameraPermissions: jest.fn().mockReturnValue([{ granted: true }, jest.fn()]),
}));

// Mock expo-speech
jest.mock('expo-speech', () => ({
  speak: jest.fn(),
}));

// Mock expo-image-manipulator
jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn().mockResolvedValue({ uri: 'resized-image-uri' }),
}));

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
    launchImageLibraryAsync: jest.fn(),
    MediaTypeOptions: {
      Images: 'Images', 
    },
  }));

describe('CameraScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<CameraScreen />);
    expect(getByText('Capture Image')).toBeTruthy();
    expect(getByText('Upload')).toBeTruthy();
    expect(getByText('Bus Result:')).toBeTruthy();
  });

  it('takes a picture and processes the image', async () => {
    const { getByText, queryByText } = render(<CameraScreen />);
    const captureButton = getByText('Capture Image');

    fireEvent.press(captureButton);

    await waitFor(() => expect(queryByText('Bus Result:')).toBeTruthy());
  });

  it('uploads a picture and processes the image', async () => {
    const { getByText, queryByText } = render(<CameraScreen />);
    const uploadButton = getByText('Upload');

    fireEvent.press(uploadButton);

    await waitFor(() => expect(queryByText('Bus Result:')).toBeTruthy());
  });

  it('resets the screen', async () => {
    const { getByText, queryByText, queryByTestId } = render(<CameraScreen />);
    const captureButton = getByText('Capture Image');
    
    // Simulate taking a picture
    fireEvent.press(captureButton);
    
    // Ensure the image is displayed (simulating the image has been captured)
    await waitFor(() => {
      expect(queryByTestId('full-screen-image')).toBeTruthy();
    });

    const resetButton = getByText('Reset');
    
    // Simulate pressing the Reset button
    fireEvent.press(resetButton);
    
    // Check that the image is no longer present
    await waitFor(() => {
      expect(queryByTestId('full-screen-image')).toBeNull();
    });

    // Check that other elements are still present
    await waitFor(() => {
      expect(getByText('Capture Image')).toBeTruthy();
      expect(getByText('Upload')).toBeTruthy();
      expect(getByText('Bus Result:')).toBeTruthy();
    });
  });

  it('plays the bus result as audio', async () => {
    const mockResponse = { data: { result: 'Bus 123' } };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const { getByText, queryByText } = render(<CameraScreen />);
    const captureButton = getByText('Capture Image');

    fireEvent.press(captureButton);

    await waitFor(() => expect(queryByText('Bus Result: Bus 123')).toBeTruthy());
    expect(Speech.speak).toHaveBeenCalledWith('Bus 123', expect.any(Object));
  });
});
