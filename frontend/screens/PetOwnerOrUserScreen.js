import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { RadioButton } from "react-native-paper";
import { Button } from "react-native-paper";
import { API_BASE_URL } from "../common";

const PetOwnerOrUserScreen = ({ route, navigation }) => {
  const { username, password, email } = route.params; // Recebe os props

  const [userRole, setUserRole] = useState("users");

  const handleRegister = () => {
    fetch(`${API_BASE_URL}${userRole}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          // Exibe o erro recebido do servidor
          Alert.alert("Erro ao cadastrar", data.error);
        } else {
          // Exibe uma mensagem de sucesso e redireciona o usuário
          Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
          // Navegar para outra tela ou limpar os campos de input
        }
      })
      .catch((error) => {
        // Exibe um alerta em caso de erro na requisição
        Alert.alert(
          "Erro",
          "Ocorreu um erro ao realizar o cadastro. Tente novamente."
        );
        console.error(error);
      });

    navigation.navigate("Login");
  };

  // Faz a requisição de registro ao backend

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/svgs/shelter.svg")}
        style={styles.image}
      />
      <Text style={styles.title}>Qual seu objetivo?</Text>
      <Text style={styles.subtitle}>
        Para que possamos melhor adequar sua experiência
      </Text>

      <View style={styles.optionContainer}>
        <TouchableOpacity
          onPress={() => setUserRole("users")}
          style={styles.radioContainer}
        >
          <RadioButton
            value="users"
            status={userRole === "users" ? "checked" : "unchecked"}
            onPress={() => setUserRole("users")}
            color="#FF914D"
          />
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>Quero Adotar!</Text>
            <Text style={styles.optionSubtitle}>
              Estou interessado em encontrar um pet com todas as fofuras que
              preciso!
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setUserRole("petowners")}
          style={styles.radioContainer}
        >
          <RadioButton
            value="donate"
            status={userRole === "petowners" ? "checked" : "unchecked"}
            onPress={() => setUserRole("petowners")}
            color="#FF914D"
          />
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>Quero Doar!</Text>
            <Text style={styles.optionSubtitle}>
              Estou interessado em encontrar um novo dono para cuidar do meu
              pet!
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <Button
        mode="contained"
        onPress={handleRegister}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Criar Conta
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#9A9A9A",
    marginBottom: 30,
  },
  optionContainer: {
    marginBottom: 30,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  textContainer: {
    flexWrap: "wrap",
    flexShrink: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  optionSubtitle: {
    fontSize: 14,
    color: "#9A9A9A",
  },
  button: {
    backgroundColor: "#FF914D",
    borderRadius: 8,
    paddingVertical: 10,
  },
  buttonLabel: {
    fontSize: 18,
  },
});

export default PetOwnerOrUserScreen;
