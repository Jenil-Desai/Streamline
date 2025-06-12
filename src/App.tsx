import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { font } from './utils/font-family';

export default function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Welcome to the App!</Text>
      <Text style={styles.text2}>Welcome to the App!</Text>
      <Text style={styles.text3}>Welcome to the App!</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: font.regular(),
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  text2: {
    fontFamily: font.lightItalic(),
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  text3: {
    fontFamily: font.bold(),
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
