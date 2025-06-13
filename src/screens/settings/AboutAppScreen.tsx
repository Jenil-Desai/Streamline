import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../common/components/headers';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../../common/context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../types/navigation';
import { ScrollView } from 'react-native';

export default function AboutAppScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProps>();

  return (
    <SafeAreaView>
      <Header
        title="About App"
        leftIcon={<ArrowLeft color={theme.text} />}
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView>
        {/* Content for About App Screen */}
      </ScrollView>
    </SafeAreaView>
  )
}
