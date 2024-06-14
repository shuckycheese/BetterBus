import React from 'react';
import { View, Text } from 'react-native';
import { RNCamera } from 'react-native-camera';

const CameraScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <RNCamera
        style={{ flex: 1 }}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        autoFocus={RNCamera.Constants.AutoFocus.on}
        whiteBalance={RNCamera.Constants.WhiteBalance.auto}
        captureAudio={false}
      />
    </View>
  );
};

export default CameraScreen;
