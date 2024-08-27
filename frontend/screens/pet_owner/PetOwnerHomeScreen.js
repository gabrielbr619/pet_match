import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { Icon } from "react-native-elements";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { API_BASE_URL } from "../../common";
import { SafeAreaView } from "react-native-safe-area-context";
import Avatar from "../../components/Avatar";
import { ActivityIndicator } from "react-native-paper";

const PetOwnerHomeScreen = ({ userData, userToken }) => {
  const navigation = useNavigation();
  const [petList, setPetList] = useState(userData.pets || []);
  const [loading, setLoading] = useState(true);

  const fetchPetOwnerPets = async (userId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}petowners/allPetOwnerPets/${userId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const data = await response.json();
      setPetList(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pets:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData.id) {
      fetchPetOwnerPets(userData.id);
    }
  }, [userData]);

  // Usar useFocusEffect para atualizar a lista de pets sempre que a tela ganhar foco
  useFocusEffect(
    React.useCallback(() => {
      if (userData.id) {
        fetchPetOwnerPets(userData.id);
      }
    }, [userData.id])
  );

  const handleEditPet = (pet) => {
    console.log(pet);
    navigation.navigate("EditPet", { petData: pet, userToken });
  };

  const renderPet = ({ item }) => (
    <Pressable style={styles.petContainer} onPress={() => handleEditPet(item)}>
      <Avatar
        rounded
        size={250}
        containerStyle={styles.avatarContainer}
        avatarStyle={
          item?.pictures?.length === 0 ? { backgroundColor: "#BDBDBD" } : null
        }
        source={item?.pictures?.length > 0 ? { uri: item.pictures[0] } : null}
        icon={{ name: "paw", type: "font-awesome", size: 80 }}
      />

      <View style={{ display: "flex", flexDirection: "row" }}>
        <Text style={styles.petName} numberOfLines={2} ellipsizeMode="tail">
          {item.name}
        </Text>
        <Text style={styles.petName} numberOfLines={2} ellipsizeMode="tail">
          , {item.age}
        </Text>
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF914D" />
        <Text>Carregando seus Pets...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.navigate("Profile")}>
          <Icon
            name="user-circle"
            type="font-awesome"
            size={40}
            color={"#FFF"}
          />
        </Pressable>
        <Text style={styles.headerTitle}>Pets</Text>
        <Pressable>
          <Icon
            name="user-circle"
            type="font-awesome"
            size={40}
            color={"#fc9355"}
          />
        </Pressable>
      </View>
      <FlatList
        data={petList}
        renderItem={renderPet}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.flatListContent}
        ListFooterComponent={() => (
          <Pressable
            style={styles.addPetContainer}
            onPress={() => handleEditPet({})} // Navegar sem dados para adicionar um novo pet
          >
            <View style={styles.addPetIcon}>
              <Icon name="plus" type="font-awesome" size={40} color={"#FFF"} />
            </View>
            <Text style={styles.addPetLabel}>Adicionar Pet</Text>
          </Pressable>
        )}
      />
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
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: 20,
    backgroundColor: "#fc9355",
  },
  headerTitle: {
    fontSize: 24,
    color: "#FFF",
  },
  petContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginVertical: 10,
    flexBasis: "45%",
  },
  avatarContainer: {
    height: 150,
    width: 150,
    borderRadius: 100,
    marginBottom: 5,
    marginTop: 5,
  },
  petName: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  addPetContainer: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  addPetIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FF914D",
    justifyContent: "center",
    alignItems: "center",
  },
  addPetText: {
    color: "#fff",
    fontSize: 65,
  },
  addPetLabel: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
    fontWeight: "bold",
  },
  flatListContent: {
    justifyContent: "space-evenly",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PetOwnerHomeScreen;
