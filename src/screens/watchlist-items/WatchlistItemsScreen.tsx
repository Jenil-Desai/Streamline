import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Film, Tv, Calendar, Clock, CheckCircle, Circle, Play, Paperclip } from 'lucide-react-native';
import moment from 'moment';
import { useRoute, RouteProp } from '@react-navigation/native';

import { MediaCard } from '../../common/components/media/MediaCard';
import { useTheme } from '../../common/context/ThemeContext';
import { font } from '../../common/utils/font-family';
import { WatchlistItem, WatchlistItemStatus, MediaTypeEnum } from '../../types/user/watchlistItem';
import { COLORS } from '../../common/constants/colors';
import { useWatchlistItems } from '../../common/hooks/useWatchlistItems';
import { Header } from '../../common/components/header';
import { ErrorScreen } from '../../common/components/errorScreen';
import { WatchlistItemsSkeletonScreen } from './components';
import { EmptyScreen } from '../../common/components/emptyScreen';

// Define the route params type
type WatchlistItemsParamList = {
  WatchlistItems: {
    id: string;
    name: string;
  };
};

export default function WatchlistItemsScreen() {
  const { theme, isDark } = useTheme();
  const route = useRoute<RouteProp<WatchlistItemsParamList, 'WatchlistItems'>>();
  const { id: watchlistId, name: watchlistName } = route.params;

  const {
    items,
    loading,
    refreshing,
    error,
    numColumns,
    cardWidth,
    onRefresh,
    handleBackPress,
    handleItemPress,
    getStatusText,
    getStatusColor,
    fetchWatchlistItems
  } = useWatchlistItems({ watchlistId });

  const getStatusIcon = (status: WatchlistItemStatus) => {
    switch (status) {
      case WatchlistItemStatus.WATCHED:
        return <CheckCircle size={14} color={theme.success} />;
      case WatchlistItemStatus.IN_PROGRESS:
        return <Play size={14} color={theme.info} />;
      case WatchlistItemStatus.PLANNED:
        return <Circle size={14} color={theme.primary} />;
      case WatchlistItemStatus.DROPPED:
        return <Circle size={14} color={theme.error} />;
      default:
        return <Circle size={14} color={theme.warning} />;
    }
  };

  const renderItem = ({ item }: { item: WatchlistItem }) => {
    return (
      <View style={[styles.itemContainer, { width: cardWidth }]}>
        <MediaCard
          item={item.media_details}
          onPress={() => handleItemPress(item.media_details)}
          theme={theme}
          style={styles.mediaCard}
        />
        <View style={[
          styles.infoContainer,
          { backgroundColor: isDark ? theme.secondary : COLORS.GRAY_100, borderColor: theme.border }
        ]}>
          <View style={styles.infoRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {getStatusIcon(item.status)}
              <Text style={[styles.infoText, { color: getStatusColor(item.status, theme), marginLeft: 4, marginRight: 10 }]}>
                {getStatusText(item.status)}
              </Text>
            </View>
            {item.mediaType === MediaTypeEnum.TV ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Tv size={13} color={theme.textSecondary} style={styles.infoIcon} />
                <Text style={[styles.infoText, { color: theme.textSecondary, marginRight: 10 }]}>TV Show</Text>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Film size={13} color={theme.textSecondary} style={styles.infoIcon} />
                <Text style={[styles.infoText, { color: theme.textSecondary, marginRight: 10 }]}>Movie</Text>
              </View>
            )}
            {item.scheduledAt && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Calendar size={13} color={theme.textSecondary} style={styles.infoIcon} />
                <Text style={[styles.infoText, { color: theme.textSecondary, marginRight: 10 }]}>
                  {moment(item.scheduledAt).format('MMM DD, YYYY')}
                </Text>
              </View>
            )}
            {item.note && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Paperclip size={13} color={theme.textSecondary} style={styles.infoIcon} />
                <Text style={[styles.infoText, { color: theme.textSecondary, marginRight: 10 }]}>
                  {item.note}
                </Text>
              </View>
            )}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Clock size={13} color={theme.textSecondary} style={styles.infoIcon} />
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Added {moment(item.createdAt).format('MMM DD')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyList = () => (
    <EmptyScreen
      icon={<Film size={40} color={theme.primary} />}
      title="No Items Found"
      subtitle="Your watchlist is empty. Add items to start tracking."
      theme={theme}
    />
  );

  if (loading && !refreshing) {
    return <WatchlistItemsSkeletonScreen />;
  }

  if (error && items.length === 0 && !loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Header
          title={watchlistName || 'Watchlist Items'}
          leftIcon={<ChevronLeft color={theme.text} />}
          onLeftPress={handleBackPress}
        />
        <ErrorScreen
          message={error}
          actionText="Retry"
          onAction={fetchWatchlistItems}
          theme={theme}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title={watchlistName || 'Watchlist Items'}
        leftIcon={<ChevronLeft color={theme.text} />}
        onLeftPress={handleBackPress}
      />

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={[
          styles.listContainer,
          items.length === 0 ? styles.emptyListContainer : null
        ]}
        columnWrapperStyle={items.length > 0 ? styles.columnWrapper : undefined}
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
  columnWrapper: {
    justifyContent: 'flex-start',
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemContainer: {
    marginBottom: 24,
    marginRight: 16,
  },
  mediaCard: {
    width: '100%',
  },
  infoContainer: {
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: 'column',
    gap: 10,
  },
  infoIcon: {
    marginRight: 3,
  },
  infoText: {
    fontSize: 11,
    fontFamily: font.medium(),
    lineHeight: 15,
  },

});
