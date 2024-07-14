import AuthScreen from "@/components/AuthScreen";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { View, StyleSheet } from "react-native";

/**
 * Renders the home screen of the application.
 *
 * @returns The rendered home screen component.
 */
export default function HomeScreen() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <View style={styles.container}>
          <AuthScreen></AuthScreen>
        </View>
      </ThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
