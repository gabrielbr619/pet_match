import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  Modal,
  ScrollView,
} from "react-native";
import { Icon } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { dogsBreeds, catBreeds } from "../../assets/jsons/petBreeds";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../../common";

const EditPetScreen = ({ route, navigation }) => {
  const { petData = {}, userToken } = route.params || {};

  const [petName, setPetName] = useState(petData?.name || "");
  const [bio, setBio] = useState(petData?.description || "");
  const [age, setAge] = useState(petData?.age ? petData.age.toString() : "");
  const [species, setSpecies] = useState(petData?.species || "dog");
  const [breed, setBreed] = useState(petData?.breed || "");
  const [pictures, setPictures] = useState(petData?.pictures || []);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Função para selecionar imagem
  const pickImage = async (replace = false) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (replace) {
        let newPictures = [...pictures];
        newPictures[selectedImageIndex] = result.assets[0].uri;
        setPictures(newPictures);
      } else {
        setPictures([...pictures, result.assets[0].uri]);
      }
    }
    setModalVisible(false);
  };

  // Função para salvar as alterações
  const handleSave = async () => {
    try {
      const formData = new FormData();

      // Adicionar os campos básicos
      if (petData.id) formData.append("id", petData.id);
      formData.append("name", petName);
      formData.append("age", age);
      formData.append("description", bio);
      formData.append("species", species);
      formData.append("breed", breed);

      // Adicionar as imagens
      pictures.forEach((imageUri, index) => {
        formData.append("pictures", {
          uri: imageUri,
          name: `photo_${index + 1}.jpg`,
          type: "image/jpeg",
        });
      });

      // Fazer a requisição para o backend
      const response = await fetch(`${API_BASE_URL}pets/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userToken}`, // Assumindo que você tem o token de autenticação
        },
        body: formData,
      });

      if (response.ok) {
        const updatedPet = await response.json();
        console.log("Pet atualizado com sucesso:", updatedPet);
        navigation.goBack(); // Navegar de volta ou realizar outra ação após salvar
      } else {
        const errorData = await response.json();
        console.error("Erro ao atualizar pet:", errorData.error);
      }
    } catch (error) {
      console.error("Erro ao salvar pet:", error.message);
    }
  };

  // Função para abrir o modal ao pressionar uma imagem
  const handleImagePress = (index) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  // Função para remover uma imagem
  const handleImageRemove = () => {
    setPictures(pictures.filter((_, i) => i !== selectedImageIndex));
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.carouselContainer}>
          <FlatList
            data={
              pictures.length < 5
                ? [...pictures, { isAddButton: true }]
                : pictures
            }
            renderItem={({ item, index }) =>
              item.isAddButton ? (
                <Pressable
                  style={styles.imageContainer}
                  onPress={() => pickImage(false)}
                >
                  <Icon name="plus" type="font-awesome" size={36} />
                </Pressable>
              ) : (
                <Pressable
                  style={styles.imageContainer}
                  onPress={() => handleImagePress(index)}
                >
                  <Image source={{ uri: item }} style={styles.image} />
                </Pressable>
              )
            }
            keyExtractor={(_, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />

          {/* Modal para opções de imagem */}
          <Modal visible={modalVisible} transparent={true}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Pressable onPress={handleImageRemove}>
                  <Text style={styles.modalOption}>Remover Imagem</Text>
                </Pressable>
                <Pressable onPress={() => pickImage(true)}>
                  <Text style={styles.modalOption}>Trocar Imagem</Text>
                </Pressable>
                <Pressable onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalOption}>Cancelar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>

        {/* Nome do Pet */}
        <View style={styles.nameContainer}>
          <Text style={styles.petName}>{petName}</Text>
          <Icon
            name="pencil"
            type="font-awesome"
            size={20}
            onPress={() => setPetName(petName ? "" : "Nome editável")}
          />
        </View>

        {/* Bio */}
        <View>
          <View style={styles.bioHeader}>
            <Text>Bio</Text>
            <Text style={styles.characterCount}>{bio.length}/500</Text>
          </View>
          <TextInput
            style={styles.input}
            value={bio}
            onChangeText={setBio}
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            multiline
            maxLength={500}
          />
        </View>

        {/* Idade */}
        <View style={styles.inputContainer}>
          <Text>Idade</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={(text) => setAge(text.replace(/[^0-9]/g, ""))}
            placeholder="Idade"
            keyboardType="numeric"
          />
        </View>

        {/* Espécie */}
        <View style={styles.inputContainer}>
          <Text>Espécie</Text>
          <View style={styles.radioGroup}>
            <Pressable
              style={[
                styles.radioButton,
                species === "dog" && styles.radioButtonSelected,
              ]}
              onPress={() => setSpecies("dog")}
            >
              <Icon
                color={species === "dog" ? "#FF914D" : "#000"}
                name="dog"
                type="font-awesome-5"
              />
              <Text style={styles.radioText}>Cachorro</Text>
            </Pressable>
            <Pressable
              style={[
                styles.radioButton,
                species === "cat" && styles.radioButtonSelected,
              ]}
              onPress={() => setSpecies("cat")}
            >
              <Icon
                color={species === "cat" ? "#FF914D" : "#000"}
                name="cat"
                type="font-awesome-5"
              />
              <Text style={styles.radioText}>Gato</Text>
            </Pressable>
          </View>
        </View>

        {/* Raça */}
        <View style={styles.inputContainer}>
          <Text>Raça</Text>
          <Picker
            selectedValue={breed}
            onValueChange={(itemValue) => setBreed(itemValue)}
            style={styles.picker}
          >
            {species === "dog"
              ? dogsBreeds.map((breed) => (
                  <Picker.Item
                    key={breed.value}
                    label={breed.label}
                    value={breed.value}
                  />
                ))
              : catBreeds.map((breed) => (
                  <Picker.Item
                    key={breed.value}
                    label={breed.label}
                    value={breed.value}
                  />
                ))}
          </Picker>
        </View>

        {/* Botões de Ação */}
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </Pressable>
        <Pressable
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  carouselContainer: {
    marginBottom: 15,
    alignItems: "center",
  },
  imageContainer: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    marginRight: 10,
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 200,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalOption: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: "center",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  petName: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 10,
  },
  bioHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  characterCount: {
    color: "#808080",
  },
  inputContainer: {
    marginTop: 15,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#FF914D",
    color: "#333",
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  radioButtonSelected: {
    borderColor: "#FF914D",
  },
  radioText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#000",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#FF914D",
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    borderColor: "#FF914D",
    borderWidth: 1,
  },
  cancelButtonText: {
    color: "#FF914D",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditPetScreen;