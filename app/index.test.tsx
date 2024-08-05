import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomePage from '../app/index'; 
import { useNavigation } from '@react-navigation/native';
import i18n from '../translations/i18n';
import { useTranslation } from 'react-i18next';


jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('../translations/i18n', () => ({
  changeLanguage: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn().mockReturnValue({
    t: (key : any) => key,
  }),
}));

describe('HomePage', () => {
  const navigate = jest.fn();
  const setModalVisible = jest.fn();

  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue({ navigate });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<HomePage />);
    expect(getByText('language')).toBeTruthy();
    expect(getByText('camera')).toBeTruthy();
    expect(getByText('bus_stops')).toBeTruthy();
  });

  it('navigates to CameraScreen on camera button press', () => {
    const { getByText } = render(<HomePage />);
    fireEvent.press(getByText('camera'));
    expect(navigate).toHaveBeenCalledWith('CameraScreen');
  });

  it('navigates to BusStops on bus stop button press', () => {
    const { getByText } = render(<HomePage />);
    fireEvent.press(getByText('bus_stops'));
    expect(navigate).toHaveBeenCalledWith('BusStops');
  });

  it('opens and closes the language modal', () => {
    const { getByText, queryByText } = render(<HomePage />);
    fireEvent.press(getByText('language'));
    expect(queryByText('select_language')).toBeTruthy();
    fireEvent.press(getByText('close'));
    expect(queryByText('select_language')).toBeFalsy();
  });

  it('changes language when language option is pressed', async () => {
    const { getByText } = render(<HomePage />);
    fireEvent.press(getByText('language'));
    fireEvent.press(getByText('english'));
    await waitFor(() => expect(i18n.changeLanguage).toHaveBeenCalledWith('en'));
    fireEvent.press(getByText('language'));
    fireEvent.press(getByText('malay'));
    await waitFor(() => expect(i18n.changeLanguage).toHaveBeenCalledWith('ms'));
    fireEvent.press(getByText('language'));
    fireEvent.press(getByText('chinese'));
    await waitFor(() => expect(i18n.changeLanguage).toHaveBeenCalledWith('zh'));
  });
});
