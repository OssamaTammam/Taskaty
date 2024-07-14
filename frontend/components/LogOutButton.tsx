import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useAuth } from "@/context/AuthContext"; // Adjust import path as necessary
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const LogOutButton = () => {
  const { setJwt } = useAuth(); // Access setJwt from context

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("jwt"); // Remove JWT from AsyncStorage
      setJwt(null); // Clear JWT from context
      alert("Logged out successfully");
      // Optionally navigate to login screen or home
      router.push("");
    } catch (error) {
      console.error("Failed to log out:", error);
      alert("An error occurred while logging out.");
    }
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={styles.button}>
      <Text style={styles.buttonText}>Log Out</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 10,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default LogOutButton;
