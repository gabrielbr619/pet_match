import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "../../common";
import { SafeAreaView } from "react-native-safe-area-context";
import Avatar from "../../components/Avatar";

const PetOwnerHomeScreen = ({ userData, userToken }) => {
  const navigation = useNavigation();
  const [petList, setPetList] = useState(userData.pets || []);

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
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  useEffect(() => {
    if (userData.id) {
      fetchPetOwnerPets(userData.id);
    }
  }, [userData]);

  const renderPet = ({ item }) => (
    <View style={styles.petContainer}>
      <Avatar
        rounded
        size={250}
        containerStyle={styles.avatarContainer}
        avatarStyle={
          item.pictures.length === 0 ? { backgroundColor: "#BDBDBD" } : null
        }
        source={item.pictures.length > 0 ? { uri: item.pictures[0] } : null}
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
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Icon
            name="user-circle"
            type="font-awesome"
            size={40}
            color={"#FFF"}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pets</Text>
        <TouchableOpacity>
          <Icon
            name="user-circle"
            type="font-awesome"
            size={40}
            color={"#fc9355"}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={petList}
        renderItem={renderPet}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.flatListContent}
        ListFooterComponent={() => (
          <TouchableOpacity
            style={styles.addPetContainer}
            onPress={() => navigation.navigate("AddPetScreen")}
          >
            <View style={styles.addPetIcon}>
              <Icon name="plus" type="font-awesome" size={40} color={"#FFF"} />
            </View>
            <Text style={styles.addPetLabel}>Adicionar Pet</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
});

export default PetOwnerHomeScreen;
