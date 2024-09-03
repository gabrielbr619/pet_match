import React from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import PetCard from "../../components/PetCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native-paper";
import { Icon } from "react-native-elements";

const ResultsScreen = ({ route, navigation }) => {
  const { petsData } = route.params; // Assumindo que petsData está vindo da navegação

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" type="material" size={35} color={"#fff"} />
        </Pressable>
        <Text style={styles.headerTitle}>Pets Encontrados</Text>
      </View>
      <FlatList
        data={petsData}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate("PetDetail", { pet: item })}
          >
            <PetCard pet={item} />
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // Permite que o SafeAreaView ocupe todo o espaço disponível
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: 20,
    backgroundColor: "#fc9355",
  },
  headerTitle: {
    fontSize: 24,
    color: "#FFF",
    fontWeight: "bold",
  },
  listContent: {
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
});

export default ResultsScreen;
