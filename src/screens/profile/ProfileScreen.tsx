import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../common/components/headers';
import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native';
import { Settings } from 'lucide-react-native';
import { useTheme } from '../../common/context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { font } from '../../common/utils/font-family';
import axios from 'axios';
import { BASE_URL } from '../../common/constants/config';
import { useAuth } from '../../common/context/AuthContext';
import { useCallback, useEffect, useState } from 'react';
import { Profile, ProfileResponse } from '../../types/user/profile';
import moment from 'moment';
import { COLORS } from '../../common/constants/colors';
import { NavigationProps } from '../../types/navigation';
import ProfileSkeletonScreen from './ProfileSkeletonScreen';
import { ProfileError } from '../../common/components/profile/errors';

export default function ProfileScreen() {
  const [user, setUser] = useState<Profile | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProps>();
  const { token } = useAuth();
  const { theme, isDark } = useTheme();

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const response = await axios.get<ProfileResponse>(`${BASE_URL}/user/profile`, { headers: { Authorization: `Bearer ${token}` } });
      const data = response.data;
      if (data.success && data.profile) {
        setUser(data.profile);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile information');
    }
  }, [token]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  useEffect(() => {
    fetchData();

    const dataInterval = setInterval(() => fetchData(), 900000);

    return () => clearInterval(dataInterval);
  }, [fetchData]);

  if (error && !user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Header
          title="Profile"
          rightIcon={<Settings color={theme.text} />}
          onRightPress={() => navigation.navigate('Settings')}
        />
        <ProfileError
          message={error}
          onRetry={fetchData}
          theme={theme}
        />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <ProfileSkeletonScreen />
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="Profile"
        rightIcon={<Settings color={theme.text} />}
        onRightPress={() => navigation.navigate('Settings')}
      />
      <ScrollView style={styles.contentContainer} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: isDark ? theme.primaryDark : theme.primaryLight }]}>
            <Text style={[styles.avatarText, { color: theme.text }]}>{user.first_name[0] + user.last_name[0]}</Text>
          </View>
          <View style={styles.primaryTextContainer}>
            <Text style={[styles.name, { color: theme.text }]}>{`${user.first_name} ${user.last_name}`}</Text>
            <Text style={[styles.email, { color: theme.primary }]}>{user.email}</Text>
            <Text style={[styles.joined, { color: theme.primary }]}>{`Joined ${moment(user.created_at).format('YYYY')}`}</Text>
          </View>
        </View>
        <View style={styles.secondaryTextContainer}>
          <View style={styles.secondaryTextSectionContainer}>
            <Text style={[styles.sectionHeading, { color: theme.text }]}>Bio</Text>
            <Text style={[styles.sectionText, { color: theme.text }]}>{user.bio || 'No bio available'}</Text>
          </View>
          <View style={styles.secondaryTextSectionContainer}>
            <Text style={[styles.sectionHeading, { color: theme.text }]}>Stats</Text>
            <View style={styles.sectionContent}>
              <View style={{ flexDirection: 'row', gap: 20 }}>
                <View style={[styles.statCard, { width: '47%' }]}>
                  <Text style={[styles.statCardText, { color: theme.text }]}>Movies Watched</Text>
                  <Text style={[styles.statCardText, { color: theme.text }]}>{user.movies_watched}</Text>
                </View>
                <View style={[styles.statCard, { width: '47%' }]}>
                  <Text style={[styles.statCardText, { color: theme.text }]}>Shows Watched</Text>
                  <Text style={[styles.statCardText, { color: theme.text }]}>{user.shows_watched}</Text>
                </View>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statCardText, { color: theme.text }]}>Watch Time</Text>
                <Text style={[styles.statCardText, { color: theme.text }]}>{user.watchTime}</Text>
              </View>
            </View>
          </View>
        </View>
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
    paddingBottom: 0,
    gap: 25,
  },
  avatarContainer: {
    alignItems: 'center',
    width: '100%',
    gap: 16,
  },
  avatar: {
    height: 130,
    width: 130,
    borderRadius: 130 / 2,
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  primaryTextContainer: {
    gap: 5,
  },
  name: {
    fontSize: 22,
    fontFamily: font.bold(),
    textAlign: 'center',
  },
  email: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: font.regular(),
  },
  joined: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: font.regular(),
  },
  secondaryTextContainer: {
    gap: 25,
  },
  secondaryTextSectionContainer: {
    gap: 13,
  },
  sectionHeading: {
    fontSize: 23,
    fontFamily: font.bold(),
    textAlign: 'left',
  },
  sectionText: {
    fontSize: 16,
    fontFamily: font.regular(),
    textAlign: 'left',
  },
  sectionContent: {
    gap: 20,
  },
  statCard: {
    padding: 35,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: COLORS.GRAY_500,
    gap: 20,
  },
  statCardText: {
    fontSize: 18,
    fontFamily: font.medium(),
    textAlign: 'left',
  },
});
