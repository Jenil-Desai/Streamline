import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";
import { NavigationProps } from "../../types/navigation";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../common/context/AuthContext";
import { useTheme } from "../../common/context/ThemeContext";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import Input from "../../common/components/inputs/Input";
import { ArrowLeft, Key, Mail, User } from "lucide-react-native";
import { Header } from "../../common/components/headers";
import Button from "../../common/components/buttons/Button";
import { BASE_URL } from "../../common/constants/config";
import axios from "axios";
import { RegisterResponse } from "../../types/auth/register";

export default function RegisterScreen() {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  // Error states for input validation
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

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
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Validate first name
    if (!firstName.trim()) {
      setFirstNameError('First name is required');
      isValid = false;
    }

    // Validate last name
    if (!lastName.trim()) {
      setLastNameError('Last name is required');
      isValid = false;
    }

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
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  async function handleRegister() {
    if (validateForm()) {
      try {
        setIsLoading(true);

        const response = await axios.post<RegisterResponse>(`${BASE_URL}/auth/register`, {
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        });

        const responseData = response.data;
        if (responseData.success && responseData.token) {
          await login({ token: responseData.token });
          navigation.replace('Onboard');
        } else {
          Alert.alert('Error', responseData.error || 'Registration failed. Please try again.');
        }
      } catch (error) {
        Alert.alert('Error', 'Registration failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="Register"
        leftIcon={<ArrowLeft color={theme.text} size={20} />}
        onLeftPress={() => navigation.replace('Welcome')}
      />
      <View style={styles.contentContainer}>
        <View style={styles.inputContainer}>
          <View style={styles.nameContainer}>
            <View style={{ width: '48%' }}>
              <Input
                textContentType="name"
                label="First Name"
                value={firstName}
                onChangeText={(text) => {
                  setFirstName(text);
                  if (text.trim()) setFirstNameError('');
                }}
                variant="outlined"
                leftIcon={<User color={theme.text} size={20} />}
                error={firstNameError}
              />
            </View>
            <View style={{ width: '48%' }}>
              <Input
                textContentType="name"
                label="Last Name"
                value={lastName}
                onChangeText={(text) => {
                  setLastName(text);
                  if (text.trim()) setLastNameError('');
                }}
                variant="outlined"
                leftIcon={<User color={theme.text} size={20} />}
                error={lastNameError}
              />
            </View>
          </View>

          <Input
            textContentType="emailAddress"
            keyboardType="email-address"
            label="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (text.trim()) setEmailError('');
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
              if (text) setPasswordError('');
            }}
            variant="outlined"
            leftIcon={<Key color={theme.text} size={20} />}
            error={passwordError}
            helper="Password must be at least 8 characters long"
          />

          <Input
            textContentType="password"
            secureTextEntry={true}
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (text) setConfirmPasswordError('');
              if (text && password === text) setConfirmPasswordError('');
            }}
            variant="outlined"
            leftIcon={<Key color={theme.text} size={20} />}
            error={confirmPasswordError}
            helper="Please confirm your password"
          />
        </View>
        <View style={styles.btnContainer}>
          <Button
            text="Register"
            variant="primary"
            onClick={handleRegister}
            disabled={isLoading}
          />
          <Button
            text="Already have an account? Login"
            variant="ghost"
            onClick={() => navigation.navigate('Login')}
          />
        </View>
      </View>

    </SafeAreaView>
  )
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
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  btnContainer: {
    gap: 10,
  }
})
