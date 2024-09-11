import React, { useState } from "react";
import { View, StyleSheet, Text, Image, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import * as WebBrowser from "expo-web-browser";
import { MaterialCommunityIcons } from "@expo/vector-icons";

WebBrowser.maybeCompleteAuthSession();

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleRegister = () => {
    if (username === "" || password === "" || email === "") {
      return Alert.alert(
        "Erro ao cadastrar",
        "Verifique se todas informações foram inseridas corretamente."
      );
    }

    navigation.navigate("PetOwnerOrUserScreen", {
      username,
      password,
      email,
    });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/pngs/adopting_dog.png")}
        style={styles.logo}
        contentFit="contain"
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
        left={
          <TextInput.Icon
            icon={() => (
              <MaterialCommunityIcons
                name="account-circle"
                size={24}
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
      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
        inputMode="email"
        autoCapitalize="none"
        left={
          <TextInput.Icon
            icon={() => (
              <MaterialCommunityIcons size={24} name="email" color="#FF914D" />
            )}
          />
        }
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
