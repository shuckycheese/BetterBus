import React from 'react';
import { Stack } from 'expo-router';

const Layout: React.FC = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="BusStops" options={{ title: "Bus Stops" }} />
    </Stack>
  );
};

export default Layout;


