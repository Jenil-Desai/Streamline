import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import CategoryListScreen from '../category/CategoryListScreen';
import TVDetailsScreen from '../tv-details/TVDetailsScreen';
import MovieDetailsScreen from '../movie-details/MovieDetailsScreen';

const Stack = createNativeStackNavigator();

export default function HomeStack(): React.JSX.Element {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CategoryList" component={CategoryListScreen} />
      <Stack.Screen name="TVShowDetail" component={TVDetailsScreen} />
      <Stack.Screen name="MovieDetail" component={MovieDetailsScreen} />
    </Stack.Navigator>
  );
}
