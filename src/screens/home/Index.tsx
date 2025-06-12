import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../common/context/AuthContext";
import { useTheme } from "../../common/context/ThemeContext";

export default function IndexScreen() {
  const { isAuthenticated, isUserOnboarded, decodedToken } = useAuth();
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Welcome To Home Screen</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          You have successfully navigated to the Home tab!
        </Text>

        <View style={styles.infoCard}>
          <Text style={[styles.infoText, { color: theme.text }]}>
            Authentication Status: {isAuthenticated ? "Logged In" : "Not Logged In"}
          </Text>
          <Text style={[styles.infoText, { color: theme.text }]}>
            Onboarding Status: {isUserOnboarded() ? "Completed" : "Not Completed"}
          </Text>
          {decodedToken && (
            <Text style={[styles.infoText, { color: theme.text }]}>
              User ID: {decodedToken.id}
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  infoCard: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
  },
});
