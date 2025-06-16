import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';

import { useAuth } from '../../common/context/AuthContext';
import { NavigationProps } from '../../types/navigation';
import Button from '../../common/components/buttons/Button';
import { useTheme } from '../../common/context/ThemeContext';
import { BASE_URL } from '../../common/constants/config';
import axios from 'axios';
import { OnboardResponse } from '../../types/auth/onboard';
import { Header } from '../../common/components/header';
import { Input } from '../../common/components/input';

interface OnboardData {
  bio: string;
  country?: string;
  countryCode?: CountryCode;
}

export default function OnboardScreen() {
  const navigation = useNavigation<NavigationProps>();
  const { theme } = useTheme();
  const { isAuthenticated, isUserOnboarded, token, login } = useAuth();

  const [formData, setFormData] = useState<OnboardData>({ bio: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof OnboardData, string>>>({});

  const [countryCode, setCountryCode] = useState<CountryCode>('US');
  const [country, setCountry] = useState<Country | null>(null);
  const [isCountryPickerVisible, setIsCountryPickerVisible] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated && isUserOnboarded()) {
      navigation.replace('Home');
    } else if (!isAuthenticated) {
      navigation.replace('Login');
    }
  }, [isAuthenticated, navigation, isUserOnboarded]);

  const updateField = (field: keyof OnboardData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const onSelectCountry = (selectedCountry: Country) => {
    setCountryCode(selectedCountry.cca2);
    setCountry(selectedCountry);
    setIsCountryPickerVisible(false);

    setFormData(prev => ({
      ...prev,
      country: typeof selectedCountry.name === 'string' ? selectedCountry.name : '',
      countryCode: selectedCountry.cca2,
    }));

    if (errors.country) {
      setErrors(prev => ({
        ...prev,
        country: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof OnboardData, string>> = {};

    if (!formData.bio.trim()) {
      newErrors.bio = 'Please provide a bio about yourself';
    }

    if (!country) {
      newErrors.country = 'Please select your country';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCompleteOnboarding = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      const response = await axios.post<OnboardResponse>(`${BASE_URL}/auth/onboard`, {
        bio: formData.bio,
        country: countryCode,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = response.data;
      if (responseData.success && responseData.token) {
        await login({ token: responseData.token });
        navigation.replace('Home');
      } else {
        Alert.alert('Error', responseData.error || 'Onboarding failed. Please try again.');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      Alert.alert('Error', 'Failed to complete onboarding. Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="Complete Profile"
        containerStyle={styles.header}
      />

      <View style={styles.content}>
        <Input
          label="Bio"
          value={formData.bio}
          onChangeText={(text) => updateField('bio', text)}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          error={errors.bio}
          containerStyle={styles.bioContainer}
        />

        <TouchableOpacity
          style={[
            styles.countrySelector,
            errors.country ? styles.countryError : null,
          ]}
          onPress={() => setIsCountryPickerVisible(true)}
        >
          <View style={styles.countryPickerContainer}>
            <CountryPicker
              countryCode={countryCode}
              withFilter
              withFlag
              withCountryNameButton
              withAlphaFilter
              withCallingCode
              withEmoji
              onSelect={onSelectCountry}
              visible={isCountryPickerVisible}
              onClose={() => setIsCountryPickerVisible(false)}
            />
            {!country && (
              <Text style={styles.countryPlaceholder}>Select your country</Text>
            )}
          </View>
        </TouchableOpacity>
        {errors.country && (
          <Text style={styles.errorText}>{errors.country}</Text>
        )}

        <View style={styles.buttonContainer}>
          <Button
            text="Complete Onboarding"
            onClick={handleCompleteOnboarding}
            fullWidth
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    color: '#666666',
  },
  bioContainer: {
    minHeight: 120,
  },
  countrySelector: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9F9F9',
  },
  countryError: {
    borderColor: '#FF3B30',
  },
  countryPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryPlaceholder: {
    color: '#999999',
    marginLeft: 8,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
  buttonContainer: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
});
