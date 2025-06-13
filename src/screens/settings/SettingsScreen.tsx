import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../common/components/headers';
import { SettingsOption } from '../../common/components/SettingsOption';
import { ChevronLeft, HelpCircle, Info, LogOut, Moon, User } from 'lucide-react-native';
import { useTheme } from '../../common/context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../types/navigation';
import { View, Linking, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../common/context/AuthContext';

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProps>();
  const { logout } = useAuth();
  const { theme } = useTheme();

  function handleLogout() {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            logout();
            navigation.replace('Login');
          },
          style: 'destructive',
        },
      ]
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="Settings"
        leftIcon={<ChevronLeft color={theme.text} />}
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
        <SettingsOption
          icon={<LogOut color={theme.text} />}
          title='Log Out'
          onPress={() => handleLogout()}
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
