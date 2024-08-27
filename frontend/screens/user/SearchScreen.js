import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { Button, CheckBox, Icon, Input, Slider } from "react-native-elements";

import { API_BASE_URL } from "../../common";

const SearchScreen = ({ navigation, userData, userToken }) => {
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [petSize, setPetSize] = useState(50);
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    console.log({
      selectedPet,
      selectedGender,
      petSize,
      location,
    });
    // Navegar para a tela de resultados
    navigation.navigate("Results", {
      selectedPet,
      selectedGender,
      petSize,
      location,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bem vindo {userData.username},</Text>
      <Text style={styles.title}>
        Vamos te ajudar a encontrar o pet perfeito para você :)
      </Text>

      <Text style={styles.subtitle}>Qual pet você quer adotar?</Text>
      <View style={styles.checkboxContainer}>
        <CheckBox
          title="Gato"
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          checked={selectedPet === "Cat"}
          onPress={() => setSelectedPet("Cat")}
          containerStyle={styles.checkbox}
        />
        <CheckBox
          title="Cachorro"
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          checked={selectedPet === "Dog"}
          onPress={() => setSelectedPet("Dog")}
          containerStyle={styles.checkbox}
        />
      </View>

      <Text style={styles.subtitle}>Escolha o gênero do pet</Text>
      <View style={styles.checkboxContainer}>
        <CheckBox
          title="Masculino"
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          checked={selectedGender === "Male"}
          onPress={() => setSelectedGender("Male")}
          containerStyle={styles.checkbox}
        />
        <CheckBox
          title="Feminino"
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          checked={selectedGender === "Female"}
          onPress={() => setSelectedGender("Female")}
          containerStyle={styles.checkbox}
        />
      </View>

      <Text style={styles.subtitle}>Qual tamanho de pet?</Text>
      <Slider
        value={petSize}
        onValueChange={(value) => setPetSize(value)}
        minimumValue={35}
        maximumValue={60}
        step={1}
        thumbTintColor="#fc9355"
        minimumTrackTintColor="#fc9355"
        maximumTrackTintColor="#fc9355"
        style={styles.slider}
      />
      <Text style={styles.sizeText}>{`Tamanho: ${Math.round(
        petSize
      )} cm`}</Text>

      <Text style={styles.subtitle}>
        Compartilhe sua localização para encontrar pets próximos
      </Text>
      <Input
        placeholder="R. Joaquim Nabuco, 2829 - Dionísio"
        leftIcon={{
          type: "font-awesome",
          name: "map-marker",
          color: "#fc9355",
        }}
        value={location}
        onChangeText={setLocation}
        containerStyle={styles.input}
      />

      <Button
        title="Achar meu pet"
        buttonStyle={styles.button}
        onPress={handleSearch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  welcome: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  checkbox: {
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  slider: {
    marginVertical: 10,
  },
  sizeText: {
    textAlign: "center",
    marginVertical: 10,
    color: "#666",
  },
  input: {
    marginTop: 10,
  },
  button: {
    backgroundColor: "#fc9355",
    borderRadius: 25,
    paddingVertical: 10,
    marginTop: 20,
  },
});

export default SearchScreen;
