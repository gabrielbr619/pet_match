import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import * as Font from "expo-font";

const loadFonts = () => {
  return Font.loadAsync({
    "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
  });
};

export default function WelcomeScreen({ navigation }) {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return null; // Return null or a loading spinner if fonts are not loaded yet
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Encontre seu parceiro</Text>
      <Text style={styles.subtitle}>
        Descubra pets adoráveis buscando adoção.
      </Text>
      <Image
        source={require("../assets/svgs/girl_playing_with_dog.svg")}
        style={styles.image}
        contentFit="contain"
      />
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.buttonText}>Quero começar!</Text>
      </Pressable>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontFamily: "Montserrat-Bold",
    fontSize: 28,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    textAlign: "center",
    color: "#888",
    marginBottom: 20,
  },
  image: {
    width: "80%",
    height: 200,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#fc9355",
    width: 300,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 20,
  },
  buttonText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
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
