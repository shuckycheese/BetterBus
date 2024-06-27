import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import i18n from '../translations/i18n';
import { useTranslation } from 'react-i18next';

// Define the type for your navigation stack
type RootStackParamList = {
  index: undefined;
  BusStops: undefined;
  CameraScreen: undefined;
};

// Use the type for the navigation prop
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'index'>;

export default function HomePage() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLanguagePress = () => {
    setModalVisible(true);
  };

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setModalVisible(false);
  };

  return (
    <ImageBackground source={require('../assets/images/betterbus background.png')} style={styles.background}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.languageButton} onPress={handleLanguagePress}>
          <Text style={styles.languageButtonText}>{t('language')}</Text>
        </TouchableOpacity>
        <Image source={require('../assets/images/betterbus logo.png')} style={styles.logo} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={{ ...styles.button, ...styles.cameraButton }} onPress={() => navigation.navigate('CameraScreen')}>
            <View style={styles.buttonContent}>
              <Icon name="camera" style={styles.icon} />
              <Text style={styles.buttonText}>{t('camera')}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ ...styles.button, ...styles.busStopButton }}
            onPress={() => navigation.navigate('BusStops')}
          >
            <View style={styles.buttonContent}>
              <Icon name="bus" style={styles.icon} />
              <Text style={styles.buttonText}>{t('bus_stops')}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{t('select_language')}</Text>
              <TouchableOpacity style={styles.modalButton} onPress={() => changeLanguage('en')}>
                <Text style={styles.modalButtonText}>{t('english')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => changeLanguage('zh')}>
                <Text style={styles.modalButtonText}>{t('chinese')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => changeLanguage('ms')}>
                <Text style={styles.modalButtonText}>{t('malay')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>{t('close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  languageButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    zIndex: 1,
  },
  languageButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
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
    backgroundColor: '#007BFF',
  },
  busStopButton: {
    backgroundColor: '#FF7F00',
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'grey',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
