import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RegisterScreen from "./screens/RegisterScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";
import Tabs from "./screens/Tabs";
import { View, Text, Platform } from "react-native";
import PetOwnerOrUserScreen from "./screens/PetOwnerOrUserScreen";
import { API_BASE_URL } from "./common";

const Stack = createStackNavigator();

const App = () => {
  const [userToken, setUserToken] = useState(null);
  const [isTokenValid, setIsTokenValid] = useState(null); // Mudança para null para diferenciar entre carregando e verificado

  useEffect(() => {
    const checkTokenValidity = async (token) => {
      try {
        const response = await fetch(`${API_BASE_URL}auth/check-token`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
          await AsyncStorage.removeItem("userToken"); // Remover token inválido
        }
      } catch (error) {
        console.error("Failed to check token validity:", error);
        setIsTokenValid(false);
      }
    };

    const getUserToken = async () => {
      const token = await AsyncStorage.getItem("userToken");
      setUserToken(token);
      if (token) {
        checkTokenValidity(token);
      } else {
        setIsTokenValid(false); // Se não há token, setar como inválido
      }
    };

    getUserToken();
  }, []);

  if (isTokenValid === null) {
    // Mostra um indicador de carregamento enquanto verifica o token
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Loading"
            component={LoadingScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isTokenValid ? "Tabs" : "Welcome"}>
        {isTokenValid ? (
          <>
            <Stack.Screen
              name="Tabs"
              component={Tabs}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PetOwnerOrUserScreen"
              component={PetOwnerOrUserScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Tabs"
              component={Tabs}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const LoadingScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Carregando...</Text>
    </View>
  );
};

export default App;
