import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProps } from './navigation';

const RegistrationForm: React.FC<NavigationProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    brandName: '',
    contact: '',
    city: 'New York',
    state: 'California',
    address: '',
    image: null as string | null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload images.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setFormData({ ...formData, image: result.assets[0].uri });
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const form = new FormData();
      form.append('username', formData.name);
      form.append('brandName', formData.brandName);
      form.append('contact', formData.contact);
      form.append('city', formData.city);
      form.append('state', formData.state);
      form.append('address', formData.address);
      if (formData.image) {
        const response = await fetch(formData.image);
        const blob = await response.blob();
        form.append('image', blob, 'image.jpg');
      }
      const apiResponse = await fetch('http://localhost:5001/api/register', {
        method: 'POST',
        body: form,
      });
      if (!apiResponse.ok) {
        throw new Error('Failed to register user');
      }
      Alert.alert('Success', 'Registration successful!');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Failed to register user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>REGISTER</Text>
        <View style={styles.formDiv}>
          <Text style={styles.label}>NAME</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholderTextColor="#aaa"
          />
        </View>
        <View style={styles.formDiv}>
          <Text style={styles.label}>BRAND NAME</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your brand name"
            value={formData.brandName}
            onChangeText={(text) => setFormData({ ...formData, brandName: text })}
            placeholderTextColor="#aaa"
          />
        </View>
        <View style={styles.formDiv}>
          <Text style={styles.label}>CONTACT NUMBER</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your contact number"
            value={formData.contact}
            onChangeText={(text) => setFormData({ ...formData, contact: text })}
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.formDiv}>
          <Text style={styles.label}>CITY</Text>
          <Picker
            selectedValue={formData.city}
            onValueChange={(itemValue) => setFormData({ ...formData, city: itemValue })}
            style={styles.picker}
          >
            <Picker.Item label="New York" value="New York" />
            <Picker.Item label="Los Angeles" value="Los Angeles" />
            <Picker.Item label="Chicago" value="Chicago" />
            <Picker.Item label="Houston" value="Houston" />
          </Picker>
        </View>
        <View style={styles.formDiv}>
          <Text style={styles.label}>STATE</Text>
          <Picker
            selectedValue={formData.state}
            onValueChange={(itemValue) => setFormData({ ...formData, state: itemValue })}
            style={styles.picker}
          >
            <Picker.Item label="California" value="California" />
            <Picker.Item label="Texas" value="Texas" />
            <Picker.Item label="Florida" value="Florida" />
            <Picker.Item label="New York" value="New York" />
          </Picker>
        </View>
        <View style={styles.formDiv}>
          <Text style={styles.label}>ADDRESS</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your address"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            placeholderTextColor="#aaa"
          />
        </View>
        <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
          {formData.image ? (
            <Image source={{ uri: formData.image }} style={styles.image} />
          ) : (
            <Text style={styles.imagePlaceholder}>Upload Image</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.registerButtonText}>Register</Text>
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
  formContainer: {
    backgroundColor: '#40444B',
    borderRadius: 10,
    padding: 25,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
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
  picker: {
    backgroundColor: '#32353B',
    color: '#FFF',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 25,
    backgroundColor: '#32353B',
    borderWidth: 1,
    borderColor: '#3A3E45',
    borderRadius: 5,
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imagePlaceholder: {
    color: '#B9BBBE',
    fontSize: 14,
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#7289DA',
    borderRadius: 5,
    paddingVertical: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default RegistrationForm;