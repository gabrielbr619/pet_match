import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Pressable, Text, Alert } from "react-native";
import {
  GiftedChat,
  InputToolbar,
  Send,
  Actions,
  Bubble,
  Day,
} from "react-native-gifted-chat";
import { Icon } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import io from "socket.io-client";
import { API_BASE_URL } from "../common";
import { SafeAreaView } from "react-native-safe-area-context";
import Avatar from "../components/Avatar";
import GiftedChatComponent from "../components/GiftedChatComponent";

const MessageScreen = ({ route, navigation }) => {
  const { chatId, userData, userToken, pet_owner, pet, isPetOwner } =
    route.params;

  useEffect(() => {
    console.log(userData);
  }, [userData]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" type="material" size={30} />
        </Pressable>
        <View style={styles.headerTitle}>
          <Avatar
            rounded
            source={
              isPetOwner
                ? userData.profile_picture
                  ? { uri: userData.profile_picture }
                  : null
                : pet.pictures?.length > 0
                ? { uri: pet.pictures[0] }
                : null
            }
            icon={{
              name: isPetOwner ? "user" : "paw",
              type: "font-awesome",
              size: 40,
            }}
            containerStyle={styles.avatarContainer}
            avatarStyle={
              isPetOwner
                ? userData.profile_picture
                  ? { backgroundColor: "#BDBDBD" }
                  : null
                : pet.pictures?.length === 0
                ? { backgroundColor: "#BDBDBD" }
                : null
            }
          />
          <Text style={styles.headerText}>
            {isPetOwner ? userData?.username : pet_owner?.username}
          </Text>
        </View>
        <Pressable>
          <Icon name="settings" type="material" size={30} />
        </Pressable>
      </View>
      <GiftedChatComponent
        chatId={chatId}
        userData={userData}
        userToken={userToken}
        pet_owner={pet_owner}
        pet={pet}
        isPetOwner={isPetOwner}
      />
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
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    marginLeft: 10,
    fontSize: 18,
  },
  avatarContainer: {
    height: 35,
    width: 35,
    borderRadius: 100,
    marginBottom: 5,
    marginTop: 5,
  },
});

export default MessageScreen;
