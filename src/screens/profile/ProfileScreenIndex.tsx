import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from './ProfileScreen';
import SettingsScreen from '../settings/SettingsScreen';
import EditProfileScreen from '../settings/EditProfileScreen';
import AboutAppScreen from '../settings/AboutAppScreen';
import ThemeSelectionScreen from '../settings/ThemeSelectionScreen';

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
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
      />
      <Stack.Screen
        name="AboutApp"
        component={AboutAppScreen}
      />
      <Stack.Screen
        name="ThemeSelection"
        component={ThemeSelectionScreen}
      />
    </Stack.Navigator>
  );
}
