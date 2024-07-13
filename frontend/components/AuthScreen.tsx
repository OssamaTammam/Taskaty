import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import LoginScreen from "@/components/LoginScreen";
import SignUpScreen from "@/components/SignUpScreen"; // Import your SignUpScreen

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleScreen = () => {
    setIsLogin((prev) => !prev); // Toggle between login and signup
  };

  return (
    <>
      {isLogin ? (
        <LoginScreen onSignUpPress={toggleScreen} />
      ) : (
        <SignUpScreen onLoginPress={toggleScreen} />
      )}
    </>
  );
};

export default AuthScreen;
