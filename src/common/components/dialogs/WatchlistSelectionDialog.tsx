import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { X, Plus, Check, AlertCircle } from 'lucide-react-native';
import { ThemeColors } from '../../context/ThemeContext';
import { useWatchlist } from '../../context/WatchlistContext';
import { MediaItem, MediaType } from '../../../types/media';
import CreateWatchlistDialog from './CreateWatchlistDialog';

interface WatchlistSelectionDialogProps {
  visible: boolean;
  onClose: () => void;
  item: MediaItem | null;
  mediaType: MediaType;
  theme: ThemeColors;
}

interface WatchlistItemProps {
  id: string;
  name: string;
  selected: boolean;
  onSelect: (id: string) => void;
  theme: ThemeColors;
}

const WatchlistItem: React.FC<WatchlistItemProps> = ({ id, name, selected, onSelect, theme }) => {
  return (
    <TouchableOpacity
      style={[
        styles.watchlistItem,
        { borderColor: theme.border },
      ]}
      onPress={() => onSelect(id)}
      activeOpacity={0.7}
    >
      <Text style={[styles.watchlistName, { color: theme.text }]}>{name}</Text>
      <View style={[styles.checkCircle, {
        borderColor: theme.primary,
        backgroundColor: selected ? theme.primary : 'transparent'
      }]}>
        {selected && <Check size={18} color={theme.background} />}
      </View>
    </TouchableOpacity>
  );
};

export const WatchlistSelectionDialog: React.FC<WatchlistSelectionDialogProps> = ({
  visible,
  onClose,
  item,
  mediaType,
  theme
}) => {
  const {
    watchlists,
    selectedWatchlistId,
    selectWatchlist,
    isLoading,
    addItemToWatchlist,
    refreshWatchlists
  } = useWatchlist();

  const [selected, setSelected] = useState<string | null>(selectedWatchlistId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createDialogVisible, setCreateDialogVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Reset selected watchlist when dialog opens
  useEffect(() => {
    if (visible) {
      setSelected(selectedWatchlistId);
      refreshWatchlists();
    }
  }, [visible, selectedWatchlistId, refreshWatchlists]);

  const handleSelect = (id: string): void => {
    setSelected(id);
    setErrorMsg(null);
  };

  const handleSubmit = async () => {
    if (!item) {
      setErrorMsg('No media item selected');
      return;
    }

    if (!selected) {
      setErrorMsg('Please select a watchlist first');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const success = await addItemToWatchlist(item, mediaType, selected);

      if (success) {
        selectWatchlist(selected);
        onClose();
      } else {
        setErrorMsg('Failed to add item to watchlist. Please try again.');
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open create watchlist dialog
  const handleCreateNew = () => {
    setCreateDialogVisible(true);
  };

  // Handle watchlist created event
  const handleWatchlistCreated = (newWatchlist: any) => {
    refreshWatchlists();
    setSelected(newWatchlist.id);
    setErrorMsg(null);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>
              Add to Watchlist
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                Loading watchlists...
              </Text>
            </View>
          ) : (
            <>
              <ScrollView style={styles.scrollView}>
                <FlatList
                  data={watchlists}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item: listItem }) => (
                    <WatchlistItem
                      id={listItem.id}
                      name={listItem.name}
                      selected={selected === listItem.id}
                      onSelect={handleSelect}
                      theme={theme}
                    />
                  )}
                  style={styles.list}
                  scrollEnabled={false}
                  ListEmptyComponent={
                    <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                      You don't have any watchlists yet. Create one to get started.
                    </Text>
                  }
                />

                {errorMsg && (
                  <View style={styles.errorContainer}>
                    <AlertCircle size={18} color={theme.error} style={styles.errorIcon} />
                    <Text style={[styles.errorText, { color: theme.error }]}>
                      {errorMsg}
                    </Text>
                  </View>
                )}
              </ScrollView>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.createButton, { borderColor: theme.primary }]}
                  onPress={handleCreateNew}
                >
                  <Plus size={18} color={theme.primary} />
                  <Text style={[styles.createButtonText, { color: theme.primary }]}>
                    Create New
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.addButton,
                    {
                      backgroundColor: selected ? theme.primary : theme.border,
                      opacity: selected ? 1 : 0.5
                    }
                  ]}
                  onPress={handleSubmit}
                  disabled={!selected || isSubmitting}
                  activeOpacity={0.7}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color={theme.background} />
                  ) : (
                    <Text style={[styles.addButtonText, { color: theme.background }]}>
                      Add to Selected
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>

      <CreateWatchlistDialog
        visible={createDialogVisible}
        onClose={() => setCreateDialogVisible(false)}
        onWatchlistCreated={handleWatchlistCreated}
        theme={theme}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    fontSize: 14,
    flex: 1,
  },
  scrollView: {
    maxHeight: 300,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  list: {
    marginBottom: 8,
  },
  watchlistItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    marginBottom: 4,
  },
  watchlistName: {
    fontSize: 16,
    fontWeight: '500',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  createButtonText: {
    marginLeft: 8,
    fontWeight: '500',
  },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontWeight: '600',
  },
});

export default WatchlistSelectionDialog;
