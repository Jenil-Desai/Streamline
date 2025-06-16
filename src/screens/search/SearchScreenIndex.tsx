import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import SearchScreen from './SearchScreen';
import TVDetailsScreen from '../tv-details/TVDetailsScreen';
import MovieDetailsScreen from '../movie-details/MovieDetailsScreen';

const Stack = createNativeStackNavigator();

export default function SearchScreenIndex() {
  return (
    <Stack.Navigator initialRouteName="Search" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Search"
        component={SearchScreen}
      />
      <Stack.Screen name="TVShowDetail" component={TVDetailsScreen} />
      <Stack.Screen name="MovieDetail" component={MovieDetailsScreen} />
    </Stack.Navigator>
  );
};
