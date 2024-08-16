import React, { useState } from "react";
import { View, StyleSheet, Text, Image, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { SocialIcon } from "react-native-elements";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as WebBrowser from "expo-web-browser";
import { API_BASE_URL } from "../common";

WebBrowser.maybeCompleteAuthSession();

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   expoClientId: "YOUR_EXPO_GOOGLE_CLIENT_ID",
  //   iosClientId: "YOUR_IOS_GOOGLE_CLIENT_ID",
  //   androidClientId: "YOUR_ANDROID_GOOGLE_CLIENT_ID",
  //   webClientId: "YOUR_WEB_GOOGLE_CLIENT_ID",
  // });

  // const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
  //   clientId: "YOUR_FACEBOOK_APP_ID",
  // });

  const handleRegister = () => {
    // Verifica se algum dos campos está vazio
    // if (username === "" || password === "" || email === "") {
    //   return Alert.alert(
    //     "Erro ao cadastrar",
    //     "Verifique se todas informações foram inseridas corretamente."
    //   );
    // }

    navigation.navigate("PetOwnerOrUserScreen", {
      username,
      password,
      email,
    });
  };

  // const handleGoogleLogin = () => {
  //   promptAsync();
  // };

  // const handleFacebookLogin = () => {
  //   fbPromptAsync();
  // };

  // React.useEffect(() => {
  //   if (response?.type === "success") {
  //     const { authentication } = response;
  //     console.log("Google Authentication Success:", authentication);
  //   }
  // }, [response]);

  // React.useEffect(() => {
  //   if (fbResponse?.type === "success") {
  //     const { authentication } = fbResponse;
  //     console.log("Facebook Authentication Success:", authentication);
  //   }
  // }, [fbResponse]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/svgs/adopting_dog.svg")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Bem vindo!</Text>
      <Text style={styles.subtitle}>
        Venha encontrar seu próximo melhor amigo.
      </Text>

      <TextInput
        label="Nome de Usuário"
        value={username}
        onChangeText={(text) => setUsername(text)}
        style={styles.input}
        mode="flat"
        left={<TextInput.Icon icon="account-circle" color="#FF914D" />}
      />
      <TextInput
        label="Senha"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={styles.input}
        left={<TextInput.Icon icon="lock" color="#FF914D" />}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        left={<TextInput.Icon icon="email" color="#FF914D" />}
      />

      <Button
        mode="contained"
        onPress={handleRegister}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        Criar
      </Button>
      <Text style={styles.footerText}>
        Já tem conta?{" "}
        <Text
          style={styles.signInText}
          onPress={() => navigation.navigate("Login")}
        >
          Acesse!
        </Text>
      </Text>
      {/* <Text style={styles.orText}>Ou acesse com</Text>

      <View style={styles.socialContainer}>
        <SocialIcon
          title="Google"
          button
          type="google"
          onPress={handleGoogleLogin}
          style={styles.socialButtonGoogle}
        />
        <SocialIcon
          title="Facebook"
          button
          type="facebook"
          onPress={handleFacebookLogin}
          style={styles.socialButtonFacebook}
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
    height: 180,
    width: 180,
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
  button: {
    marginVertical: 20,
    backgroundColor: "#FF914D",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  orText: {
    textAlign: "center",
    marginVertical: 10,
    color: "#000",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  socialButtonGoogle: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: "#de5246",
    borderRadius: 20,
  },
  socialButtonFacebook: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: "#4267B2",
    borderRadius: 20,
  },
  footerText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  signInText: {
    color: "#fc9355",
  },
});

export default RegisterScreen;
