import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import { useEffect } from 'react';
import { useAuth } from '../../common/context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../types/navigation';

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProps>();
  const { isAuthenticated, isUserOnboarded } = useAuth();

  useEffect(() => {
    if (isAuthenticated && isUserOnboarded()) {
      navigation.replace('Onboard');
    } else if (isAuthenticated) {
      navigation.replace('Home');
    }
  });

  return (
    <SafeAreaView>
      <Text>Login Screen</Text>
    </SafeAreaView>
  );
}
