import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WatchlistScreen from './WatchlistScreen';
import WatchlistItemsScreen from './WatchlistItemsScreen';

const WatchlistStack = createNativeStackNavigator();

export default function WatchlistScreenIndex() {
  return (
    <WatchlistStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <WatchlistStack.Screen
        name="Watchlist"
        component={WatchlistScreen}
      />
      <WatchlistStack.Screen
        name="WatchlistItems"
        component={WatchlistItemsScreen}
      />
    </WatchlistStack.Navigator>
  );
}
