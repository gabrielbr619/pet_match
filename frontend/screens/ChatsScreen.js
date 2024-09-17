import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Text,
  ActivityIndicator,
} from "react-native";
import { ListItem, Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../common";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import "moment/locale/pt-br"; // Importa o locale em Português do Brasil
import { SafeAreaView } from "react-native-safe-area-context";
import Avatar from "../components/Avatar";

const ChatsScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({});
  const [userToken, setUserToken] = useState(null);
  const [isPetOwner, setIsPetOwner] = useState(null);

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      const userDataParsed = JSON.parse(userData);
      const token = await AsyncStorage.getItem("userToken");
      const isPetOwner = await AsyncStorage.getItem("isPetOwner");
      const isPetOwnerParsed = JSON.parse(isPetOwner);

      setIsPetOwner(isPetOwnerParsed);
      setUserToken(token);
      setUserData(userDataParsed);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (userData.id) {
        loadChatsFromCache(userData.id);
      }
    }, [userData])
  );

  const loadChatsFromCache = async (userId) => {
    try {
      const cachedChats = await AsyncStorage.getItem(`chats_${userId}`);
      if (cachedChats) {
        setChats(JSON.parse(cachedChats));
        setLoading(false);
      }
      fetchChats(userId);
    } catch (error) {
      console.error("Error loading chats from cache:", error);
      fetchChats(userId);
    }
  };

  const fetchChats = async (userId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}chats/${
          isPetOwner ? "getPetOwnerChats" : "getUserChats"
        }/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userToken,
          },
        }
      );

      const data = await response.json();
      if (Array.isArray(data)) {
        setChats(data); // Assuming the API returns an array of chats
        await AsyncStorage.setItem(`chats_${userId}`, JSON.stringify(data));
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching chats:", error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = moment(dateString);

    if (date.isSame(moment(), "day")) {
      return date.format("HH:mm");
    } else if (date.isSame(moment().subtract(1, "day"), "day")) {
      return "Ontem";
    } else {
      return date.format("ddd");
    }
  };

  const renderChatItem = ({ item }) => {
    return (
      <Pressable
        onPress={() => {
          navigation.navigate("Message", {
            chatId: item.chat_id,
            userData: item.user,
            userToken,
            pet_owner: isPetOwner ? userData : item.pet_owner,
            pet: item.pet,
            isPetOwner,
          });
        }}
      >
        {isPetOwner ? (
          <ListItem bottomDivider>
            <Avatar
              rounded
              source={
                item?.user?.profile_picture
                  ? { uri: item.user.profile_picture }
                  : null
              }
              icon={{ name: "user", type: "font-awesome", size: 40 }}
              containerStyle={styles.avatarContainer}
              avatarStyle={
                item?.pictures?.length === 0
                  ? { backgroundColor: "#BDBDBD" }
                  : null
              }
            />

            <ListItem.Content>
              <ListItem.Title>{item.user?.username}</ListItem.Title>
              <ListItem.Subtitle>
                {item.last_message?.content}
              </ListItem.Subtitle>
            </ListItem.Content>
            <Text>{formatDate(item.last_message?.created_at)}</Text>
          </ListItem>
        ) : (
          <ListItem bottomDivider>
            <Avatar
              rounded
              source={
                item?.pet?.pictures?.length > 0
                  ? { uri: item.pet.pictures[0] }
                  : null
              }
              icon={{ name: "paw", type: "font-awesome", size: 40 }}
              containerStyle={styles.avatarContainer}
              avatarStyle={
                item?.pictures?.length === 0
                  ? { backgroundColor: "#BDBDBD" }
                  : null
              }
            />

            <ListItem.Content>
              <ListItem.Title>{item.pet.name}</ListItem.Title>
              <ListItem.Subtitle>
                {item.last_message?.content}
              </ListItem.Subtitle>
            </ListItem.Content>
            <Text>{formatDate(item.last_message?.created_at)}</Text>
          </ListItem>
        )}
      </Pressable>
    );
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
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" type="material" size={30} />
        </Pressable>
        <Text style={styles.headerTitle}>Mensagens</Text>
        <Pressable>
          <Icon name="settings" type="material" size={30} color={"#fff"} />
        </Pressable>
      </View>
      {chats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum chat encontrado.</Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={(item) =>
            item.chat_id ? item.chat_id.toString() : Math.random().toString()
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fc9355",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarContainer: {
    height: 35,
    width: 35,
    borderRadius: 100,
    marginBottom: 5,
    marginTop: 5,
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
  },
});

export default ChatsScreen;
