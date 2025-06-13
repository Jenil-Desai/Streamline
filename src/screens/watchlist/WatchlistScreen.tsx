import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../common/components/headers';
import { StyleSheet, View, Text, RefreshControl, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Plus, Clock, List, BookMarked } from 'lucide-react-native';
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
import { AddWatchlistDialog } from '../../common/components/watchlist';

export default function WatchlistScreen() {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const { token } = useAuth();
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NavigationProps>();

  const fetchWatchlists = useCallback(async () => {
    try {
      const response = await axios.get<WatchlistsResponse>(`${BASE_URL}/watchlists`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data;
      if (data.success) {
        setWatchlists(data.watchlists);
      }
    } catch (error) {
      console.error('Error fetching watchlists:', error);
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
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconContainer, { backgroundColor: isDark ? theme.primaryDark : theme.primaryLight }]}>
        <List size={40} color={theme.primary} />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        No Watchlists Found
      </Text>
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
        Create your first watchlist to start tracking content you want to watch.
      </Text>
      <TouchableOpacity
        style={[styles.createButton, { backgroundColor: theme.primary }]}
        onPress={handleCreateWatchlist}
        activeOpacity={0.8}
      >
        <Plus size={18} color={COLORS.WHITE} style={styles.createButtonIcon} />
        <Text style={[styles.createButtonText, { color: COLORS.WHITE }]}>Create New Watchlist</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return <WatchlistSkeletonScreen />;
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

const { width } = Dimensions.get('window');

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
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    maxWidth: width * 0.9,
    alignSelf: 'center',
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: font.bold(),
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: font.regular(),
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  createButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  createButtonIcon: {
    marginRight: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: font.semiBold(),
  }
});
