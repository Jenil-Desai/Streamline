import React, { useState, Fragment, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { Edit2, Trash2, MoreHorizontal } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useWatchlist } from '../../context/WatchlistContext';
import { Watchlist } from '../../../types/user/watchlist';
import { EditWatchlistDialog } from './';
import { font } from '../../utils/font-family';

interface WatchlistActionsProps {
  watchlist: Watchlist;
  onUpdate?: (watchlist: Watchlist) => void;
  onDelete?: () => void;
}

const WatchlistActions: React.FC<WatchlistActionsProps> = ({
  watchlist,
  onUpdate,
  onDelete,
}) => {
  const moreButtonRef = useRef<View>(null);
  const [optionsPosition, setOptionsPosition] = useState({ top: 0, right: 0 });
  const { theme, isDark } = useTheme();
  const { deleteWatchlist } = useWatchlist();
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);

  const toggleOptions = () => {
    if (!isOptionsVisible) {
      // Measure the position of the more button to position the dropdown
      moreButtonRef.current?.measure((x, y, width, height, pageX, pageY) => {
        setOptionsPosition({
          top: pageY + height + 5,
          right: 20 // Fixed distance from right edge of screen
        });
        setIsOptionsVisible(true);
      });
    } else {
      setIsOptionsVisible(false);
    }
  };

  const handleEdit = () => {
    setIsOptionsVisible(false);
    setIsEditDialogVisible(true);
  };

  const handleDeleteRequest = () => {
    setIsOptionsVisible(false);
    Alert.alert(
      'Delete Watchlist',
      `Are you sure you want to delete "${watchlist.name}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: confirmDelete,
          style: 'destructive',
        },
      ]
    );
  };

  const confirmDelete = async () => {
    try {
      const response = await deleteWatchlist(watchlist.id);

      if (response.success) {
        if (onDelete) { onDelete(); }
      } else {
        Alert.alert('Error', response.error || 'Failed to delete watchlist');
      }
    } catch (error) {
      console.error('Error deleting watchlist:', error);
      Alert.alert('Error', 'An unexpected error occurred while deleting the watchlist');
    }
  };

  return (
    <Fragment>
      <View style={styles.container}>
        <TouchableOpacity
          ref={moreButtonRef}
          onPress={toggleOptions}
          style={[styles.moreButton]}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <MoreHorizontal size={22} color={theme.textSecondary} />
        </TouchableOpacity>

        <Modal
          visible={isOptionsVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsOptionsVisible(false)}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setIsOptionsVisible(false)}
          >
            <View
              style={[
                styles.optionsContainer,
                {
                  backgroundColor: isDark ? theme.surface : theme.background,
                  borderColor: theme.border,
                  shadowColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)',
                  top: optionsPosition.top,
                  right: optionsPosition.right,
                }
              ]}
            >
              <TouchableOpacity
                style={styles.option}
                onPress={handleEdit}
              >
                <Edit2 size={18} color={theme.text} style={styles.optionIcon} />
                <Text style={[styles.optionText, { color: theme.text }]}>Edit</Text>
              </TouchableOpacity>

              <View style={[styles.divider, { backgroundColor: theme.border }]} />

              <TouchableOpacity
                style={styles.option}
                onPress={handleDeleteRequest}
              >
                <Trash2 size={18} color={theme.error} style={styles.optionIcon} />
                <Text style={[styles.optionText, { color: theme.error }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

      <EditWatchlistDialog
        visible={isEditDialogVisible}
        onClose={() => setIsEditDialogVisible(false)}
        watchlist={watchlist}
        onUpdated={(updatedWatchlist) => {
          if (onUpdate) onUpdate(updatedWatchlist);
        }}
      />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  moreButton: {
    padding: 4,
  },
  optionsContainer: {
    position: 'absolute',
    width: 140,
    borderRadius: 8,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 6,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    fontFamily: font.medium(),
  },
  divider: {
    height: 1,
    width: '100%',
  },
});

export default WatchlistActions;
