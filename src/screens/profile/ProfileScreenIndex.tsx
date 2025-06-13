import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from './ProfileScreen';
import SettingsScreen from '../settings/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function ProfileScreenIndex() {
  return (
    <Stack.Navigator initialRouteName="Profile" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
      />
    </Stack.Navigator>
  );
}
