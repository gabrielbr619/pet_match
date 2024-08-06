import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { ListItem, Avatar, Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../App';

const ChatsScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({});
  const [userToken, setUserToken] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (userData.id) {
      fetchChats(userData.id);
    }
  }, [userData]);

  const getUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const userDataParsed = JSON.parse(userData);
      const token = await AsyncStorage.getItem('userToken');
      setUserToken(token);
      setUserData(userDataParsed);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchChats = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}chats/GetUserChats/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userToken
        },
      });

      const data = await response.json();
      if (Array.isArray(data)) {
        setChats(data); // Assuming the API returns an array of chats
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setLoading(false);
    }
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Message', { chatId: item.chat_id, userData, userToken, pet_owner: item.pet_owner, pet: item.pet })}>
      <ListItem bottomDivider>
        <Avatar rounded source={{ uri: item.pet.pictures[0] }} />
        <ListItem.Content>
          <ListItem.Title>{item.pet.name}</ListItem.Title>
          <ListItem.Subtitle>{item.last_message?.content}</ListItem.Subtitle>
        </ListItem.Content>
        {/* <Text>{item.created_at}</Text> */}
      </ListItem>
    </TouchableOpacity>
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" type="material" size={30} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mensagens</Text>
        <TouchableOpacity>
          <Icon name="settings" type="material" size={30} />
        </TouchableOpacity>
      </View>
      {chats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum chat encontrado.</Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.chat_id ? item.chat_id.toString() : Math.random().toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fc9355'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
});

export default ChatsScreen;
