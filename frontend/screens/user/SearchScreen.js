import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Alert,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import { Button, CheckBox } from "react-native-elements";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Constants from "expo-constants";
import { Picker } from "@react-native-picker/picker";
import { dogsBreeds, catBreeds } from "../../assets/jsons/petBreeds";
import { API_BASE_URL } from "../../common";
import { GOOGLE_MAPS_API_KEY } from "@env";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ActivityIndicator } from "react-native-paper";

const SearchScreen = ({ navigation, userData, userToken }) => {
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedSpecie, setSelectedSpecie] = useState(null);
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [petSize, setPetSize] = useState(50);
  const [location, setLocation] = useState("");
  const [userCoordinates, setUserCoordinates] = useState(null);

  const [loading, setLoading] = useState(false);

  const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  const googlePlacesRef = useRef();

  useEffect(() => {
    console.log(userCoordinates);
  }, [userCoordinates]);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão Negada",
          "Permita o acesso à localização para achar pets próximos."
        );
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      setUserCoordinates({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      const reverseGeocode = await Location.reverseGeocodeAsync(coords);
      if (reverseGeocode.length > 0) {
        const { street, city } = reverseGeocode[0];
        setLocation(`${street}, ${city}`);
      }
    } catch (error) {
      console.error("Erro ao obter localização: ", error);
      Alert.alert("Erro", "Não foi possível obter a localização.");
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const handleSearch = async () => {
    if (!userCoordinates) {
      Alert.alert("Erro", "Selecione um endereço válido.");
      return;
    }
    const requestBody = {
      selectedSpecie,
      selectedGender,
      selectedBreed,
      location,
      currentLocation: userCoordinates,
      userId: userData.id,
    };

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}pets/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`, // Passando o token de usuário para autenticação
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        setLoading(false);
        throw new Error("Erro ao buscar pets. Tente novamente mais tarde.");
      }

      const petsData = await response.json();

      console.log("Pets encontrados:", petsData);

      // Navegar para a tela de resultados com os dados dos pets
      setLoading(false);
      navigation.navigate("Results", {
        petsData,
      });
    } catch (error) {
      setLoading(false);
      console.error(error);
      Alert.alert("Erro", "Não foi possível buscar pets no momento.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fc9355" />
        <Text style={{ fontSize: 20 }}>Carregando...</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.contentContainer}>
            <Text style={styles.welcome}>Bem vindo {userData.username},</Text>
            <Text style={styles.title}>
              Vamos te ajudar a encontrar o pet perfeito para você :)
            </Text>

            <Text style={styles.subtitle}>Qual pet você quer adotar?</Text>
            <View style={styles.checkboxContainer}>
              <CheckBox
                title="Gato"
                checkedIcon="dot-circle-o"
                checkedColor="#fc9355"
                uncheckedIcon="circle-o"
                checked={selectedSpecie === "cat"}
                onPress={() => setSelectedSpecie("cat")}
                containerStyle={styles.checkbox}
              />
              <CheckBox
                title="Cachorro"
                checkedIcon="dot-circle-o"
                checkedColor="#fc9355"
                uncheckedIcon="circle-o"
                checked={selectedSpecie === "dog"}
                onPress={() => setSelectedSpecie("dog")}
                containerStyle={styles.checkbox}
              />
            </View>
            <Text style={styles.subtitle}>Procura alguma raça?</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: "#fc9355",
                borderRadius: 10,
                backgroundColor: "white",
                marginTop: 10,
                marginBottom: 15,
              }}
            >
              <Picker
                selectedValue={selectedBreed}
                selectionColor={"#fc9355"}
                dropdownIconColor={"#fc9355"}
                dropdownIconRippleColor={"#fc9355"}
                onValueChange={(itemValue) => setSelectedBreed(itemValue)}
                itemStyle={{ borderBottomWidth: 1, borderColor: "#FF914D" }}
              >
                <Picker.Item label="Não me importo" value={null} />
                {selectedSpecie === "dog"
                  ? dogsBreeds
                      .sort((a, b) => a.label.localeCompare(b.label))
                      .map((breed) => (
                        <Picker.Item
                          key={breed.value}
                          label={breed.label}
                          value={breed.value}
                        />
                      ))
                  : catBreeds
                      .sort((a, b) => a.label.localeCompare(b.label))
                      .map((breed) => (
                        <Picker.Item
                          key={breed.value}
                          label={breed.label}
                          value={breed.value}
                        />
                      ))}
              </Picker>
            </View>
            <Text style={styles.subtitle}>Escolha o gênero do pet</Text>
            <View style={styles.checkboxContainer}>
              <CheckBox
                title="Masculino"
                checkedIcon="dot-circle-o"
                checkedColor="#fc9355"
                uncheckedIcon="circle-o"
                checked={selectedGender === "Male"}
                onPress={() => setSelectedGender("Male")}
                containerStyle={styles.checkbox}
              />
              <CheckBox
                title="Feminino"
                checkedIcon="dot-circle-o"
                checkedColor="#fc9355"
                uncheckedIcon="circle-o"
                checked={selectedGender === "Female"}
                onPress={() => setSelectedGender("Female")}
                containerStyle={styles.checkbox}
              />
            </View>

            <Text
              style={{ fontSize: 14, fontWeight: "bold", marginVertical: 10 }}
            >
              Compartilhe sua localização para encontrar pets próximos
            </Text>
            <GooglePlacesAutocomplete
              ref={googlePlacesRef}
              placeholder="Digite seu endereço"
              onPress={(data, details = null) => {
                setLocation(data.description);
                setUserCoordinates({
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                });
                Keyboard.dismiss();
              }}
              query={{
                key: GOOGLE_MAPS_API_KEY,
                language: "pt-BR",
                components: "country:br",
              }}
              styles={{
                container: styles.autocompleteContainer,
                textInput: styles.autocompleteInput,
                listView: styles.autocompleteListView,
              }}
              enablePoweredByContainer={false}
              fetchDetails={true}
              nearbyPlacesAPI="GooglePlacesSearch"
              textInputProps={{
                clearButtonMode: "while-editing",
              }}
            />
            <View style={styles.buttonContainer}>
              <Button
                title="Achar meu pet"
                buttonStyle={styles.button}
                onPress={handleSearch}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </SafeAreaView>
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
    backgroundColor: "#f5f5f5",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    paddingTop: Constants.statusBarHeight,
  },
  welcome: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  checkbox: {
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  autocompleteContainer: {},
  autocompleteInput: {
    fontSize: 16,
    backgroundColor: "white",
    borderColor: "#fc9355",
    borderWidth: 1,
    borderRadius: 10,
  },
  autocompleteListView: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
    marginTop: 5,
  },
  buttonContainer: {
    padding: 20,
  },
  button: {
    backgroundColor: "#fc9355",
    borderRadius: 25,
    paddingVertical: 10,
  },
});

export default SearchScreen;
