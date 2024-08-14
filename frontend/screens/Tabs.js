import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./HomeScreen";
import ProfileScreen from "./ProfileScreen";
import ChatsScreen from "./ChatsScreen";
import MessageScreen from "./MessageScreen";
import SearchScreen from "./SearchScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function Tabs({ isPetOwner }) {
  const [userData, setUserData] = useState({});
  const [userToken, setUserToken] = useState(null);

  const ChatStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="ChatsStack" options={{ headerShown: false }}>
          {(props) => (
            <ChatsScreen {...props} userData={userData} userToken={userToken} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Message" options={{ headerShown: false }}>
          {(props) => (
            <MessageScreen
              {...props}
              userData={userData}
              userToken={userToken}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    );
  };

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

  if (isPetOwner) {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Search") {
              iconName = focused ? "search" : "search-outline";
            } else if (route.name === "Chats") {
              iconName = focused ? "chatbubbles" : "chatbubbles-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: "#fc9355",
          inactiveTintColor: "gray",
        }}
      >
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
      </Tab.Navigator>
    );
  }
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Chats") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "#fc9355",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name="Home"
        options={{ headerShown: false, tabBarShowLabel: false }}
      >
        {(props) => (
          <HomeScreen {...props} userData={userData} userToken={userToken} />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Search"
        options={{ headerShown: false, tabBarShowLabel: false }}
      >
        {(props) => (
          <SearchScreen {...props} userData={userData} userToken={userToken} />
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
          <ProfileScreen {...props} userData={userData} userToken={userToken} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
