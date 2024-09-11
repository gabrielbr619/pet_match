import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Pressable, Alert } from "react-native";
import { ActivityIndicator, RadioButton } from "react-native-paper";
import { Button } from "react-native-paper";
import { API_BASE_URL } from "../common";

const PetOwnerOrUserScreen = ({ route, navigation }) => {
  const { username, password, email } = route.params; // Recebe os props

  const [userRole, setUserRole] = useState("users");

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}${userRole}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar");
      }

      // Armazenar os dados do usuário
      await AsyncStorage.setItem("userToken", data.token);
      await AsyncStorage.setItem(
        "user",
        JSON.stringify(data.user || data.owner)
      );
      await AsyncStorage.setItem(
        "isPetOwner",
        (userRole === "petowners").toString()
      );

      // Navegar para a tela apropriada
      const targetScreen = userRole === "users" ? "Home" : "PetOwnerHomeScreen";
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "Tabs",
            params: {
              screen: targetScreen,
              params: { isPetOwner: userRole === "petowners" },
            },
          },
        ],
      });

      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
    } catch (error) {
      navigation.goBack();
      Alert.alert(
        "Erro",
        error.message ||
          "Ocorreu um erro ao realizar o cadastro. Tente novamente."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fc9355" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/pngs/shelter.png")}
        style={styles.image}
      />
      <Text style={styles.title}>Qual seu objetivo?</Text>
      <Text style={styles.subtitle}>
        Para que possamos melhor adequar sua experiência
      </Text>

      <View style={styles.optionContainer}>
        <Pressable
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
        </Pressable>

        <Pressable
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
        </Pressable>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  image: {
    width: "100%",
    height: 200,
    contentFit: "contain",
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
