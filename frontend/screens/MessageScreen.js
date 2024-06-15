import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { GiftedChat, InputToolbar, Send, Actions } from 'react-native-gifted-chat';
import { Icon } from 'react-native-elements';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import { API_BASE_URL } from '../App';

const SOCKET_SERVER_URL = 'http://localhost:3000'; // Replace with your server URL

const MessageScreen = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const [images, setImages] = useState([]);
  const [socket, setSocket] = useState(null);
  const { chatId } = route.params; // Assuming chatId is passed via route params

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      newSocket.emit('join', { chatId });
    });

    newSocket.on('receiveMessage', (message) => {
      setMessages((previousMessages) => GiftedChat.append(previousMessages, message));
    });

    fetchMessages();

    return () => {
      newSocket.disconnect();
    };
  }, [chatId]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}messages/${chatId}`);
      const data = await response.json();
      setMessages(data.messages); // Assuming the API returns an array of messages
    } catch (error) {
      console.error(error);
    }
  };

  const onSend = useCallback(async (messages = []) => {
    const userId = await AsyncStorage.getItem('userId');
    const message = messages[0];

    const formData = new FormData();
    formData.append('chatId', chatId);
    formData.append('senderId', userId);
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
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessages((previousMessages) => GiftedChat.append(previousMessages, data.message));
        setImages([]); // Clear images after sending

        // Emit the message to the socket server
        socket.emit('sendMessage', data.message);
      } else {
        Alert.alert('Error', data.message || 'An error occurred');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  }, [images, socket]);

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
          <Icon name="person" type="material" size={30} />
          <Text style={styles.headerText}>Anna Smith</Text>
        </View>
        <TouchableOpacity>
          <Icon name="settings" type="material" size={30} />
        </TouchableOpacity>
      </View>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
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
