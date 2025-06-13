import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../common/components/headers';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../../common/context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../types/navigation';

export default function SettingsScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProps>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header
        title="Settings"
        leftIcon={<ArrowLeft color={theme.text} />}
        onLeftPress={() => navigation.goBack()}
      />
    </SafeAreaView>
  )
}
