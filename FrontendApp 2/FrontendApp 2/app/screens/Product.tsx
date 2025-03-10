import React, { useState, useEffect } from 'react';
import { View, TextInput, Alert, StyleSheet, Text, TouchableOpacity, Image, Picker } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './navigation'; // Adjust the import path to the correct location of types

interface User {
  id: number;
  username: string;
}

interface Product {
  name: string;
  price: string;
  quantity: string;
  image: string | null;
  userId: number | null;
}

const ProductAddForm: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [users, setUsers] = useState<User[]>([]);
  const [productData, setProductData] = useState<Product>({
    name: '',
    price: '',
    quantity: '',
    image: null,
    userId: null,
  });

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/users');
        const data = await response.json();

        if (response.ok) {
          setUsers(data);
        } else {
          Alert.alert('Error', 'Failed to fetch users');
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProductData({ ...productData, image: result.assets[0].uri });
    }
  };

  const handleSubmit = async () => {
    if (!productData.userId) {
      Alert.alert('Error', 'Please select a user.');
      return;
    }

    try {
      const form = new FormData();
      form.append('name', productData.name);
      form.append('price', parseFloat(productData.price).toString());
      form.append('quantity', parseInt(productData.quantity, 10).toString());
      form.append('userId', productData.userId.toString());

      if (productData.image) {
        const response = await fetch(productData.image);
        const blob = await response.blob();
        form.append('image', blob, 'image.jpg');
      }

      const apiResponse = await fetch('http://localhost:5001/api/products', {
        method: 'POST',
        body: form,
      });

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        throw new Error(`Server error: ${errorText}`);
      }

      Alert.alert('Success', 'Product added successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home'), // Redirect to Home
        },
      ]);

      // Reset form data
      setProductData({
        name: '',
        price: '',
        quantity: '',
        image: null,
        userId: null,
      });
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to add product');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>ADD PRODUCT</Text>

        <View style={styles.formDiv}>
          <Text style={styles.label}>SELECT USER</Text>
          <Picker
            selectedValue={productData.userId}
            onValueChange={(itemValue) => setProductData({ ...productData, userId: itemValue })}
            style={styles.picker}
          >
            <Picker.Item label="Select a user" value={null} />
            {users.map((user) => (
              <Picker.Item key={user.id} label={user.username} value={user.id} />
            ))}
          </Picker>
        </View>

        <View style={styles.formDiv}>
          <Text style={styles.label}>PRODUCT NAME</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter product name"
            value={productData.name}
            onChangeText={(text) => setProductData({ ...productData, name: text })}
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.formDiv}>
          <Text style={styles.label}>PRICE</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter product price"
            value={productData.price}
            onChangeText={(text) => setProductData({ ...productData, price: text })}
            placeholderTextColor="#aaa"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formDiv}>
          <Text style={styles.label}>QUANTITY</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter product quantity"
            value={productData.quantity}
            onChangeText={(text) => setProductData({ ...productData, quantity: text })}
            placeholderTextColor="#aaa"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
          {productData.image ? (
            <Image source={{ uri: productData.image }} style={styles.image} />
          ) : (
            <Text style={styles.imagePlaceholder}>Upload Product Image</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
          <Text style={styles.registerButtonText}>Add Product</Text>
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
    borderWidth: 1,
    borderColor: '#3A3E45',
    borderRadius: 5,
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

export default ProductAddForm;