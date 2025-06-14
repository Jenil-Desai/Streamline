import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WatchlistScreen from './WatchlistScreen';
import WatchlistItemsScreen from './WatchlistItemsScreen';
import TVDetailsScreen from '../details';
import MovieDetailsScreen from '../details/MovieDetailsScreen';

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
      <WatchlistStack.Screen
        name="TVShowDetail"
        component={TVDetailsScreen}
      />
      <WatchlistStack.Screen
        name="MovieDetail"
        component={MovieDetailsScreen}
      />
    </WatchlistStack.Navigator>
  );
}
