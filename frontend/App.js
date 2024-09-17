import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RegisterScreen from "./screens/RegisterScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";
import Tabs from "./screens/Tabs";
import { View, Text } from "react-native";
import PetOwnerOrUserScreen from "./screens/PetOwnerOrUserScreen";
import { API_BASE_URL } from "./common";
import { ActivityIndicator } from "react-native-paper";

const Stack = createStackNavigator();

const App = () => {
  const [userToken, setUserToken] = useState(null);
  const [isTokenValid, setIsTokenValid] = useState(null);
  const [isPetOwner, setIsPetOwner] = useState(null);

  useEffect(() => {
    const checkTokenValidity = async (token) => {
      try {
        console.log("Verificando validade do token...");
        const response = await fetch(`${API_BASE_URL}auth/check-token`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          console.log("Token válido.");
          setIsTokenValid(true);
        } else {
          console.log("Token inválido ou expirado.");
          setIsTokenValid(false);
          await AsyncStorage.removeItem("userToken");
        }
      } catch (error) {
        console.error("Falha ao verificar a validade do token:", error);
        setIsTokenValid(false);
      }
    };

    const getUserToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const userData = await AsyncStorage.getItem("user");
        console.log("Token obtido do AsyncStorage:", token);
        console.log("userData:", userData);

        if (userData) {
          const userDataParsed = JSON.parse(userData);
          if (userDataParsed.hasOwnProperty("pets")) {
            setIsPetOwner(true);
          }
        }

        if (token) {
          setUserToken(token);
          await checkTokenValidity(token);
        } else {
          console.log("Nenhum token encontrado.");
          setIsTokenValid(false);
        }
      } catch (error) {
        console.error("Erro ao buscar os dados do usuário:", error);
        setIsTokenValid(false);
      }
    };

    getUserToken();
  }, []);

  useEffect(() => {
    console.log("Estado isTokenValid atualizado:", isTokenValid);
    console.log("Estado isPetOwner atualizado:", isPetOwner);
  }, [isTokenValid, isPetOwner]);

  if (isTokenValid === null) {
    // Mostra um indicador de carregamento enquanto verifica o token
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#fc9355" />
        <Text style={{ fontSize: 20 }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isTokenValid ? "Tabs" : "Welcome"}>
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
        <Stack.Screen name="Tabs" options={{ headerShown: false }}>
          {(props) => <Tabs {...props} isPetOwner={isPetOwner} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
