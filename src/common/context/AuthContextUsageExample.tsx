import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from './AuthContext';

const AuthContextUsageExample = () => {
  // Access auth context
  const { isAuthenticated, login, logout, getUserId, getToken } = useAuth();

  // State for login form
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  // Handle login form submission
  const handleLogin = async () => {
    try {
      // In a real app, you would call your API here
      // This is a mock implementation for demonstration
      const mockApiResponse = {
        token: 'sample_jwt_token_would_be_here',
        userId: 'user_123456',
      };

      // Use the login function from auth context
      await login(mockApiResponse);
      Alert.alert('Success', 'You are now logged in!');
    } catch (error) {
      Alert.alert('Error', 'Login failed');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('Success', 'You have been logged out');
    } catch (error) {
      Alert.alert('Error', 'Logout failed');
    }
  };

  // Display user info
  const displayUserInfo = () => {
    const userId = getUserId();
    const token = getToken();

    Alert.alert(
      'User Information',
      `User ID: ${userId || 'Not available'}\nToken: ${token ? 'Available' : 'Not available'}`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Auth Example</Text>

      {isAuthenticated ? (
        // User is authenticated - show logout option
        <View>
          <Text style={styles.statusText}>You are logged in! 🎉</Text>

          <TouchableOpacity style={styles.button} onPress={displayUserInfo}>
            <Text style={styles.buttonText}>Show User Info</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // User is not authenticated - show login form
        <View>
          <Text style={styles.statusText}>Please log in</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={credentials.email}
            onChangeText={(text) => setCredentials({ ...credentials, email: text })}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={credentials.password}
            onChangeText={(text) => setCredentials({ ...credentials, password: text })}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  statusText: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  button: {
    height: 50,
    backgroundColor: '#3498db',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AuthContextUsageExample;
