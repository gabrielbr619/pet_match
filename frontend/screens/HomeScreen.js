import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../App';

const HomeScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({});
  const [userToken, setUserToken] = useState(null);
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const getUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      const userDataParsed = JSON.parse(userData);

      const token = await AsyncStorage.getItem('userToken');

      setUserToken(token);
      setUserData(userDataParsed);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (userData.id) {
      fetchPet(userData.id);
    }
  }, [userData]);

  const fetchPet = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}pets/randomPet/${userId}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      });
      const data = await response.json();
      setPet(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      // await fetch('API_BASE_URLusers/likePet', {
      //   method: 'PUT',
      //   headers: {
      //     Accept: 'application/json',
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${userToken}`,
      //   },
      //   body: JSON.stringify({ user, petId: pet.id }),
      // });
      fetchPet(userData.id); // Fetch a new pet after liking
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
      //   body: JSON.stringify({ user, petId: pet.id }),
      // });
      fetchPet(userData.id); // Fetch a new pet after disliking
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5252" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Icon name="user-circle" type="font-awesome" size={40} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pets</Text>
      </View>
      <View style={styles.card}>
        {
          !pet ?
            <View style={styles.container}>
              <Text>No pet found</Text>
            </View>
           :
           <>
            <Image source={{ uri: pet?.pictures?.length > 0 ? pet.pictures[0] : "" }} style={styles.image} resizeMode="contain" />
            <Text style={styles.petName}>{`${pet.name}, ${pet.age}`}</Text>
            <Text style={styles.petLocation}>Santos, SP</Text>
            <Text style={styles.petDescription}>{pet.description}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={handleDislike} style={styles.actionButton}>
                <Icon name="times" type="font-awesome" size={30} color="#FF5252" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
                <Icon name="heart" type="font-awesome" size={30} color="#FF5252" />
              </TouchableOpacity>
            </View>
           </>
        }

      </View>
      {/* <View style={styles.footer}>
        <Icon name="home" type="font-awesome" size={30} onPress={() => navigation.navigate('Home')} />
        <Icon name="search" type="font-awesome" size={30} onPress={() => navigation.navigate('Discover')} />
        <Icon name="comments" type="font-awesome" size={30} onPress={() => navigation.navigate('Chats')} />
        <Icon name="user" type="font-awesome" size={30} onPress={() => navigation.navigate('Profile')} />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    width: '100%',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  petName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  petLocation: {
    fontSize: 18,
    color: '#888',
    marginBottom: 15,
  },
  petDescription: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
  actionButton: {
    padding: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
});

export default HomeScreen;
