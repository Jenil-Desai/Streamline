import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Welcome: undefined;
  Register: undefined;
  Onboard: undefined;
  Login: undefined;
  Home: undefined;
  Search: undefined;
  Profile: undefined;
  Settings: undefined;
  EditProfile: undefined;
  AboutApp: undefined;
  ThemeSelection: undefined;
  MediaDetail: { id: number };
  CategoryList: { category: string };
  Watchlist: undefined;
  WatchlistItems: { id: string; name: string };
  TVShowDetail: { id: number };
  MovieDetail: { id: number };
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
