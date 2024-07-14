import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import React from "react";
import LogOutButton from "../components/LogOutButton";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.light.main,
          },
          headerTintColor: Colors.light.tint,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 25,
          },
          headerTitleAlign: "center", // This centers the title
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Taskaty",
            headerLeft: () => null, // Removes the back button
            gestureEnabled: false, // Disables back gesture
            headerBackVisible: false, // Hides the back button
          }}
        />
        <Stack.Screen
          name="TodoList"
          options={{
            title: "Taskaty",
            headerLeft: () => <LogOutButton></LogOutButton>, // Removes the back button
            gestureEnabled: false, // Disables back gesture
            headerBackVisible: false, // Hides the back button
            headerRight: () => null,
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
