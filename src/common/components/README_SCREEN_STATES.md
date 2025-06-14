# Screen States Components

This document provides an overview of the loading, error, and empty state components for the Streamline app screens.

## Overview

Each screen in the app has three main states:
1. **Loading State** - Shown while data is being fetched
2. **Error State** - Shown when data fetching fails
3. **Empty State** - Shown when no data is available

## Components Structure

### Profile Screen States

#### Loading State
- **Component**: `ProfileSkeletonScreen`
- **Location**: `src/screens/profile/ProfileSkeletonScreen.tsx`
- **Usage**: Displays animated skeleton placeholders for profile data

#### Error State
- **Component**: `ProfileError`
- **Location**: `src/common/components/profile/errors/ProfileError.tsx`
- **Usage**: Shows error message with retry functionality

```tsx
import { ProfileError } from '../../common/components/profile/errors';

<ProfileError
  message="Failed to load profile information"
  onRetry={fetchData}
  theme={theme}
/>
```

### Watchlist Screen States

#### Loading State
- **Component**: `WatchlistSkeletonScreen`
- **Location**: `src/screens/watchlist/WatchlistSkeletonScreen.tsx`
- **Usage**: Displays animated skeleton placeholders for watchlist cards

#### Error State
- **Component**: `WatchlistError`
- **Location**: `src/common/components/watchlist/errors/WatchlistError.tsx`
- **Usage**: Shows error message with retry functionality

```tsx
import { WatchlistError } from '../../common/components/watchlist';

<WatchlistError
  message="Failed to load watchlists"
  onRetry={fetchWatchlists}
  theme={theme}
/>
```

#### Empty State
- **Component**: `WatchlistEmpty`
- **Location**: `src/common/components/watchlist/WatchlistEmpty.tsx`
- **Usage**: Shows empty state with create watchlist button

```tsx
import { WatchlistEmpty } from '../../common/components/watchlist';

<WatchlistEmpty
  onCreateWatchlist={handleCreateWatchlist}
  theme={theme}
  isDark={isDark}
/>
```

### Watchlist Items Screen States

#### Loading State
- **Component**: `WatchlistItemsSkeletonScreen`
- **Location**: `src/screens/watchlist/WatchlistItemsSkeletonScreen.tsx`
- **Usage**: Displays animated skeleton placeholders for media items

#### Error State
- **Component**: `WatchlistItemsError`
- **Location**: `src/common/components/watchlist/errors/WatchlistItemsError.tsx`
- **Usage**: Shows error message with retry functionality

```tsx
import { WatchlistItemsError } from '../../common/components/watchlist';

<WatchlistItemsError
  message="Failed to load watchlist items"
  onRetry={fetchWatchlistItems}
  theme={theme}
/>
```

#### Empty State
- **Component**: `WatchlistItemsEmpty`
- **Location**: `src/common/components/watchlist/WatchlistItemsEmpty.tsx`
- **Usage**: Shows empty state for empty watchlists

```tsx
import { WatchlistItemsEmpty } from '../../common/components/watchlist';

<WatchlistItemsEmpty
  theme={theme}
  isDark={isDark}
/>
```

## Integration Pattern

Here's the recommended pattern for integrating these states in your screens:

```tsx
export default function YourScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { theme, isDark } = useTheme();

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      // Fetch data logic
      const response = await api.getData();
      setData(response.data);
    } catch (error) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Error state (shown when there's an error and no data)
  if (error && !data && !loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Header title="Screen Title" />
        <YourErrorComponent
          message={error}
          onRetry={fetchData}
          theme={theme}
        />
      </SafeAreaView>
    );
  }

  // Loading state (shown on initial load)
  if (loading && !refreshing) {
    return <YourSkeletonScreen />;
  }

  // Empty state (shown when data is empty array)
  const renderEmptyList = () => (
    <YourEmptyComponent
      theme={theme}
      isDark={isDark}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Screen Title" />
      <FlatList
        data={data}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
      />
    </SafeAreaView>
  );
}
```

## Design Principles

### Error Components
- Consistent layout with centered content
- Icon representing the feature with error overlay
- Clear error title and descriptive message
- Retry button with appropriate action text
- Proper theme integration

### Empty Components
- Welcoming and encouraging messaging
- Feature-appropriate icons
- Clear call-to-action buttons
- Consistent spacing and typography

### Skeleton Components
- Smooth pulse animations
- Accurate representation of final layout
- Theme-aware colors
- Proper aspect ratios and spacing

## Color Scheme

### Light Theme
- Skeleton: `COLORS.GRAY_300`
- Card borders: `COLORS.GRAY_500`
- Background: `theme.background`

### Dark Theme
- Skeleton: `COLORS.GRAY_700`
- Card borders: `COLORS.GRAY_700`
- Background: `theme.background`

## Animation

All skeleton components use a consistent pulse animation:
- Duration: 800ms in each direction
- Opacity range: 0.3 to 0.6
- Continuous loop using `useNativeDriver: true`

## Imports

```tsx
// Error components
import { ProfileError } from '../../common/components/profile/errors';
import { WatchlistError, WatchlistItemsError } from '../../common/components/watchlist';

// Empty components
import { WatchlistEmpty, WatchlistItemsEmpty } from '../../common/components/watchlist';

// Skeleton components
import ProfileSkeletonScreen from './ProfileSkeletonScreen';
import WatchlistSkeletonScreen from './WatchlistSkeletonScreen';
import WatchlistItemsSkeletonScreen from './WatchlistItemsSkeletonScreen';
```
