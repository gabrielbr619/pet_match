import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Icon } from "react-native-elements";
import { API_BASE_URL } from "../../common";
import { SafeAreaView } from "react-native-safe-area-context";
import Avatar from "../../components/Avatar";
import Toast from "react-native-toast-message";

const HomeScreen = ({ navigation, userData, userToken }) => {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData || !userToken) {
      Alert.alert("Erro", "Dados do usuário não disponíveis.");
      return;
    }
    if (userData.id) {
      fetchPet(userData.id);
    }
  }, [userData, userToken]);

  const fetchPet = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}pets/randomPet/${userId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar pet");
      }

      setPet(data);
      setLoading(false);
      console.log(data);
    } catch (error) {
      console.error(error);
      setLoading(false);
      Alert.alert("Erro", error.message || "Não foi possível carregar um pet.");
    }
  };

  const handleLike = async () => {
    try {
      await fetch(`${API_BASE_URL}users/likePet`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          user_data: userData,
          pet_id: pet.id,
          pet_owner_id: pet.owner_id,
        }),
      });
      navigation.navigate("Chats");
      fetchPet(userData.id); // Fetch a new pet after liking
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível descurtir o pet. Tente novamente.",
        visibilityTime: 2000,
        position: "bottom",
      });
    }
  };

  const handleDislike = async () => {
    try {
      await fetch(`${API_BASE_URL}users/deslikePet`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ userData, petId: pet.id }),
      });
      Toast.show({
        type: "info",
        text1: "Pet descurtido",
        text2: "Você não verá mais este pet.",
        visibilityTime: 2000,
        position: "bottom",
      });
      fetchPet(userData.id); // Fetch a new pet after disliking
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível descurtir o pet. Tente novamente.",
        visibilityTime: 2000,
        position: "bottom",
      });
    }
  };

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
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fc9355" />
          <Text>Procurando Pets...</Text>
        </View>
      ) : (
        <View style={styles.card}>
          {!pet ? (
            <View style={styles.container}>
              <Text style={{ fontSize: 18 }}>
                Não há mais pets na sua região :(
              </Text>
            </View>
          ) : (
            <>
              <Pressable
                style={{ flex: 1, width: "100%" }}
                onPress={() => navigation.navigate("PetDetail", { pet })}
              >
                <Avatar
                  rounded
                  size={250}
                  containerStyle={styles.image}
                  source={
                    pet?.pictures?.length > 0 ? { uri: pet.pictures[0] } : null
                  }
                  icon={{ name: "paw", type: "font-awesome", size: 60 }}
                />
              </Pressable>

              <View style={styles.cardInfo}>
                <Pressable
                  style={{
                    flex: 1,
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => navigation.navigate("PetDetail", { pet })}
                >
                  <Text
                    style={styles.petName}
                  >{`${pet.name}, ${pet.age}`}</Text>
                  <Text style={styles.petLocation}>Santos, SP</Text>
                  <Text style={styles.petDescription}>
                    {pet?.description?.length > 100
                      ? `${pet.description.substring(0, 100)}...`
                      : pet.description}
                  </Text>
                </Pressable>
                <View style={styles.actions}>
                  <Pressable
                    onPress={handleDislike}
                    style={styles.actionButton}
                  >
                    <View style={styles.circle}>
                      <Icon
                        name="times"
                        type="font-awesome"
                        size={35}
                        color="#FFFFFF"
                      />
                    </View>
                  </Pressable>
                  <Pressable onPress={handleLike} style={styles.actionButton}>
                    <View style={styles.circle}>
                      <Icon
                        name="heart"
                        type="font-awesome"
                        size={30}
                        color="#FFFFFF"
                      />
                    </View>
                  </Pressable>
                </View>
              </View>
            </>
          )}
        </View>
      )}
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
    justifyContent: "center",
    alignItems: "center",
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
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardInfo: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  petName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  petLocation: {
    fontSize: 18,
    color: "#888",
    marginBottom: 15,
  },
  petDescription: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  actionButton: {
    padding: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  circle: {
    width: 55,
    height: 55,
    backgroundColor: "#fc9355",
    borderRadius: 27.5, // Half of width/height for a circle
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
