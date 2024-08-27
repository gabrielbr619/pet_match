import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./user/UserHomeScreen";
import PetOwnerHomeScreen from "./pet_owner/PetOwnerHomeScreen"; // Tela principal do dono de pet
import EditPetScreen from "./pet_owner/EditPetScreen"; // Tela de edição/adição de pets
import ProfileScreen from "./ProfileScreen";
import SearchScreen from "./user/SearchScreen";
import ChatsScreen from "./ChatsScreen";
import MessageScreen from "./MessageScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack para o chat
const ChatStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatStack"
        component={ChatsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Message"
        component={MessageScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Stack para o dono de pet
const PetOwnerStack = ({ userData, userToken }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PetOwnerHome" options={{ headerShown: false }}>
        {(props) => (
          <PetOwnerHomeScreen
            {...props}
            userData={userData}
            userToken={userToken}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="EditPet"
        component={EditPetScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default function Tabs() {
  const [userData, setUserData] = useState({});
  const [userToken, setUserToken] = useState(null);
  const [isPetOwner, setIsPetOwner] = useState(null);

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

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Chats") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#fc9355",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          display: "flex",
        },
      })}
    >
      {isPetOwner ? (
        <>
          <Tab.Screen
            name="Home"
            options={{ headerShown: false, tabBarShowLabel: false }}
          >
            {(props) => (
              <PetOwnerStack
                {...props}
                userData={userData}
                userToken={userToken}
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="Chats"
            options={{ headerShown: false, tabBarShowLabel: false }}
          >
            {(props) => (
              <ChatStack {...props} userData={userData} userToken={userToken} />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="Profile"
            options={{ headerShown: false, tabBarShowLabel: false }}
          >
            {(props) => (
              <ProfileScreen
                {...props}
                userData={userData}
                userToken={userToken}
              />
            )}
          </Tab.Screen>
        </>
      ) : (
        <>
          <Tab.Screen
            name="Home"
            options={{ headerShown: false, tabBarShowLabel: false }}
          >
            {(props) => (
              <HomeScreen
                {...props}
                userData={userData}
                userToken={userToken}
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="Search"
            options={{ headerShown: false, tabBarShowLabel: false }}
          >
            {(props) => (
              <SearchScreen
                {...props}
                userData={userData}
                userToken={userToken}
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="Chats"
            options={{ headerShown: false, tabBarShowLabel: false }}
          >
            {(props) => (
              <ChatStack {...props} userData={userData} userToken={userToken} />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="Profile"
            options={{ headerShown: false, tabBarShowLabel: false }}
          >
            {(props) => (
              <ProfileScreen
                {...props}
                userData={userData}
                userToken={userToken}
              />
            )}
          </Tab.Screen>
        </>
      )}
    </Tab.Navigator>
  );
}
