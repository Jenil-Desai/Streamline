import React, { FC, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  FlatList,
  Alert,
  Linking,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { ChevronDown, Layers, ExternalLink } from 'lucide-react-native';
import { SectionHeader } from '../../common/components/ui/SectionHeader';
import { WatchProviders, Provider } from '../../types/tv';

interface WatchProviderSectionProps {
  watchProviders: WatchProviders;
  selectedCountry: string;
  selectedProviderType: string;
  availableProviderTypes: string[];
  countryOptions: string[];
  setSelectedCountry: (country: string) => void;
  setSelectedProviderType: (type: string) => void;
  theme: any; // Theme type
}

// Watch Provider Section Component
const WatchProviderSection: FC<WatchProviderSectionProps> = ({
  watchProviders,
  selectedCountry,
  selectedProviderType,
  availableProviderTypes,
  countryOptions,
  setSelectedCountry,
  setSelectedProviderType,
  theme,
}) => {
  const [countryModalVisible, setCountryModalVisible] = useState<boolean>(false);
  const [loadingProvider, setLoadingProvider] = useState<number | null>(null);

  // Handle country selection
  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    setCountryModalVisible(false);

    // Reset provider type if current selection is not available in new country
    const newCountryData = watchProviders[country];
    if (newCountryData) {
      if (!newCountryData[selectedProviderType as keyof typeof newCountryData]) {
        // Find first available provider type
        const availableType = Object.keys(newCountryData).find(
          key => key !== 'link' && Array.isArray(newCountryData[key as keyof typeof newCountryData]) &&
            (newCountryData[key as keyof typeof newCountryData] as any[]).length > 0
        );
        if (availableType) {
          setSelectedProviderType(availableType);
        }
      }
    }
  };

  // Navigate to general streaming link for all providers
  const handleWatchProviderLink = () => {
    if (selectedCountry && watchProviders[selectedCountry]) {
      const link = watchProviders[selectedCountry].link;
      if (link) {
        Linking.canOpenURL(link).then(supported => {
          if (supported) {
            Linking.openURL(link);
          } else {
            Alert.alert('Cannot open URL', 'Your device cannot open this streaming link.');
          }
        });
      }
    }
  };

  // Navigate to specific provider
  const handleProviderClick = async (provider: Provider) => {
    if (selectedCountry && watchProviders[selectedCountry]) {
      try {
        setLoadingProvider(provider.provider_id);
        const link = watchProviders[selectedCountry].link;
        if (link) {
          // Most TMDB provider links follow this pattern
          const providerSpecificLink = `${link}`;

          const supported = await Linking.canOpenURL(providerSpecificLink);
          if (supported) {
            await Linking.openURL(providerSpecificLink);
          } else {
            // Fallback to the general link if provider-specific link fails
            try {
              await Linking.openURL(link);
            } catch (error) {
              Alert.alert('Cannot Open Link', `Unable to open ${provider.provider_name} streaming service.`);
            }
          }
        } else {
          Alert.alert('Missing Link', 'No streaming link available for this provider.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to open provider link.');
      } finally {
        setLoadingProvider(null);
      }
    }
  };

  const openCountryModal = () => {
    setCountryModalVisible(true);
  };

  const closeCountryModal = () => {
    setCountryModalVisible(false);
  };

  const renderCountryItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.countryItem,
        item === selectedCountry && {
          backgroundColor: theme.secondary + '40',
        },
      ]}
      onPress={() => handleCountrySelect(item)}
    >
      <Text style={[styles.countryItemText, { color: theme.text }]}>
        {item}
      </Text>
      {item === selectedCountry && (
        <Text style={{ color: theme.primary }}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <SectionHeader title="Watch Providers" theme={theme} />

      {/* Country selector and link button */}
      <View style={styles.watchProviderHeader}>
        <View style={styles.watchCountryContainer}>
          <Layers size={16} color={theme.textSecondary} style={styles.layersIcon} />
          <Text style={[styles.watchProviderSubtitle, { color: theme.textSecondary }]}>
            Available in
          </Text>
          <TouchableOpacity
            style={[styles.countrySelector, { backgroundColor: theme.secondary }]}
            onPress={openCountryModal}
          >
            <Text style={[styles.countrySelectorText, { color: theme.text }]}>
              {selectedCountry}
            </Text>
            <ChevronDown size={16} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Link to TMDB */}
        {selectedCountry && watchProviders[selectedCountry]?.link && (
          <TouchableOpacity
            style={[styles.watchNowButton, { backgroundColor: theme.primary }]}
            onPress={handleWatchProviderLink}
          >
            <Text style={styles.watchNowButtonText}>View All</Text>
            <ExternalLink size={14} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Provider types selector */}
      {availableProviderTypes.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.providerTypesScrollView}
        >
          {availableProviderTypes.map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.providerTypePill,
                {
                  backgroundColor:
                    selectedProviderType === type
                      ? theme.primary
                      : theme.secondary,
                },
              ]}
              onPress={() => setSelectedProviderType(type)}
            >
              <Text
                style={[
                  styles.providerTypeText,
                  selectedProviderType === type ? styles.selectedProviderText : { color: theme.text },
                ]}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Provider logos */}
      {selectedCountry &&
        watchProviders[selectedCountry] &&
        watchProviders[selectedCountry][selectedProviderType as keyof typeof watchProviders[typeof selectedCountry]] ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.providersContainer}
        >
          {(watchProviders[selectedCountry][selectedProviderType as keyof typeof watchProviders[typeof selectedCountry]] as Provider[])?.map((provider: Provider) => (
            <TouchableOpacity
              key={provider.provider_id}
              style={[
                styles.providerCard,
                loadingProvider === provider.provider_id ? styles.dimmedProvider : null,
              ]}
              onPress={() => handleProviderClick(provider)}
              activeOpacity={0.7}
              disabled={loadingProvider !== null}
            >
              <View style={styles.providerLogoContainer}>
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/original${provider.logo_path}` }}
                  style={styles.providerLogo}
                  resizeMode="contain"
                />
                {loadingProvider === provider.provider_id && (
                  <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="small" color={theme.primary} />
                  </View>
                )}
                <View style={styles.linkIconContainer}>
                  <ExternalLink size={12} color={theme.textSecondary} />
                </View>
              </View>
              <Text style={[styles.providerName, { color: theme.textSecondary }]} numberOfLines={2}>
                {provider.provider_name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <Text style={[styles.noContent, { color: theme.textSecondary }]}>
          No {selectedProviderType} providers available in {selectedCountry}
        </Text>
      )}

      {/* Country selection modal */}
      <Modal
        visible={countryModalVisible}
        transparent={true}
        animationType="slide"
        statusBarTranslucent={true}
        onRequestClose={closeCountryModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={[styles.modalOverlay, styles.modalBackground]}>
            <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>Select Country</Text>
                <TouchableOpacity onPress={closeCountryModal}>
                  <Text style={[styles.modalClose, { color: theme.primary }]}>Close</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={countryOptions}
                keyExtractor={(item) => item}
                renderItem={renderCountryItem}
                style={styles.countryList}
                showsVerticalScrollIndicator={true}
                initialNumToRender={15}
                windowSize={5}
                maxToRenderPerBatch={20}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  layersIcon: {
    marginRight: 8,
  },
  selectedProviderText: {
    color: '#FFFFFF',
  },
  dimmedProvider: {
    opacity: 0.7,
  },
  watchProviderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  watchCountryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  watchProviderSubtitle: {
    fontSize: 14,
    marginRight: 8,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  countrySelectorText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  watchNowButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  watchNowButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginRight: 4,
  },
  providerTypesScrollView: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  providerTypePill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  providerTypeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  providersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  providerCard: {
    width: 80,
    marginRight: 16,
    alignItems: 'center',
    padding: 5,
  },
  providerLogoContainer: {
    position: 'relative',
    width: 60,
    height: 60,
  },
  providerLogo: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkIconContainer: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 4,
    padding: 2,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  providerName: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    width: '100%',
  },
  noContent: {
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
    paddingHorizontal: 16,
  },
  modalBackground: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    maxHeight: '70%',
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.18,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalClose: {
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  countryList: {
    padding: 8,
  },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 2,
  },
  countryItemText: {
    fontSize: 16,
  },
});

export default WatchProviderSection;
