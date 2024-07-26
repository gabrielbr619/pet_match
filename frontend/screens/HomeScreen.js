import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../App";

const HomeScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({});
  const [userToken, setUserToken] = useState(null);
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      const userDataParsed = JSON.parse(userData);

      const token = await AsyncStorage.getItem("userToken");

      setUserToken(token);
      setUserData(userDataParsed);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (userData.id) {
      fetchPet(userData.id);
    }
  }, [userData]);

  const fetchPet = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}pets/randomPet/${userId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });
      const data = await response.json();
      setPet(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await fetch('API_BASE_URLusers/likePet', {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ userData, petId: pet.id }),
      });
      await fetch('API_BASE_URLchats/', {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ userId: userData.id, petId: pet.id, petOwnerId: pet.owner_id }),
      });
      fetchPet(userData.id); // Fetch a new pet after liking
    } catch (error) {
      console.error(error);
    }
  };

  const handleDislike = async () => {
    try {
      // await fetch('API_BASE_URLusers/deslikePet', {
      //   method: 'PUT',
      //   headers: {
      //     Accept: 'application/json',
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${userToken}`,
      //   },
      //   body: JSON.stringify({ userData, petId: pet.id }),
      // });
      fetchPet(userData.id); // Fetch a new pet after disliking
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fc9355" />
        <Text>Procurando Pets...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Icon name="user-circle" type="font-awesome" size={40} color={"#FFF"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pets</Text>
        <TouchableOpacity>
          <Icon name="user-circle" type="font-awesome" size={40} color={"#fc9355"} />
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        {!pet ? (
          <View style={styles.container}>
            <Text>No pet found</Text>
          </View>
        ) : (
          <>
            <Image
              source={{ uri: pet?.pictures?.length > 0 ? pet.pictures[0] : "" }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.cardInfo}>
              <Text style={styles.petName}>{`${pet.name}, ${pet.age}`}</Text>
              <Text style={styles.petLocation}>Santos, SP</Text>
              <Text style={styles.petDescription}>{pet.description}</Text>
              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={handleDislike}
                  style={styles.actionButton}
                >
                  <div style={styles.circle}>
                    <Icon
                      name="times"
                      type="font-awesome"
                      size={35}
                      color="#FFFFFF"
                    />
                  </div>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleLike}
                  style={styles.actionButton}
                >
                  <div style={styles.circle}>
                    <Icon
                      name="heart"
                      type="font-awesome"
                      size={30}
                      color="#FFFFFF"
                    />
                  </div>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </View>
      {/* <View style={styles.footer}>
        <Icon name="home" type="font-awesome" size={30} onPress={() => navigation.navigate('Home')} />
        <Icon name="search" type="font-awesome" size={30} onPress={() => navigation.navigate('Discover')} />
        <Icon name="comments" type="font-awesome" size={30} onPress={() => navigation.navigate('Chats')} />
        <Icon name="user" type="font-awesome" size={30} onPress={() => navigation.navigate('Profile')} />
      </View> */}
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
    color:"#FFF"
  },
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    boxShadow: "0px 2px 4px rgba(0,0,0,0.08)",
    width: "90%",
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
    margin: "-20",
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
    width:"100%"
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
    width: "55px",
    height: "55px",
    backgroundColor: "#fc9355",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
