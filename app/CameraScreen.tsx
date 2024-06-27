// import React from 'react';
// import { View, Text } from 'react-native';
// import { RNCamera } from 'react-native-camera';

// const CameraScreen = () => {
//   return (
//     <View style={{ flex: 1 }}>
//       <RNCamera
//         style={{ flex: 1 }}
//         type={RNCamera.Constants.Type.back}
//         flashMode={RNCamera.Constants.FlashMode.off}
//         autoFocus={RNCamera.Constants.AutoFocus.on}
//         whiteBalance={RNCamera.Constants.WhiteBalance.auto}
//         captureAudio={false}
//       />
//     </View>
//   );
// };

// export default CameraScreen;

import React, { useEffect } from 'react';
import { View } from 'react-native';
import { RNCamera } from 'react-native-camera';

const startPythonScript = async () => {
  try {
    const response = await fetch('https://your-app-name.herokuapp.com/start');
    const text = await response.text();
    console.log(text);
  } catch (error) {
    console.error('Error starting script:', error);
  }
};

const CameraScreen = () => {
  useEffect(() => {
    startPythonScript();
    return () => {
      // This cleanup function will run when the component unmounts
      fetch('https://your-app-name.herokuapp.com/stop').then(response => response.text()).then(text => console.log(text)).catch(error => console.error('Error stopping script:', error));
    };
  }, []);

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
