import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import DefaultButton from "./DefaultButton";
import { API_URL } from "@/constants/Api";
import { useAuth } from "@/context/AuthContext";

const SignUpScreen = ({ onLoginPress }: { onLoginPress: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const { jwt, setJwt } = useAuth(); // Get setJwt from AuthContext

  const handleSubmit = async () => {
    // Basic validation
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Get the Set-Cookie header
        const cookies = response.headers.get("Set-Cookie");

        // Find the jwt cookie
        if (cookies) {
          const jwtCookie = cookies
            .split(";")
            .find((cookie) => cookie.trim().startsWith("jwt="));

          if (jwtCookie) {
            // Extract the JWT value
            const jwtValue = jwtCookie.split("=")[1].split(";")[0]; // Get the value of jwt cookie

            // Store the jwt cookie in the context
            setJwt(jwtValue);

            console.log(jwt);
          }
        }

        console.log(data);
      } else {
        Alert.alert("Error", "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text>Username</Text>
        <TextInput
          style={styles.textInput}
          placeholder="example"
          value={username}
          onChangeText={setUsername}
        />
        <Text>Email</Text>
        <TextInput
          style={styles.textInput}
          placeholder="example@email.com"
          value={email}
          onChangeText={setEmail}
        />
        <Text>Password</Text>
        <TextInput
          style={styles.textInput}
          placeholder="password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.buttonContainer}>
        <DefaultButton title="Sign Up" onPress={handleSubmit} />
        <DefaultButton
          title="Log in"
          onPress={onLoginPress}
          backgroundColor="#f2f2f2"
          textColor="#548CA8"
          borderColor="#548CA8"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    width: "80%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  textInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff", // White background for text input
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
});

export default SignUpScreen;
