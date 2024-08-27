import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import {
  InputToolbar,
  Send,
  Actions,
  Bubble,
  Day,
} from "react-native-gifted-chat";
import { Icon, Text } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import io from "socket.io-client";
import { API_BASE_URL } from "../common";
import { StyleSheet } from "react-native";

const SOCKET_SERVER_URL = "http://localhost:3000"; // Replace with your server URL

const GiftedChatComponent = ({
  chatId,
  userData,
  userToken,
  pet_owner,
  pet,
  isPetOwner,
}) => {
  const [messages, setMessages] = useState([]);
  const [images, setImages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      newSocket.emit("join", { chatId });
    });

    newSocket.on("receiveMessage", (message) => {
      console.log("Received message from socket:", message);
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, formatMessage(message))
      );
    });

    return () => {
      console.log("Disconnecting from socket server");
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}messages/${chatId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });
        const data = await response.json();
        const formattedMessages = data.map(formatMessage);
        setMessages(formattedMessages); // Assuming the API returns an array of messages
      } catch (error) {
        console.error("Failed to fetch messages:", error);
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
      name: userData.name || "User",
      avatar: userData.avatar || null, // Ensure you have a userData with avatar property
    },
    image: message.image_urls.length > 0 ? message.image_urls[0] : null,
  });

  const onSend = useCallback(
    async (messages = []) => {
      if (messages.length === 0 && images.length === 0) {
        // Não envie nada se não houver texto ou imagens
        return;
      }

      const message = messages[0] || {}; // Use o objeto de mensagem ou um vazio
      const formData = new FormData();
      formData.append("chatId", chatId);
      //   formData.append("senderId", userData.id);
      formData.append("content", message.text || ""); // Permitir que o conteúdo seja vazio se não houver texto

      // Verificar se imagens estão presentes e adicioná-las ao FormData
      if (images.length > 0) {
        images.forEach((image, index) => {
          formData.append("images", {
            uri: image.uri,
            type: image.type || "image/jpeg",
            name: `image${index}.jpg`,
          });
        });
      }

      try {
        const response = await fetch(`${API_BASE_URL}messages/`, {
          method: "POST",
          headers: {
            // Remova o Content-Type dos cabeçalhos. O fetch definirá automaticamente.
            Authorization: `Bearer ${userToken}`,
          },
          body: formData,
        });

        if (!response.ok) {
          // Se a resposta não for ok, obtenha detalhes adicionais
          const errorData = await response.text(); // Pode ser JSON ou texto
          throw new Error(
            `HTTP ${response.status} - ${response.statusText}: ${errorData}`
          );
        }

        const data = await response.json();

        const formattedMessage = formatMessage(data);
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, formattedMessage)
        );
        setImages([]); // Limpar imagens após o envio
        socket.emit("sendMessage", formattedMessage);
      } catch (error) {
        console.error("Failed to send message:", error.message); // Mensagem do erro detalhado
        Alert.alert("Error", `An error occurred: ${error.message}`);
      }
    },
    [images, socket, chatId, userToken]
  );

  const pickImage = async () => {
    try {
      // Solicita permissão para acessar a biblioteca de imagens
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "We need permission to access your photo library."
        );
        return;
      }

      // Lança a biblioteca de imagens
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      // Verifica se a seleção foi cancelada ou houve um erro
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImages = result.assets.map((asset) => ({
          uri: asset.uri,
          type: asset.type || "image/jpeg",
          name: asset.uri ? asset.uri.split("/").pop() : "image.jpg",
        }));
        setImages(selectedImages);
      } else {
        console.log("User cancelled image picker or no images selected");
      }
    } catch (error) {
      console.error("ImagePicker Error: ", error);
      Alert.alert("Error", "An error occurred while picking an image.");
    }
  };

  const renderSend = (props) => {
    // Mostrar o botão de enviar se há imagens ou texto
    if (props.text.trim().length > 0 || images.length > 0) {
      return (
        <Send {...props}>
          <View style={styles.sendingContainer}>
            <Icon name="send" type="material" color="#fc9355" />
          </View>
        </Send>
      );
    }
    return null; // Retorna null para ocultar o botão de envio se não há nada a enviar
  };

  const renderInputToolbar = (props) => (
    <InputToolbar {...props} containerStyle={styles.inputToolbar} />
  );

  const renderActions = (props) => (
    <Actions
      {...props}
      icon={() => <Icon name="image" color="#fc9355" />}
      onPressActionButton={pickImage}
    />
  );

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#FF914D", // Cor da mensagem enviada pelo usuário que está usando o app
        },
        left: {
          backgroundColor: "#FF9999", // Cor da mensagem enviada pelo outro usuário
        },
      }}
      textStyle={{
        right: {
          color: "#FFF", // Texto em branco para mensagens enviadas pelo usuário
        },
        left: {
          color: "#FFF", // Texto em branco para mensagens recebidas
        },
      }}
      timeTextStyle={{
        right: {
          color: "#FFF", // Hora em branco para mensagens enviadas pelo usuário
        },
        left: {
          color: "#FFF", // Hora em branco para mensagens recebidas
        },
      }}
    />
  );

  const renderDay = (props) => {
    // Customiza a data de separação entre as mensagens
    const formattedDate = props.currentMessage.createdAt.toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
    return (
      <Day
        {...props}
        dateFormat="DD/MM/YYYY"
        containerStyle={styles.dayContainer}
        textStyle={styles.dayText}
      >
        <Text style={styles.dayText}>{formattedDate}</Text>
      </Day>
    );
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      renderSend={renderSend}
      renderInputToolbar={renderInputToolbar}
      renderActions={renderActions}
      renderBubble={renderBubble}
      renderDay={renderDay}
    />
  );
};
const styles = StyleSheet.create({
  inputToolbar: {
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
  },
  sendingContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 5,
  },
  dayContainer: {
    marginBottom: 10,
  },
  dayText: {
    color: "#999", // Cor da data de separação
    fontSize: 12,
  },
});

export default GiftedChatComponent;
