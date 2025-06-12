import { Image, StyleSheet, Text, View } from 'react-native';
import Button from '../../common/components/buttons/Button';
import { font } from '../../common/utils/font-family';
import { useTheme } from '../../common/context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../types/navigation';
import { useAuth } from '../../common/context/AuthContext';
import { useEffect } from 'react';


export default function WelcomeScreen() {
  const navigation = useNavigation<NavigationProps>();
  const { isAuthenticated, isUserOnboarded } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    if (isAuthenticated && isUserOnboarded()) {
      navigation.replace('Onboard');
    } else if (isAuthenticated) {
      navigation.replace('Home');
    }
  });

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.background },
    ]}>
      <Image source={require('../../assets/images/welcome-image.png')} style={styles.image} />
      <View style={styles.contentContainer}>
        <Text style={[
          styles.text,
          { color: theme.text },
        ]}>
          Your Ultimate Movie Companion
        </Text>
        <View style={styles.buttonContainer}>
          <Button text="Dive Into Your Watch History" variant="primary" onClick={() => navigation.replace('Login')} />
          <Button text="New Here? Create an Account" variant="secondary" onClick={() => navigation.replace('Register')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  image: {
    width: '100%',
    height: '40%',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    padding: 20,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
    fontFamily: font.bold(),
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 10,
  },
});
