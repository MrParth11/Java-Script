import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './app/screens/HomeScreen';
import ProductScreen from './app/screens/Product';
import RegistrationScreen from './app/screens/RegistrationScreen';
import ProductAddForm from './app/screens/Product'; // Import the ProductAddForm component
import { RootStackParamList } from './app/screens/navigation'; // Adjust the import path

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Product" component={ProductScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;