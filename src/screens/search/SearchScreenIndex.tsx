import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import TVDetailsScreen from '../details';
import MovieDetailsScreen from '../details/MovieDetailsScreen';
import SearchScreen from './SearchScreen';

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
