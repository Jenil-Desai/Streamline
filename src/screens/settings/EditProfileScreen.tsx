import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../common/components/headers';
import { ChevronLeft, Check, Mail, User, Flag } from 'lucide-react-native';
import { useTheme } from '../../common/context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../types/navigation';
import { StyleSheet, View, Text, ScrollView, Alert, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import Input from '../../common/components/inputs/Input';
import Button from '../../common/components/buttons/Button';
import axios from 'axios';
import { BASE_URL } from '../../common/constants/config';
import { useAuth } from '../../common/context/AuthContext';
import { Profile, ProfileResponse } from '../../types/user/profile';
import { font } from '../../common/utils/font-family';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';

export default function EditProfileScreen() {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NavigationProps>();
  const { token } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    bio: '',
    country: 'US',
  });
  const [countryCode, setCountryCode] = useState<CountryCode>('US');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [user, setUser] = useState<Profile | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get<ProfileResponse>(`${BASE_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;
      if (data.success && data.profile) {
        setUser(data.profile);
        setFormData({
          first_name: data.profile.first_name,
          last_name: data.profile.last_name,
          email: data.profile.email,
          bio: data.profile.bio || '',
          country: data.profile.country || 'US',
        });

        // Set the country code from profile or default to US
        const code = data.profile.country as CountryCode || 'US';
        setCountryCode(code);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile information.');
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateProfile = async () => {
    if (!validateForm()) { return; }

    setIsLoading(true);
    try {
      // Send only the country code string
      const response = await axios.put(
        `${BASE_URL}/user/profile`,
        {
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          email: formData.email.trim(),
          bio: formData.bio.trim(),
          country: countryCode, // Sending just the country code
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        Alert.alert('Success', 'Profile updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', response.data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'An error occurred while updating your profile');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.first_name.trim()) {
      Alert.alert('Error', 'First name is required');
      return false;
    }
    if (!formData.last_name.trim()) {
      Alert.alert('Error', 'Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    return true;
  };

  const onSelectCountry = (country: Country) => {
    setFormData({ ...formData, country: country.cca2 });
    setCountryCode(country.cca2);
    setShowCountryPicker(false);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="Edit Profile"
        leftIcon={<ChevronLeft color={theme.text} />}
        onLeftPress={() => navigation.goBack()}
        rightIcon={<Check color={theme.text} />}
        onRightPress={handleUpdateProfile}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {user && (
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: isDark ? theme.primaryDark : theme.primaryLight }]}>
                <Text style={[styles.avatarText, { color: theme.text }]}>
                  {formData.first_name[0] + formData.last_name[0]}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.formContainer}>
            <View style={styles.nameRowContainer}>
              <View style={styles.halfInputContainer}>
                <Input
                  label="First Name"
                  value={formData.first_name}
                  onChangeText={(text) => updateField('first_name', text)}
                  leftIcon={<User size={20} color={theme.text} />}
                  containerStyle={styles.inputContainer}
                />
              </View>
              <View style={styles.halfInputContainer}>
                <Input
                  label="Last Name"
                  value={formData.last_name}
                  onChangeText={(text) => updateField('last_name', text)}
                  containerStyle={styles.inputContainer}
                />
              </View>
            </View>

            <Input
              label="Email"
              value={formData.email}
              onChangeText={(text) => updateField('email', text)}
              leftIcon={<Mail size={20} color={theme.text} />}
              containerStyle={styles.inputContainer}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.countryPickerContainer}>
              <TouchableOpacity
                style={[styles.countryPickerButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderColor: theme.border }]}
                onPress={() => setShowCountryPicker(true)}
              >
                <Flag size={20} color={theme.text} style={styles.countryIcon} />
                <Text style={[styles.countryLabel, { color: theme.textSecondary }]}>Country Code</Text>
                <Text style={[styles.countryValue, { color: theme.text }]}>{countryCode}</Text>
              </TouchableOpacity>

              <CountryPicker
                countryCode={countryCode}
                withFilter
                withFlag
                withAlphaFilter
                onSelect={onSelectCountry}
                visible={showCountryPicker}
                onClose={() => setShowCountryPicker(false)}
              />
            </View>

            <View style={styles.bioContainer}>
              <Text style={[styles.bioLabel, { color: theme.text }]}>Bio</Text>
              <TextInput
                style={[
                  styles.bioInput,
                  {
                    color: theme.text,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    borderColor: theme.border,
                  },
                ]}
                value={formData.bio}
                onChangeText={(text) => updateField('bio', text)}
                multiline
                numberOfLines={4}
                placeholder="Tell us about yourself..."
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <Button
              text="Save Changes"
              onClick={handleUpdateProfile}
              disabled={isLoading}
              style={styles.saveButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    height: 130,
    width: 130,
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontFamily: font.bold(),
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    gap: 16,
  },
  nameRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  halfInputContainer: {
    flex: 1,
  },
  inputContainer: {
    width: '100%',
  },
  countryPickerContainer: {
    width: '100%',
    marginVertical: 8,
  },
  countryPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    position: 'relative',
  },
  countryIcon: {
    marginRight: 12,
  },
  countryLabel: {
    position: 'absolute',
    top: 8,
    left: 48,
    fontSize: 12,
    fontFamily: font.regular(),
  },
  countryValue: {
    fontSize: 16,
    fontFamily: font.medium(),
    marginTop: 12,
  },
  bioContainer: {
    width: '100%',
    marginTop: 10,
  },
  bioLabel: {
    fontSize: 16,
    fontFamily: font.medium(),
    marginBottom: 8,
    marginLeft: 4,
  },
  bioInput: {
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 100,
    padding: 12,
    textAlignVertical: 'top',
    fontFamily: font.regular(),
    fontSize: 16,
  },
  saveButton: {
    marginTop: 24,
  },
});
