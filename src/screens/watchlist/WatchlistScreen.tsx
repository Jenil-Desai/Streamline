import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../common/components/headers';
import { StyleSheet, View, Text, RefreshControl, TouchableOpacity, FlatList } from 'react-native';
import { Plus, Clock, BookMarked } from 'lucide-react-native';
import { useTheme } from '../../common/context/ThemeContext';
import { font } from '../../common/utils/font-family';
import axios from 'axios';
import { BASE_URL } from '../../common/constants/config';
import { useAuth } from '../../common/context/AuthContext';
import { useCallback, useEffect, useState } from 'react';
import { COLORS } from '../../common/constants/colors';
import moment from 'moment';
import { Watchlist, WatchlistsResponse } from '../../types/user/watchlist';
import WatchlistSkeletonScreen from './WatchlistSkeletonScreen';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../types/navigation';
import { AddWatchlistDialog, WatchlistActions, WatchlistEmpty, WatchlistError } from '../../common/components/watchlist';

export default function WatchlistScreen() {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const { token } = useAuth();
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NavigationProps>();

  const fetchWatchlists = useCallback(async () => {
    try {
      setError(null);
      const response = await axios.get<WatchlistsResponse>(`${BASE_URL}/watchlists`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data;
      if (data.success) {
        setWatchlists(data.watchlists);
      }
    } catch (err) {
      console.error('Error fetching watchlists:', err);
      setError('Failed to load watchlists');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchWatchlists();
    setRefreshing(false);
  }, [fetchWatchlists]);

  useEffect(() => {
    setLoading(true);
    fetchWatchlists();

    const dataInterval = setInterval(() => fetchWatchlists(), 900000);

    return () => clearInterval(dataInterval);
  }, [fetchWatchlists]);

  const handleWatchlistPress = (watchlist: Watchlist) => {
    navigation.navigate('WatchlistItems', {
      id: watchlist.id,
      name: watchlist.name
    });
  };

  const handleCreateWatchlist = () => {
    setIsDialogVisible(true);
  };

  const renderWatchlistItem = ({ item }: { item: Watchlist }) => (
    <TouchableOpacity
      style={[styles.watchlistCard, { backgroundColor: isDark ? theme.secondary : COLORS.GRAY_100 }]}
      onPress={() => handleWatchlistPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.watchlistContent}>
        <View style={[styles.iconContainer, { backgroundColor: isDark ? theme.primaryDark : theme.primaryLight }]}>
          <BookMarked size={22} color={theme.text} />
        </View>
        <View style={styles.watchlistTextContainer}>
          <Text style={[styles.watchlistName, { color: theme.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.dateContainer}>
            <Clock size={12} color={theme.textSecondary} style={styles.clockIcon} />
            <Text style={[styles.watchlistDate, { color: theme.textSecondary }]}>
              {moment(item.createdAt).format('MMM DD, YYYY')}
            </Text>
          </View>
        </View>
        <WatchlistActions
          watchlist={item}
          onUpdate={() => fetchWatchlists()}
          onDelete={() => fetchWatchlists()}
        />
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <WatchlistEmpty
      onCreateWatchlist={handleCreateWatchlist}
      theme={theme}
      isDark={isDark}
    />
  );

  if (loading && !refreshing) {
    return <WatchlistSkeletonScreen />;
  }

  if (error && watchlists.length === 0 && !loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Header
          title="My Watchlists"
          rightIcon={<Plus color={theme.text} />}
          onRightPress={handleCreateWatchlist}
        />
        <WatchlistError
          message={error}
          onRetry={fetchWatchlists}
          theme={theme}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="My Watchlists"
        rightIcon={<Plus color={theme.text} />}
        onRightPress={handleCreateWatchlist}
      />
      <AddWatchlistDialog
        visible={isDialogVisible}
        onClose={() => setIsDialogVisible(false)}
        onCreated={() => fetchWatchlists()}
      />
      <FlatList
        data={watchlists}
        renderItem={renderWatchlistItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          watchlists.length === 0 ? styles.emptyListContainer : null
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  watchlistCard: {
    borderRadius: 8,
    marginBottom: 12,
  },
  watchlistContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  watchlistTextContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  watchlistName: {
    fontSize: 17,
    fontFamily: font.semiBold(),
    marginBottom: 6,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    marginRight: 4,
  },
  watchlistDate: {
    fontSize: 14,
    fontFamily: font.regular(),
  },

});
