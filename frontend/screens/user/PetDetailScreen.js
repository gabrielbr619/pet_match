import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Carousel from "react-native-reanimated-carousel";
import Avatar from "../../components/Avatar";
import { Ionicons } from "@expo/vector-icons";
import { catBreeds, dogsBreeds } from "../../assets/jsons/petBreeds";
import { Icon } from "react-native-elements";

const { width } = Dimensions.get("window");
const PetDetailScreen = ({ route, navigation }) => {
  const { pet } = route.params;
  const { name, age, description, breed, specie, pictures = [] } = pet;
  const [activeIndex, setActiveIndex] = useState(0);

  const getBreedLabel = (specie, breedValue) => {
    const breedsList = specie === "dog" ? dogsBreeds : catBreeds;
    const breedObj = breedsList.find((b) => b.value === breedValue);
    return breedObj ? breedObj.label : "Raça não especificada";
  };

  const breedLabel = getBreedLabel(specie, breed);

  const renderItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Avatar
        rounded
        size={width}
        containerStyle={styles.petImage}
        source={item ? { uri: item } : null}
        icon={{ name: "paw", type: "font-awesome", size: 60 }}
      />
    </View>
  );

  const handleLike = async () => {
    try {
      await fetch(`${API_BASE_URL}users/likePet`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          user_data: userData,
          pet_id: pet.id,
          pet_owner_id: pet.owner_id,
        }),
      });
      navigation.navigate("Chats");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDislike = async () => {
    try {
      // await fetch('API_BASE_URLusers/deslikePet', {
      //   method: 'PUT',
      //   headers: {
      //     Accept: 'application/json',
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${userToken}`,
      //   },
      //   body: JSON.stringify({ userData, petId: pet.id }),
      // });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={35} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>{pet.name}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View>
          <Carousel
            width={width * 0.9}
            height={250}
            data={pictures?.length > 0 ? pictures : [null]}
            renderItem={renderItem}
            loop={pictures?.length > 0 ? true : false}
            autoPlay={pictures?.length > 0 ? true : false}
            autoPlayInterval={1500}
            onSnapToItem={(index) => setActiveIndex(index)}
          />
          <View style={styles.paginationContainer}>
            {pictures?.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  activeIndex === index ? styles.activeDot : null, // Muda a cor da bolinha ativa
                ]}
              />
            ))}
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petInfo}>Idade: {pet.age} anos</Text>
          <Text style={styles.petInfo}>
            Raça: {breedLabel || "Não especificada"}
          </Text>
          <Text style={styles.petDescription}>{pet.description}</Text>

          {pet.distance !== undefined && (
            <Text style={styles.petDistance}>
              Distância: {pet.distance.toFixed(2)} km
            </Text>
          )}
        </View>

        <View style={styles.actionsContainer}>
          <Pressable onPress={handleDislike} style={styles.actionButton}>
            <View style={styles.circle}>
              <Icon
                name="times"
                type="font-awesome"
                size={35}
                color="#FFFFFF"
              />
            </View>
          </Pressable>
          <Pressable onPress={handleLike} style={styles.actionButton}>
            <View style={styles.circle}>
              <Icon
                name="heart"
                type="font-awesome"
                size={30}
                color="#FFFFFF"
              />
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: 16,
    backgroundColor: "#fc9355",
  },
  headerTitle: {
    fontSize: 24,
    color: "#FFF",
    fontWeight: "bold",
  },
  contentContainer: {
    padding: 16,
  },
  carouselItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  petImage: {
    width: "100%",
    height: 250,
    borderRadius: 15,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#fc9355",
  },
  detailsContainer: {
    padding: 16,
  },
  petName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  petInfo: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  petDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  petDistance: {
    fontSize: 12,
    color: "#888",
    marginTop: 8,
  },

  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginHorizontal: 10,
  },

  actionButton: {
    backgroundColor: "#fc9355",
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  circle: {
    width: 55,
    height: 55,
    backgroundColor: "#fc9355",
    borderRadius: 27.5, // Half of width/height for a circle
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PetDetailScreen;
