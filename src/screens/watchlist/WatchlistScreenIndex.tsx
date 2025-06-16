import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WatchlistItemsScreen from '../watchlist-items/WatchlistItemsScreen';
import WatchlistScreen from './WatchlistScreen';
import MovieDetailsScreen from '../movie-details/MovieDetailsScreen';
import TVDetailsScreen from '../tv-details/TVDetailsScreen';

const WatchlistStack = createNativeStackNavigator();

export default function WatchlistScreenIndex() {
  return (
    <WatchlistStack.Navigator
      initialRouteName="Watchlist"
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
