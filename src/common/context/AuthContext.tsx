import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

// Define the JWT payload structure
type TokenPayload = {
  id: string;
  onboarded: boolean;
  exp?: number;
  iat?: number;
};

type AuthState = {
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  onboarded: boolean;
  decodedToken: TokenPayload | null;
};

// Define the auth context structure
type AuthContextType = {
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  onboarded: boolean;
  decodedToken: TokenPayload | null;
  login: (userData: { token: string }) => Promise<void>;
  logout: () => Promise<void>;
  getUserId: () => string | null;
  getToken: () => string | null;
  isUserOnboarded: () => boolean;
};

// Storage keys for auth data
const AUTH_STORAGE_KEYS = {
  TOKEN: '@auth_token',
  DECODED_TOKEN: '@auth_decoded_token',
};

// Create the context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
type AuthProviderProps = {
  children: ReactNode;
};

// Function to decode JWT token
const decodeToken = (token: string): TokenPayload | null => {
  try {
    return jwtDecode<TokenPayload>(token);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize auth state
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    isLoading: true,
    isAuthenticated: false,
    onboarded: false,
    decodedToken: null,
  });

  // Load auth data from AsyncStorage on component mount
  useEffect(() => {
    const loadStoredAuthData = async () => {
      try {
        const [token, storedDecodedToken] = await Promise.all([
          AsyncStorage.getItem(AUTH_STORAGE_KEYS.TOKEN),
          AsyncStorage.getItem(AUTH_STORAGE_KEYS.DECODED_TOKEN),
        ]);

        let decodedToken: TokenPayload | null = null;
        let onboarded = false;

        if (token) {
          // Try to decode from the token first
          decodedToken = decodeToken(token);

          // If that fails, try to use the stored decoded token
          if (!decodedToken && storedDecodedToken) {
            try {
              decodedToken = JSON.parse(storedDecodedToken);
            } catch (e) {
              console.error('Failed to parse stored decoded token:', e);
            }
          }

          // Set onboarded status from decoded token
          onboarded = decodedToken?.onboarded ?? false;
        }

        setAuthState({
          token,
          isLoading: false,
          isAuthenticated: !!token && !!decodedToken?.id,
          onboarded,
          decodedToken,
        });
      } catch (error) {
        console.error('Failed to load auth data:', error);
        setAuthState({
          token: null,
          isLoading: false,
          isAuthenticated: false,
          onboarded: false,
          decodedToken: null,
        });
      }
    };

    loadStoredAuthData();
  }, []);

  // Login function - store auth data and update state
  const login = async (userData: { token: string; }): Promise<void> => {
    try {
      // Decode token to get user information
      const decodedToken = decodeToken(userData.token);

      // Prepare storage operations
      const storageOperations = [
        AsyncStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, userData.token),
      ];

      // Add decoded token to storage if available
      if (decodedToken) {
        storageOperations.push(
          AsyncStorage.setItem(AUTH_STORAGE_KEYS.DECODED_TOKEN, JSON.stringify(decodedToken))
        );
      }

      // Store auth data
      await Promise.all(storageOperations);

      setAuthState({
        token: userData.token,
        isLoading: false,
        isAuthenticated: !!userData.token && !!decodedToken?.id,
        onboarded: decodedToken?.onboarded ?? false,
        decodedToken,
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Failed to save authentication data');
    }
  };

  // Logout function - remove auth data and update state
  const logout = async (): Promise<void> => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN),
        AsyncStorage.removeItem(AUTH_STORAGE_KEYS.DECODED_TOKEN),
      ]);

      setAuthState({
        token: null,
        isLoading: false,
        isAuthenticated: false,
        onboarded: false,
        decodedToken: null,
      });
    } catch (error) {
      console.error('Logout failed:', error);
      throw new Error('Failed to clear authentication data');
    }
  };

  // Get user ID function
  const getUserId = (): string | null => {
    return authState.decodedToken?.id ?? null;
  };

  // Get token function
  const getToken = (): string | null => {
    return authState.token;
  };

  // Check if user is onboarded
  const isUserOnboarded = (): boolean => {
    return authState.onboarded;
  };

  // Context value
  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    getUserId,
    getToken,
    isUserOnboarded,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
