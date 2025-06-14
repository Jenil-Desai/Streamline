import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Bookmark, Clapperboard, Search, User } from 'lucide-react-native';
import { useTheme } from '../../common/context/ThemeContext';
import ProfileScreenIndex from '../profile/ProfileScreenIndex';
import HomeStack from './HomeStack';
import WatchlistScreenIndex from '../watchlist/WatchlistScreenIndex';
import SearchScreenIndex from '../search/SearchScreenIndex';

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
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
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
        component={SearchScreenIndex}
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
        component={WatchlistScreenIndex}
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
