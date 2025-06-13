import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../common/components/headers';
import { SettingsOption } from '../../common/components/SettingsOption';
import { ArrowLeft, HelpCircle, Info, Moon, User } from 'lucide-react-native';
import { useTheme } from '../../common/context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../types/navigation';
import { View, Linking, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProps>();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="Settings"
        leftIcon={<ArrowLeft color={theme.text} />}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={[styles.contentContainer]}>
        <SettingsOption
          icon={<User color={theme.text} />}
          title="Edit Profile"
          onPress={() => navigation.navigate('EditProfile')}
        />
        <SettingsOption
          icon={<Moon color={theme.text} />}
          title="App Theme"
          onPress={() => navigation.navigate('ThemeSelection')}
        />
        <SettingsOption
          icon={<Info color={theme.text} />}
          title="About App"
          onPress={() => navigation.navigate('AboutApp')}
        />
        <SettingsOption
          icon={<HelpCircle color={theme.text} />}
          title="Help & Support"
          onPress={() => Linking.openURL('https://github.com/Jenil-Desai/Streamline')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
});
