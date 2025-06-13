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
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
