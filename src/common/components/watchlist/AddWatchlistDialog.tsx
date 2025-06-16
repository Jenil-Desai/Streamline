import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { X } from 'lucide-react-native';
import Button from '../buttons/Button';
import { useTheme } from '../../context/ThemeContext';
import { useWatchlist } from '../../context/WatchlistContext';
import { font } from '../../utils/font-family';
import { Input } from '../input';

interface AddWatchlistDialogProps {
  visible: boolean;
  onClose: () => void;
  onCreated?: (watchlist: any) => void;
}

const AddWatchlistDialog: React.FC<AddWatchlistDialogProps> = ({
  visible,
  onClose,
  onCreated,
}) => {
  const { theme } = useTheme();
  const { createNewWatchlist } = useWatchlist();

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Please enter a watchlist name.');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setError(null);

    try {
      const response = await createNewWatchlist(name.trim());
      if (response.success && response.watchlist) {
        setName('');
        if (onCreated) { onCreated(response.watchlist); }
        handleClose();
      } else {
        setError(response.error || 'Failed to create watchlist.');
      }
    } catch (err) {
      console.error('Error creating watchlist:', err);
      setError('Could not create watchlist.');
      Alert.alert('Error', 'Failed to create watchlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setError(null);
    onClose();
  };

  // Reset form state when modal opens or closes
  useEffect(() => {
    if (visible) {
      // Focus on input when modal opens
      setTimeout(() => {
        setName('');
        setError(null);
      }, 100);
    } else {
      // Clear state when modal closes
      setName('');
      setError(null);
      setLoading(false);
    }
  }, [visible]);

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
            <Text style={[styles.title, { color: theme.text }]}>Create New Watchlist</Text>
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
            onSubmitEditing={name.trim() ? handleCreate : undefined}
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
                text="Create"
                variant="primary"
                onClick={handleCreate}
                fullWidth={false}
                style={[styles.button, styles.createButton]}
                disabled={loading || !name.trim()}
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
  createButton: {
    minWidth: 100,
  },
});

export default AddWatchlistDialog;
