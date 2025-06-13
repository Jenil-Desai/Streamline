import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import { Bookmark, Home, Search, User } from 'lucide-react-native';
import { useTheme } from '../../common/context/ThemeContext';
import ProfileScreenIndex from '../profile/ProfileScreenIndex';
import SearchScreen from '../search/SearchScreen';

const Tab = createBottomTabNavigator();

export default function HomeScreenIndex(): React.JSX.Element {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
          paddingTop: 15,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, size }) => (
            <Home
              color={focused ? theme.primary : theme.textSecondary}
              size={size}
            />
          ),
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textSecondary,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, size }) => (
            <Search
              color={focused ? theme.primary : theme.textSecondary}
              size={size}
            />
          ),
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textSecondary,
        }}
      />
      <Tab.Screen
        name="Watchlist"
        component={HomeScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, size }) => (
            <Bookmark
              color={focused ? theme.primary : theme.textSecondary}
              size={size}
            />
          ),
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textSecondary,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreenIndex}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, size }) => (
            <User
              color={focused ? theme.primary : theme.textSecondary}
              size={size}
            />
          ),
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textSecondary,
        }}
      />
    </Tab.Navigator>
  );
}
