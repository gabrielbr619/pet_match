import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { TextInput, Button, Checkbox } from 'react-native-paper';
import { SocialIcon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../App';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const navigation = useNavigation();


  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_GOOGLE_CLIENT_ID',
    iosClientId: 'YOUR_IOS_GOOGLE_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_GOOGLE_CLIENT_ID',
    webClientId: 'YOUR_WEB_GOOGLE_CLIENT_ID',
  });

  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: 'YOUR_FACEBOOK_APP_ID',
  });

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}users/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          remember,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the data using AsyncStorage
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));

        // Navigate to the main app screen
        navigation.navigate('Tabs', {screen: "Home", isPetOwner: false});
      } else {
          const response = await fetch(`${API_BASE_URL}petowners/login`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
              remember,
            }),
          });
    
          const data = await response.json();
          if (response.ok) {
            // Store the data using AsyncStorage
            await AsyncStorage.setItem('userToken', data.token);
            await AsyncStorage.setItem('user', JSON.stringify(data.owner));
    
            // Navigate to the main app screen
            navigation.navigate('Tabs', {screen: "Chat", isPetOwner: true});
          }
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Login Error', 'An error occurred. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    promptAsync();
  };

  const handleFacebookLogin = () => {
    fbPromptAsync();
  };

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log('Google Authentication Success:', authentication);
      // Você pode usar a `authentication.accessToken` para chamar a API do Google e obter dados do usuário.
    }
  }, [response]);

  useEffect(() => {
    if (fbResponse?.type === 'success') {
      const { authentication } = fbResponse;
      console.log('Facebook Authentication Success:', authentication);
      // Você pode usar a `authentication.accessToken` para chamar a API do Facebook e obter dados do usuário.
    }
  }, [fbResponse]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/dog_login.png')} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>Log in</Text>
      <Text style={styles.subtitle}>Enter your credentials to proceed</Text>
      
      <TextInput
        label="Enter your email address"
        value={email}
        onChangeText={text => setEmail(text)}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        left={<TextInput.Icon name="email" />}
      />
      <TextInput
        label="Enter your password"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
        style={styles.input}
        left={<TextInput.Icon name="lock" />}
        right={<TextInput.Icon name="eye" />}
      />

      <View style={styles.rememberContainer}>
        <View style={styles.rememberSubContainer}>
          <Checkbox
            status={remember ? 'checked' : 'unchecked'}
            onPress={() => setRemember(!remember)}
            color="#fc9355"
          />
          <Text style={styles.rememberText}>Remember</Text>
        </View>
        <TouchableOpacity onPress={() => console.log('Forgot Password Pressed')}>
          <Text style={styles.forgotText}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>

      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
      >
        Log in
      </Button>

      <Text style={styles.orText}>or</Text>

      <View style={styles.socialContainer}>
        <SocialIcon
          button
          type="google"
          onPress={handleGoogleLogin}
          style={styles.socialButton}
        />
        <SocialIcon
          button
          type="facebook"
          onPress={handleFacebookLogin}
          style={styles.socialButton}
        />
        <SocialIcon
          button
          type="instagram"
          onPress={() => console.log('Instagram Login Pressed')}
          style={styles.socialButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
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
  input: {
    marginBottom: 15,
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rememberSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#888',
  },
  forgotText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#fc9355',
  },
  button: {
    marginVertical: 20,
    backgroundColor: '#FF914D',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 10,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flex: 1,
    marginHorizontal: 10,
  },
});

export default LoginScreen;
