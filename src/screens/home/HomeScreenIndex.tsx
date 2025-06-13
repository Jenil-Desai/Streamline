import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Bookmark, Clapperboard, Search, User } from 'lucide-react-native';
import { useTheme } from '../../common/context/ThemeContext';
import ProfileScreenIndex from '../profile/ProfileScreenIndex';
import SearchScreen from '../search/SearchScreen';
import HomeStack from './HomeStack';
import WatchlistScreen from '../watchlist/WatchlistScreen';

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
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
          shadowOffset: { width: 0, height: 0 },
          marginBottom: 5,
          position: 'absolute',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, size }) => (
            <Clapperboard
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
        component={WatchlistScreen}
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
