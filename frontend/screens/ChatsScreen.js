import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Text,
  ActivityIndicator,
} from "react-native";
import { ListItem, Avatar, Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../common";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import "moment/locale/pt-br"; // Importa o locale em Português do Brasil
import { SafeAreaView } from "react-native-safe-area-context";

const ChatsScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({});
  const [userToken, setUserToken] = useState(null);
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
      setUserToken(token);
      setUserData(userDataParsed);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (userData.id) {
        fetchChats(userData.id);
      }
    }, [userData])
  );

  const fetchChats = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}chats/GetUserChats/${userId}`,
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

  const renderChatItem = ({ item }) => (
    <Pressable
      onPress={() =>
        navigation.navigate("Message", {
          chatId: item.chat_id,
          userData,
          userToken,
          pet_owner: item.pet_owner,
          pet: item.pet,
        })
      }
    >
      <ListItem bottomDivider>
        <Avatar
          rounded
          source={{ uri: item.pet.pictures[0] }}
          icon={{ name: "paw", type: "font-awesome" }}
        />
        <ListItem.Content>
          <ListItem.Title>{item.pet.name}</ListItem.Title>
          <ListItem.Subtitle>{item.last_message?.content}</ListItem.Subtitle>
        </ListItem.Content>
        <Text>{formatDate(item.last_message?.created_at)}</Text>
      </ListItem>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fc9355" />
        <Text>Carregando...</Text>
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
          <Icon name="settings" type="material" size={30} />
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
  emptyText: {
    fontSize: 18,
    color: "#888",
  },
});

export default ChatsScreen;
