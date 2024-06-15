import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import 'expo-router/entry';

export default function App() {
  return (
    <AuthProvider>
      <Stack />
    </AuthProvider>
  );
}
