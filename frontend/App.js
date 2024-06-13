import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RegisterScreen from './screens/RegisterScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import Tabs from './screens/Tabs';

const Stack = createStackNavigator();

const App = () => {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const getUserToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      console.log(token)

      setUserToken(token);
    };
    getUserToken();
  }, []);


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={userToken ? 'Tabs' : 'Welcome'}>
        {userToken ? (
          <>
            <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
