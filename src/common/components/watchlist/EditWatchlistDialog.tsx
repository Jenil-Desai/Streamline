import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { X } from 'lucide-react-native';
import Button from '../buttons/Button';
import { useTheme } from '../../context/ThemeContext';
import { useWatchlist } from '../../context/WatchlistContext';
import { font } from '../../utils/font-family';
import axios from 'axios';
import { BASE_URL } from '../../constants/config';
import { useAuth } from '../../context/AuthContext';
import { Watchlist } from '../../../types/user/watchlist';
import { Input } from '../input';

interface EditWatchlistDialogProps {
  visible: boolean;
  onClose: () => void;
  watchlist: Watchlist | null;
  onUpdated?: (watchlist: Watchlist) => void;
}

const EditWatchlistDialog: React.FC<EditWatchlistDialogProps> = ({
  visible,
  onClose,
  watchlist,
  onUpdated,
}) => {
  const { theme } = useTheme();
  const { token } = useAuth();
  const { refreshWatchlists } = useWatchlist();

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && watchlist) {
      setName(watchlist.name);
    }
  }, [visible, watchlist]);

  const handleUpdate = async () => {
    if (!watchlist) return;

    if (!name.trim()) {
      setError('Please enter a watchlist name.');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `${BASE_URL}/watchlists/${watchlist.id}`,
        { name: name.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success && response.data.watchlist) {
        await refreshWatchlists();
        if (onUpdated) onUpdated(response.data.watchlist);
        handleClose();
      } else {
        setError('Failed to update watchlist.');
      }
    } catch (err) {
      console.error('Error updating watchlist:', err);
      setError('Could not update watchlist.');
      Alert.alert('Error', 'Failed to update watchlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  // Reset form state when modal opens or closes
  useEffect(() => {
    if (!visible) {
      setError(null);
      setLoading(false);
    }
  }, [visible]);

  if (!watchlist) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[
          styles.dialog,
          { backgroundColor: theme.background, borderColor: theme.border }
        ]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Edit Watchlist</Text>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeButton}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <X size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
          <Input
            label="Watchlist Name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (error) setError(null);
            }}
            error={error || undefined}
            autoFocus
            containerStyle={styles.input}
            variant="outlined"
            placeholder="My Movies List"
            maxLength={50}
            returnKeyType="done"
            onSubmitEditing={name.trim() ? handleUpdate : undefined}
            editable={!loading}
          />
          {loading ? (
            <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />
          ) : (
            <View style={styles.buttonRow}>
              <Button
                text="Cancel"
                variant="ghost"
                onClick={handleClose}
                fullWidth={false}
                style={styles.button}
                disabled={loading}
              />
              <Button
                text="Save"
                variant="primary"
                onClick={handleUpdate}
                fullWidth={false}
                style={[styles.button, styles.saveButton]}
                disabled={loading || !name.trim() || name === watchlist.name}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    width: '90%',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: font.bold(),
  },
  closeButton: {
    padding: 5,
  },
  input: {
    marginBottom: 10,
  },
  loader: {
    marginVertical: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  button: {
    minWidth: 90,
  },
  saveButton: {
    minWidth: 100,
  },
});

export default EditWatchlistDialog;
