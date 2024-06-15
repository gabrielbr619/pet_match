import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import DiscoverScreen from './DiscoverScreen';
import ChatsScreen from './ChatsScreen';
import MessageScreen from './MessageScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ChatStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChatsStack" component={ChatsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Message" component={MessageScreen} />
    </Stack.Navigator>
  );
}

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Discover') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Chats') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#ff5252',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false, tabBarShowLabel: false}} />
      <Tab.Screen name="Discover" component={DiscoverScreen} options={{ headerShown: false, tabBarShowLabel: false }} />
      <Tab.Screen name="Chats" component={ChatStack} options={{ headerShown: false, tabBarShowLabel: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false, tabBarShowLabel: false }} />
    </Tab.Navigator>
  );
}
