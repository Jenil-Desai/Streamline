import React, { useEffect, useState } from 'react';

import { ThemeProvider } from './common/context/ThemeContext';
import { AuthProvider } from './common/context/AuthContext';
import { WatchlistContextProvider } from './common/context/WatchlistContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme, AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WelcomeScreen from './screens/welcome/WelcomeScreen';
import RegisterScreen from './screens/register/RegisterScreen';
import LoginScreen from './screens/login/LoginScreen';
import OnboardScreen from './screens/onboard/OnboardScreen';
import HomeScreenIndex from './screens/home/HomeScreenIndex';

const Stack = createNativeStackNavigator();

function MainApp(): React.JSX.Element {
  const colorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        AsyncStorage.getItem('@theme_preference')
          .then(savedTheme => {
            if (savedTheme) {
              setThemeType(savedTheme as 'light' | 'dark' | 'system');
            }
          })
          .catch(error => console.error('Failed to load theme preference:', error));
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('@theme_preference')
      .then(savedTheme => {
        if (savedTheme) {
          setThemeType(savedTheme as 'light' | 'dark' | 'system');
        }
      })
      .catch(error => console.error('Failed to load theme preference:', error));
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider initialTheme={themeType} key={`theme-${colorScheme}-${themeType}`}>
        <WatchlistContextProvider>
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
        </WatchlistContextProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default function App(): React.JSX.Element {
  return <MainApp />;
}
