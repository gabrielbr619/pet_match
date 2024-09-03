import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Avatar from "./Avatar";
import { dogsBreeds, catBreeds } from "../assets/jsons/petBreeds";

const PetCard = ({ pet }) => {
  const { name, age, description, specie, breed, pictures, distance } = pet;

  // Limitar a descrição a um determinado número de caracteres
  const truncatedDescription =
    description.length > 100
      ? `${description.substring(0, 100)}...`
      : description;

  // Função para buscar o label da raça
  const getBreedLabel = (specie, breedValue) => {
    const breedsList = specie === "dog" ? dogsBreeds : catBreeds;
    const breedObj = breedsList.find((b) => b.value === breedValue);
    return breedObj ? breedObj.label : "Raça não especificada";
  };

  const breedLabel = getBreedLabel(specie, breed);

  return (
    <View style={styles.card}>
      {/* Imagem do pet ou ícone caso não tenha foto */}
      <Avatar
        rounded
        size={250}
        containerStyle={styles.petImage}
        source={pictures?.length > 0 ? { uri: pictures[0] } : null}
        icon={{ name: "paw", type: "font-awesome", size: 60 }}
      />

      <View style={styles.cardContent}>
        <Text style={styles.petName}>{name}</Text>
        <Text style={styles.petAge}>
          {age} anos - {breedLabel}
        </Text>
        <Text style={styles.petDescription}>{truncatedDescription}</Text>
        {distance && (
          <Text style={styles.petDistance}>
            {distance.toFixed(2)} km de distância
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  petImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  icon: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
  },
  petName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  petAge: {
    fontSize: 14,
    color: "#777",
    marginVertical: 4,
  },
  petDescription: {
    fontSize: 14,
    color: "#555",
    marginVertical: 4,
  },
  petDistance: {
    fontSize: 12,
    color: "#888",
    marginTop: 8,
  },
});

export default PetCard;
