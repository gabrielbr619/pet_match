import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Pressable, Image, Alert } from "react-native";
import { TextInput, Button, Checkbox } from "react-native-paper";
import { SocialIcon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as WebBrowser from "expo-web-browser";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "../common";
import { MaterialCommunityIcons } from "@expo/vector-icons";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const navigation = useNavigation();

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "YOUR_EXPO_GOOGLE_CLIENT_ID",
    iosClientId: "YOUR_IOS_GOOGLE_CLIENT_ID",
    androidClientId: "YOUR_ANDROID_GOOGLE_CLIENT_ID",
    webClientId: "YOUR_WEB_GOOGLE_CLIENT_ID",
  });

  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: "YOUR_FACEBOOK_APP_ID",
  });

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}users/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          remember,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the data using AsyncStorage
        await AsyncStorage.setItem("userToken", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        await AsyncStorage.setItem("isPetOwner", "false");
        // Navigate to the main app screen
        navigation.navigate("Tabs", {
          screen: "Home",
          params: { isPetOwner: false },
        });
      } else {
        const response = await fetch(`${API_BASE_URL}petowners/login`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            remember,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          // Store the data using AsyncStorage
          await AsyncStorage.setItem("userToken", data.token);
          await AsyncStorage.setItem("user", JSON.stringify(data.owner));
          await AsyncStorage.setItem("isPetOwner", "true");
          // Navigate to the main app screen
          navigation.navigate("Tabs", {
            screen: "PetOwnerHomeScreen",
          });
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Login Error", "An error occurred. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    promptAsync();
  };

  const handleFacebookLogin = () => {
    fbPromptAsync();
  };

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      console.log("Google Authentication Success:", authentication);
      // Você pode usar a authentication.accessToken para chamar a API do Google e obter dados do usuário.
    }
  }, [response]);

  useEffect(() => {
    if (fbResponse?.type === "success") {
      const { authentication } = fbResponse;
      console.log("Facebook Authentication Success:", authentication);
      // Você pode usar a authentication.accessToken para chamar a API do Facebook e obter dados do usuário.
    }
  }, [fbResponse]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/pngs/woman_playing_with_dog.png")}
        style={styles.logo}
        contentFit="contain"
      />
      <Text style={styles.title}>Acessar o App</Text>
      <Text style={styles.subtitle}>
        Por favor insira seus dados para entrar no app
      </Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
        inputMode="email"
        autoCapitalize="none"
        left={
          <TextInput.Icon
            icon={({ size, color }) => (
              <MaterialCommunityIcons
                name="email"
                size={size}
                color="#FF914D"
              />
            )}
          />
        }
      />

      <TextInput
        label="Senha"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={styles.input}
        left={
          <TextInput.Icon
            icon={() => (
              <MaterialCommunityIcons name="lock" size={24} color="#FF914D" />
            )}
          />
        }
      />
      <Pressable
        style={styles.forgotContainer}
        onPress={() => console.log("Forgot Password Pressed")}
      >
        <Text style={styles.forgotText}>Esqueceu a senha?</Text>
      </Pressable>
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Logar
      </Button>
      <Pressable onPress={() => navigation.navigate("Register")}>
        <Text style={styles.signUpText}>
          Ainda não tem conta?{" "}
          <Text style={styles.signUpLink}>Cadastre-se!</Text>
        </Text>
      </Pressable>
      {/* <View style={styles.socialContainer}>
        <SocialIcon
          button
          type="google"
          onPress={handleGoogleLogin}
          style={styles.socialButton}
        />
        <SocialIcon
          button
          type="facebook"
          onPress={handleFacebookLogin}
          style={styles.socialButton}
        />
        <SocialIcon
          button
          type="instagram"
          onPress={() => console.log('Instagram Login Pressed')}
          style={styles.socialButton}
        />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  logo: {
    height: 170,
    width: 220,
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  forgotContainer: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  forgotText: {
    fontSize: 14,
    color: "#FF914D",
  },
  button: {
    marginVertical: 20,
    backgroundColor: "#FF914D",
  },
  signUpText: {
    textAlign: "center",
    color: "#888",
  },
  signUpLink: {
    color: "#FF914D",
    fontWeight: "bold",
  },
});

export default LoginScreen;
