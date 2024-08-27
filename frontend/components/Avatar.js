import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Avatar = ({
  rounded,
  size,
  containerStyle,
  avatarStyle,
  source,
  icon,
}) => {
  return (
    <View
      style={[
        styles.container,
        rounded ? styles.rounded : null,
        { height: size, width: size },
        containerStyle,
      ]}
    >
      {source && source.uri ? (
        <Image source={source} style={[styles.image, avatarStyle]} />
      ) : (
        <View style={[styles.iconContainer, avatarStyle]}>
          <Ionicons
            name={icon.name || "paw"}
            size={icon.size * 0.5} // Tamanho do ícone proporcional ao tamanho do avatar
            color={icon.color || "#FFF"}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#BDBDBD", // Cor de fundo padrão
    overflow: "hidden",
  },
  rounded: {
    borderRadius: 50, // Para garantir que seja um círculo
  },
  image: {
    width: "100%",
    height: "100%",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF914D", // Cor de fundo quando não há imagem
    width: "100%",
    height: "100%",
  },
});

export default Avatar;
