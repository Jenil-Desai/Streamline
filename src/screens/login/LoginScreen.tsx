import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, Alert } from 'react-native';
import { NavigationProps } from '../../types/navigation';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../common/context/AuthContext';
import { useTheme } from '../../common/context/ThemeContext';
import { useEffect, useState } from 'react';
import { ChevronLeft, Key, Mail } from 'lucide-react-native';
import Button from '../../common/components/buttons/Button';
import { BASE_URL } from '../../common/constants/config';
import axios from 'axios';
import { Input } from '../../common/components/input';
import { Header } from '../../common/components/header';

interface LoginResponse {
  success: boolean;
  token?: string;
  error?: string;
}

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigation = useNavigation<NavigationProps>();
  const { isAuthenticated, login, isUserOnboarded } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    if (isAuthenticated && isUserOnboarded()) {
      navigation.replace('Onboard');
    } else if (isAuthenticated) {
      navigation.replace('Home');
    }
  });

  // Validate form fields
  const validateForm = () => {
    let isValid = true;

    // Reset all errors first
    setEmailError('');
    setPasswordError('');

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }

    return isValid;
  };

  async function handleLogin() {
    if (validateForm()) {
      try {
        setIsLoading(true);

        const response = await axios.post<LoginResponse>(`${BASE_URL}/auth/login`, {
          email,
          password,
        });

        const responseData = response.data;
        if (responseData.success && responseData.token) {
          await login({ token: responseData.token });
          if (isUserOnboarded()) {
            navigation.replace('Home');
          } else {
            navigation.replace('Onboard');
          }
        } else {
          Alert.alert('Error', responseData.error || 'Login failed. Please try again.');
        }
      } catch (error) {
        Alert.alert('Error', 'Invalid email or password. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="Login"
        leftIcon={<ChevronLeft color={theme.text} size={20} />}
        onLeftPress={() => navigation.replace('Welcome')}
      />
      <View style={styles.contentContainer}>
        <View style={styles.inputContainer}>
          <Input
            textContentType="emailAddress"
            keyboardType="email-address"
            label="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (text.trim()) { setEmailError(''); }
            }}
            variant="outlined"
            leftIcon={<Mail color={theme.text} size={20} />}
            error={emailError}
          />

          <Input
            textContentType="password"
            secureTextEntry={true}
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (text) { setPasswordError(''); }
            }}
            variant="outlined"
            leftIcon={<Key color={theme.text} size={20} />}
            error={passwordError}
          />
        </View>
        <View style={styles.btnContainer}>
          <Button
            text="Login"
            variant="primary"
            onClick={handleLogin}
            disabled={isLoading}
          />
          <Button
            text="Don't have an account? Register"
            variant="ghost"
            onClick={() => navigation.navigate('Register')}
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
  contentContainer: {
    flex: 1,
    padding: 20,
    gap: 30,
  },
  inputContainer: {
    gap: 15,
  },
  btnContainer: {
    gap: 10,
  },
});
