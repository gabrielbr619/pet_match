import { StyleSheet, Platform, View, Dimensions,Text,TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

const loadFonts = () => {
  return Font.loadAsync({
    'Montserrat-Regular': require('../../assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Bold': require('../../assets/fonts/Montserrat-Bold.ttf'),
  });
};

export default function WelcomeScreen() {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    
        <View style={styles.container}>
        <Text style={styles.title}>Encontre seu parceiro</Text>
        <Text style={styles.subtitle}>Descubra pets adoráveis buscando adoção.</Text>
        <Image source={require('@/assets/images/man-playing-dog.png')} style={styles.image} resizeMode="contain" />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Quero começar!</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>Já tem conta? <Text style={styles.signInText}>Acesse!</Text></Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginBottom: 20,
  },
  image: {
    width: '80%',
    height: 200,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ff5252',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 20,
  },
  buttonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  footerText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  signInText: {
    color: '#ff5252',
  },
});
