import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IndexScreen from './Index';
import { Bookmark, Home, Search, User } from 'lucide-react-native';
import { useTheme } from '../../common/context/ThemeContext';
import ProfileScreen from '../profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function HomeScreen(): React.JSX.Element {
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
        component={IndexScreen}
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
        component={IndexScreen}
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
        component={IndexScreen}
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
        component={ProfileScreen}
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
