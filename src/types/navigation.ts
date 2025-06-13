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
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
