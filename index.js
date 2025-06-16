import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import React from 'react';

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context('./app');
  return React.createElement(ExpoRoot, { context: ctx });
}

// Register the main component
registerRootComponent(App); 