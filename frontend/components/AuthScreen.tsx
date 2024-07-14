import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import LoginScreen from "@/components/LoginScreen";
import SignUpScreen from "@/components/SignUpScreen";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/constants/Api";
import { router } from "expo-router";

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { jwt, setJwt } = useAuth();

  const toggleScreen = () => {
    setIsLogin((prev) => !prev);
  };

  useEffect(() => {
    const checkLogin = async () => {
      if (jwt) {
        try {
          const response = await fetch(`${API_URL}/isLoggedIn`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: `jwt=${jwt}`,
            },
          });

          if (response.ok) {
            setIsLoggedIn(true);
          } else {
            Alert.alert(
              "Error",
              "Session expired or invalid. Please log in again.",
            );
            setJwt(null);
          }
        } catch (error) {
          console.error(error);
          Alert.alert("Error", "An error occurred. Please try again.");
        }
      }
    };

    checkLogin();
  }, [jwt]);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("TodoList");
    }
  }, [isLoggedIn]);

  return (
    <>
      {isLogin ? (
        <LoginScreen
          onSignUpPress={toggleScreen}
          setIsLoggedIn={setIsLoggedIn}
        />
      ) : (
        <SignUpScreen onLoginPress={toggleScreen} />
      )}
    </>
  );
};

export default AuthScreen;
