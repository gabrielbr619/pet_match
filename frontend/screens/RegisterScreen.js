import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { SocialIcon } from 'react-native-elements';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_GOOGLE_CLIENT_ID',
    iosClientId: 'YOUR_IOS_GOOGLE_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_GOOGLE_CLIENT_ID',
    webClientId: 'YOUR_WEB_GOOGLE_CLIENT_ID',
  });

  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: 'YOUR_FACEBOOK_APP_ID',
  });

  const handleRegister = () => {
    fetch('http://localhost:3000/api/users/register',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        email,
      }),
    })
    console.log('Registering', { username, password, email });
  };

  const handleGoogleLogin = () => {
    promptAsync();
  };

  const handleFacebookLogin = () => {
    fbPromptAsync();
  };

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log('Google Authentication Success:', authentication);
      // Você pode usar a `authentication.accessToken` para chamar a API do Google e obter dados do usuário.
    }
  }, [response]);

  React.useEffect(() => {
    if (fbResponse?.type === 'success') {
      const { authentication } = fbResponse;
      console.log('Facebook Authentication Success:', authentication);
      // Você pode usar a `authentication.accessToken` para chamar a API do Facebook e obter dados do usuário.
    }
  }, [fbResponse]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>Join us to find your perfect furry friend.</Text>
      
      <TextInput
        label="Username"
        value={username}
        onChangeText={text => setUsername(text)}
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        label="Enter email"
        value={email}
        onChangeText={text => setEmail(text)}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleRegister}
        style={styles.button}
      >
        Create
      </Button>

      <Text style={styles.orText}>or connect with</Text>

      <View style={styles.socialContainer}>
        <SocialIcon
          title="Google"
          button
          type="google"
          onPress={handleGoogleLogin}
          style={styles.socialButton}
        />
        <SocialIcon
          title="Facebook"
          button
          type="facebook"
          onPress={handleFacebookLogin}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
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

export default RegisterScreen;
