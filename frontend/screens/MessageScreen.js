import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { GiftedChat, InputToolbar, Send, Actions } from 'react-native-gifted-chat';
import { Icon, Avatar } from 'react-native-elements';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import { API_BASE_URL } from '../App';

const SOCKET_SERVER_URL = 'http://localhost:3000'; // Replace with your server URL

const MessageScreen = ({ route, navigation }) => {
  const { chatId, userData, userToken, pet_owner, pet } = route.params;
  const [messages, setMessages] = useState([]);
  const [images, setImages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      newSocket.emit('join', { chatId });
    });

    newSocket.on('receiveMessage', (message) => {
      console.log('Received message from socket:', message);
      setMessages((previousMessages) => GiftedChat.append(previousMessages, formatMessage(message)));
    });

    return () => {
      console.log('Disconnecting from socket server');
      newSocket.disconnect();
    };
  }, [chatId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}messages/${chatId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
          },
        });
        const data = await response.json();
        console.log('Fetched messages:', data);
        const formattedMessages = data.map(formatMessage);
        setMessages(formattedMessages); // Assuming the API returns an array of messages
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };
    fetchMessages();
  }, [userToken]);

  const formatMessage = (message) => ({
    _id: message.id,
    text: message.content,
    createdAt: new Date(message.created_at),
    user: {
      _id: message.sender_id,
      name: userData.name || 'User',
      avatar: userData.avatar || null, // Ensure you have a userData with avatar property
    },
    image: message.image_urls.length > 0 ? message.image_urls[0] : null,
  });

  const onSend = useCallback(async (messages = []) => {
    const message = messages[0];
    const formData = new FormData();
    formData.append('chatId', chatId);
    formData.append('senderId', userData.id);
    formData.append('content', message.text);
    images.forEach((image, index) => {
      formData.append('images', {
        uri: image.uri,
        type: image.type,
        name: `image${index}.jpg`,
      });
    });

    try {
      const response = await fetch(`${API_BASE_URL}messages/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log(data)
      if (response.ok) {
        console.log('Message sent successfully:', data);
        const formattedMessage = formatMessage(data);
        setMessages((previousMessages) => GiftedChat.append(previousMessages, formattedMessage));
        setImages([]); // Clear images after sending
        console.log('entrou aqui')
        // Emit the message to the socket server
        socket.emit('sendMessage', formattedMessage);
      } else {
        Alert.alert('Error', data || 'An error occurred');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  }, [images, socket, chatId, userData.id, userToken]);

  const pickImage = async () => {
    ImagePicker.launchImageLibrary(
      { mediaType: 'photo', selectionLimit: 10 },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.error('ImagePicker Error: ', response.errorMessage);
        } else {
          const selectedImages = response.assets.map(asset => ({
            uri: asset.uri,
            type: asset.type,
            name: asset.fileName,
          }));
          setImages(selectedImages);
        }
      }
    );
  };

  const renderSend = (props) => (
    <Send {...props}>
      <View style={styles.sendingContainer}>
        <Icon name="send" type="material" color="#FF5252" />
      </View>
    </Send>
  );

  const renderInputToolbar = (props) => (
    <InputToolbar {...props} containerStyle={styles.inputToolbar} />
  );

  const renderActions = (props) => (
    <Actions
      {...props}
      icon={() => <Icon name="camera" type="material" color="#FF5252" />}
      onPressActionButton={pickImage}
    />
  );

   return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" type="material" size={30} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Avatar rounded source={{ uri: pet.pictures[0] }} />
          <Text style={styles.headerText}>{pet_owner.username}</Text>
        </View>
        <TouchableOpacity>
          <Icon name="settings" type="material" size={30} />
        </TouchableOpacity>
      </View>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: userData.id, // Ensure the user ID is set correctly
        }}
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderActions}
      />
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 10,
    fontSize: 18,
  },
  inputToolbar: {
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  },
});

export default MessageScreen;
