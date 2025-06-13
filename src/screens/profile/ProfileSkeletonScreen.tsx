import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Header } from '../../common/components/headers';
import { Settings } from 'lucide-react-native';
import { useTheme } from '../../common/context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../types/navigation';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { COLORS } from '../../common/constants/colors';

export default function ProfileSkeletonScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProps>();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="Profile"
        rightIcon={<Settings color={theme.text} />}
        onRightPress={() => navigation.navigate('Settings')}
      />
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <SkeletonPlaceholder>
          {/* Avatar and User Info Section */}
          <View style={styles.avatarContainer}>
            <SkeletonPlaceholder.Item width={130} height={130} borderRadius={130 / 2} />
            <View style={styles.primaryTextContainer}>
              <SkeletonPlaceholder.Item width={200} height={22} borderRadius={4} />
              <SkeletonPlaceholder.Item marginTop={5} width={150} height={16} borderRadius={4} />
              <SkeletonPlaceholder.Item marginTop={5} width={100} height={14} borderRadius={4} />
            </View>
          </View>

          {/* Bio Section */}
          <View style={styles.secondaryTextContainer}>
            <SkeletonPlaceholder.Item width={50} height={23} borderRadius={4} />
            <SkeletonPlaceholder.Item marginTop={13} width={'100%'} height={16} borderRadius={4} />
            <SkeletonPlaceholder.Item marginTop={8} width={'90%'} height={16} borderRadius={4} />
            <SkeletonPlaceholder.Item marginTop={8} width={'75%'} height={16} borderRadius={4} />
          </View>

          {/* Stats Section */}
          <View style={styles.secondaryTextContainer}>
            <SkeletonPlaceholder.Item width={50} height={23} borderRadius={4} />

            <View style={styles.sectionContent}>
              {/* Movies and Shows Cards - Row */}
              <View style={styles.statCard}>
                {/* Movies Card */}
                <SkeletonPlaceholder.Item
                  width={'47%'}
                  height={120}
                  borderRadius={8}
                  borderWidth={0.5}
                  borderColor={COLORS.GRAY_500}
                >
                  <SkeletonPlaceholder.Item margin={10} width={'70%'} height={18} borderRadius={4} />
                  <SkeletonPlaceholder.Item margin={10} width={'40%'} height={18} borderRadius={4} />
                </SkeletonPlaceholder.Item>

                {/* Shows Card */}
                <SkeletonPlaceholder.Item
                  width={'47%'}
                  height={120}
                  borderRadius={8}
                  borderWidth={0.5}
                  borderColor={COLORS.GRAY_500}
                >
                  <SkeletonPlaceholder.Item margin={10} width={'70%'} height={18} borderRadius={4} />
                  <SkeletonPlaceholder.Item margin={10} width={'40%'} height={18} borderRadius={4} />
                </SkeletonPlaceholder.Item>
              </View>

              {/* Watch Time Card */}
              <SkeletonPlaceholder.Item
                width={'100%'}
                height={120}
                borderRadius={8}
                borderWidth={0.5}
                borderColor={COLORS.GRAY_500}
                marginTop={20}
              >
                <SkeletonPlaceholder.Item margin={10} width={'50%'} height={18} borderRadius={4} />
                <SkeletonPlaceholder.Item margin={10} width={'30%'} height={18} borderRadius={4} />
              </SkeletonPlaceholder.Item>
            </View>
          </View>
        </SkeletonPlaceholder>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 20,
    gap: 25,
  },
  avatarContainer: {
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
    gap: 16,
  },
  primaryTextContainer: {
    gap: 5,
    alignItems: 'center',
  },
  secondaryTextContainer: {
    marginTop: 25,
    gap: 13,
  },
  sectionContent: {
    marginTop: 20,
    gap: 20,
  },
  statCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
