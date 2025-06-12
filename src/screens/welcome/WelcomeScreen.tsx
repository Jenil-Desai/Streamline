import { Image, StyleSheet, Text, View, StatusBar } from 'react-native';
import Button from '../../common/components/buttons/Button';
import { font } from '../../common/utils/font-family';
import { useTheme } from '../../common/context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../types/navigation';


export default function WelcomeScreen() {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NavigationProps>();

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.background },
    ]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <Image source={require('../../assets/images/welcome-image.png')} style={styles.image} />
      <View style={styles.contentContainer}>
        <Text style={[
          styles.text,
          { color: theme.text },
        ]}>
          Your Ultimate Movie Companion
        </Text>
        <View style={styles.buttonContainer}>
          <Button text="Dive Into Your Watch History" variant="primary" onClick={() => navigation.navigate('Login')} />
          <Button text="New Here? Create an Account" variant="secondary" onClick={() => navigation.navigate('Register')} />
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
