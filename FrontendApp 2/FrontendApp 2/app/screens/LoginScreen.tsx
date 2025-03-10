import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from './navigation';
import { View, TextInput, Alert, StyleSheet, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';

const LoginScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<NavigationProps['navigation']>();

  const handleLogin = () => {
    const { email, password } = formData;
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (email === 'admin@gmail.com' && password === 'admin') {
        Alert.alert('Login Successful!', 'Welcome, Admin');
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Invalid email or password. Please try again.');
      }
      setIsLoading(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://the-webunique.com/assets/img/logo-m.png' }}
          style={styles.textLogo}
        />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.title}>WELCOME BACK!</Text>
        <View style={styles.formDiv}>
          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholderTextColor="#aaa"
          />
        </View>
        <View style={styles.formDiv}>
          <Text style={styles.label}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry
            placeholderTextColor="#aaa"
          />
        </View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={!formData.email || !formData.password || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2F33',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  textLogo: {
    width: 180,
    height: 100,
    resizeMode: 'contain',
  },
  formContainer: {
    backgroundColor: '#40444B',
    borderRadius: 10,
    padding: 25,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 25,
    textAlign: 'center',
  },
  formDiv: {
    marginBottom: 25,
  },
  label: {
    color: '#B9BBBE',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#32353B',
    borderWidth: 1,
    borderColor: '#3A3E45',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 5,
    color: '#FFF',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#7289DA',
    borderRadius: 5,
    paddingVertical: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default LoginScreen;