import React from 'react';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="BusStops" options={{ title: "Bus Stops" }} />
      <Stack.Screen name="CameraScreen" options={{ title: "Camera" }} />
    </Stack>
  );
}
