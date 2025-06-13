import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../common/components/headers';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../../common/context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../types/navigation';
import { StyleSheet, View, Text } from 'react-native';
import { font } from '../../common/utils/font-family';

export default function AboutAppScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProps>();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="About App"
        leftIcon={<ArrowLeft color={theme.text} />}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.contentContainer}>
        <View>
          <Text style={styles.infoHeading}>About</Text>
          <View>
            <View style={styles.infoCard}>
              <Text>Version</Text>
              <Text>1.1.4</Text>
            </View>
            <View style={styles.infoCard}>
              <Text>Build</Text>
              <Text>Release</Text>
            </View>
          </View>
        </View>
        <View>
          <Text style={[styles.creaditText, { color: theme.primary }]}>
            All Rights Reserved © 2025 Jenil Desai
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  infoHeading: {
    fontFamily: font.bold(),
    fontSize: 18,
  },
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
  },
  creaditText: {
    fontFamily: font.light(),
    fontSize: 14,
    textAlign: 'center',
  },
});
