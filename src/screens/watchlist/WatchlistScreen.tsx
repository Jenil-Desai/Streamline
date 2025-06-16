import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../common/components/header';
import { StyleSheet, View, Text, RefreshControl, TouchableOpacity, FlatList } from 'react-native';
import { Plus, Clock, BookMarked } from 'lucide-react-native';
import { useTheme } from '../../common/context/ThemeContext';
import { font } from '../../common/utils/font-family';
import { COLORS } from '../../common/constants/colors';
import moment from 'moment';
import { Watchlist } from '../../types/user/watchlist';
import { AddWatchlistDialog, WatchlistActions } from '../../common/components/watchlist';
import { useWatchlists } from '../../common/hooks/useWatchlists';
import { WatchlistSkeletonScreen } from './components';
import { ErrorScreen } from '../../common/components/errorScreen';
import { EmptyScreen } from '../../common/components/emptyScreen';

export default function WatchlistScreen() {
  const { theme, isDark } = useTheme();

  const {
    watchlists,
    refreshing,
    loading,
    error,
    isDialogVisible,
    setIsDialogVisible,
    fetchWatchlists,
    onRefresh,
    handleWatchlistPress,
    handleCreateWatchlist
  } = useWatchlists();

  const renderWatchlistItem = ({ item }: { item: Watchlist }) => (
    <TouchableOpacity
      style={[styles.watchlistCard, { backgroundColor: isDark ? theme.secondary : COLORS.GRAY_100 }]}
      onPress={() => handleWatchlistPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.watchlistContent}>
        <View style={[styles.iconContainer, { backgroundColor: isDark ? theme.primaryDark : theme.primaryLight }]}>
          <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
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
    <EmptyScreen
      icon={<BookMarked size={40} color={theme.primary} />}
      title="No Watchlists"
      subtitle="Create your first watchlist to keep track of your favorite items."
      theme={theme}
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
        <ErrorScreen
          message={error}
          actionText="Refresh"
          onAction={onRefresh}
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
