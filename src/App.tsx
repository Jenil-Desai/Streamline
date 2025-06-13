import React from 'react';

import { ThemeProvider } from './common/context/ThemeContext';
import { AuthProvider } from './common/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './screens/welcome/WelcomeScreen';
import RegisterScreen from './screens/register/RegisterScreen';
import LoginScreen from './screens/login/LoginScreen';
import OnboardScreen from './screens/onboard/OnboardScreen';
import HomeScreenIndex from './screens/home/HomeScreenIndex';

const Stack = createNativeStackNavigator();

export default function App(): React.JSX.Element {
  const initialTheme = 'system';

  return (
    <AuthProvider>
      <ThemeProvider initialTheme={initialTheme}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
            />
            <Stack.Screen
              name="Onboard"
              component={OnboardScreen}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreenIndex}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}
