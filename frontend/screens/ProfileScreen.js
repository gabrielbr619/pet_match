import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Image,
  Alert,
} from "react-native";
import { Avatar, Icon } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import PhoneInput from "../components/PhoneInput";

const ProfileScreen = ({ navigation, userData, userToken }) => {
  const phoneInputRef = useRef(null);
  const [username, setUsername] = useState(userData.username);
  const [phone, setPhone] = useState(userData.phone || "");
  const [address, setAddress] = useState(userData.address || ""); // Endereço não está presente nos dados fornecidos, pode ser atualizado manualmente se necessário.
  const [profilePicture, setProfilePicture] = useState(
    userData.profile_picture || ""
  );

  const handleSaveChanges = () => {
    const isValid = phoneInputRef.current.isValidNumber();

    if (!isValid) {
      Alert.alert(
        "Número de telefone inválido",
        "Por favor, insira um número de telefone válido."
      );
      return;
    }

    // Continue com o processamento
    console.log("Número de telefone válido:", phone);
    fetch(`${API_BASE_URL}users/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        phone,
        address,
        profilePicture,
      }),
    });

    console.log("Alterações salvas", {
      username,
      phone,
      address,
      profilePicture,
    });
  };

  const handleLogoff = async () => {
    Alert.alert(
      "Deslogar",
      "Deseja sair da sua conta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair da Conta",
          onPress: logoff, // Chama a função para abrir a galeria de imagens
        },
      ],
      { cancelable: true }
    );
  };

  const logoff = async () => {
    await AsyncStorage.multiRemove(["userToken", "user"]);
    navigation.reset({
      index: 0,
      routes: [{ name: "Welcome" }],
    });
  };

  const handleProfilePicturePress = () => {
    Alert.alert(
      "Alterar Imagem",
      "Deseja trocar sua imagem de perfil?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Trocar de Imagem",
          onPress: pickImage, // Chama a função para abrir a galeria de imagens
        },
      ],
      { cancelable: true }
    );
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.profilePictureContainer}
        onPress={handleProfilePicturePress}
      >
        <Avatar
          size={"xlarge"}
          source={profilePicture ? { uri: profilePicture } : null}
          style={styles.profilePicture}
          rounded
        >
          <Avatar.Accessory
            iconProps={"edit"}
            color="white"
            size={23}
            style={{ backgroundColor: "#FF914D" }}
            containerStyle={{
              borderRadius: 50,
              backgroundColor: "#FF914D",
            }}
          />
        </Avatar>
      </Pressable>
      <Text style={styles.username}>{username}</Text>

      <Text style={styles.label}>Telefone</Text>
      <PhoneInput phone={phone} setPhone={setPhone} />
      <Text style={styles.label}>Endereço</Text>
      <TextInput
        value={address}
        onChangeText={setAddress}
        style={styles.input}
        placeholder="Av. Puta que pariu - 42"
      />

      <Pressable style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Salvar alterações</Text>
      </Pressable>
      <Pressable style={styles.logoutButton} onPress={handleLogoff}>
        <Text style={styles.logoutButtonText}>Deslogar</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  profilePictureContainer: {
    alignSelf: "center",
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E8E8E8",
  },
  username: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: "#000",
    marginTop: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#FF914D",
    marginBottom: 15,
    fontSize: 16,
    paddingVertical: 5,
    color: "#999",
  },
  saveButton: {
    backgroundColor: "#FF914D",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#FFF",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    borderColor: "#FF914D",
    borderWidth: 1,
    marginTop: 10,
  },
  logoutButtonText: {
    color: "#FF914D",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
