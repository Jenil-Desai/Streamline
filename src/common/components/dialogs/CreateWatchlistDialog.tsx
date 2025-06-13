import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { X } from 'lucide-react-native';
import { ThemeColors } from '../../context/ThemeContext';
import { createWatchlist } from '../../services/watchlistService';
import { useAuth } from '../../context/AuthContext';

interface CreateWatchlistDialogProps {
  visible: boolean;
  onClose: () => void;
  onWatchlistCreated: (watchlist: any) => void;
  theme: ThemeColors;
}

const CreateWatchlistDialog: React.FC<CreateWatchlistDialogProps> = ({
  visible,
  onClose,
  onWatchlistCreated,
  theme,
}) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const handleCreateWatchlist = async () => {
    if (!token) {
      Alert.alert('Error', 'You must be logged in to create a watchlist');
      return;
    }

    if (name.trim() === '') {
      setError('Watchlist name cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await createWatchlist(name.trim(), token);

      if (response.success && response.watchlist) {
        onWatchlistCreated(response.watchlist);
        setName('');
        onClose();
      } else {
        setError(response.error || 'Failed to create watchlist');
      }
    } catch (err) {
      console.error('Error creating watchlist:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setError(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>
              Create New Watchlist
            </Text>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <X size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, { color: theme.text }]}>Watchlist Name</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.surface,
                color: theme.text,
                borderColor: error ? theme.error : theme.border,
              }
            ]}
            value={name}
            onChangeText={setName}
            placeholder="Enter watchlist name"
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={true}
          />

          {error && (
            <Text style={[styles.errorText, { color: theme.error }]}>
              {error}
            </Text>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.cancelButton,
                { borderColor: theme.border },
              ]}
              onPress={handleCancel}
            >
              <Text style={[styles.cancelButtonText, { color: theme.text }]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.createButton,
                {
                  backgroundColor: theme.primary,
                  opacity: isSubmitting ? 0.7 : 1,
                }
              ]}
              onPress={handleCreateWatchlist}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={theme.background} />
              ) : (
                <Text style={[styles.createButtonText, { color: theme.background }]}>
                  Create
                </Text>
              )}
            </TouchableOpacity>
          </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
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
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  createButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateWatchlistDialog;
