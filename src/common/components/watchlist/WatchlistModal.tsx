import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { X, Calendar, Check } from 'lucide-react-native';
import { ThemeColors } from '../../context/ThemeContext';
import { useWatchlist } from '../../context/WatchlistContext';
import { MediaItem } from '../../../types/media';
import { WatchlistItemStatus, MediaTypeEnum } from '../../../types/user/watchlistItem';

interface WatchlistModalProps {
  visible: boolean;
  onClose: () => void;
  item: MediaItem | null;
  theme: ThemeColors;
}

const WatchlistModal: React.FC<WatchlistModalProps> = ({
  visible,
  onClose,
  item,
  theme,
}) => {
  const { watchlists, selectedWatchlistId, selectWatchlist, addItemToWatchlist, isLoading } = useWatchlist();

  const [status, setStatus] = useState<WatchlistItemStatus>(WatchlistItemStatus.PLANNED);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (visible && item) {
      setStatus(WatchlistItemStatus.PLANNED);
      setScheduledDate(null);
    }
  }, [visible, item]);

  if (!item) { return null; }

  const handleAddToWatchlist = async () => {
    if (!item) { return; }

    const mediaType = item.media_type === 'movie' ? MediaTypeEnum.MOVIE : MediaTypeEnum.TV;
    const scheduledDateString = scheduledDate ? scheduledDate.toISOString() : null;

    const success = await addItemToWatchlist(
      item,
      mediaType,
      selectedWatchlistId || undefined,
      status,
      scheduledDateString
    );

    if (success) {
      onClose();
    }
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || scheduledDate;
    setShowDatePicker(Platform.OS === 'ios');
    if (currentDate) {
      setScheduledDate(currentDate);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.modalBackground, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Add to Watchlist</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          {/* Watchlist Selection */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Select Watchlist</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.watchlistsContainer}
          >
            {watchlists.map(watchlist => (
              <TouchableOpacity
                key={watchlist.id}
                style={[
                  styles.watchlistItem,
                  {
                    backgroundColor: selectedWatchlistId === watchlist.id ? theme.primary : 'transparent',
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => selectWatchlist(watchlist.id)}
              >
                <Text
                  style={[
                    styles.watchlistName,
                    { color: selectedWatchlistId === watchlist.id ? 'white' : theme.text },
                  ]}
                  numberOfLines={1}
                >
                  {watchlist.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Status Selection */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Status</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.watchlistsContainer}
          >
            {Object.values(WatchlistItemStatus).map((statusOption) => (
              <TouchableOpacity
                key={statusOption}
                style={[
                  styles.statusItem,
                  {
                    backgroundColor: status === statusOption ? theme.primary : 'transparent',
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => setStatus(statusOption)}
              >
                {status === statusOption && (
                  <Check size={16} color="white" style={styles.checkIcon} />
                )}
                <Text
                  style={[
                    styles.statusText,
                    { color: status === statusOption ? 'white' : theme.text },
                  ]}
                >
                  {statusOption.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Schedule Date Selection */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Schedule (Optional)</Text>
          <Pressable
            style={[styles.dateButton, { borderColor: theme.border }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Calendar size={20} color={theme.textSecondary} style={styles.calendarIcon} />
            <Text style={[styles.dateText, { color: scheduledDate ? theme.text : theme.textSecondary }]}>
              {scheduledDate ? scheduledDate.toLocaleDateString() : 'Select a date'}
            </Text>
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={scheduledDate || new Date()}
              mode="datetime"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          {/* Add Button */}
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={handleAddToWatchlist}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.addButtonText}>Add to Watchlist</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  watchlistsContainer: {
    paddingVertical: 8,
  },
  watchlistItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },
  watchlistName: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  checkIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 8,
  },
  calendarIcon: {
    marginRight: 10,
  },
  dateText: {
    fontSize: 14,
  },
  addButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WatchlistModal;
