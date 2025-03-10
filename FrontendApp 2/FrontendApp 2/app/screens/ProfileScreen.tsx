import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NavigationProps } from './navigation';

interface Product {
  name: string;
  price: string;
  quantity: string;
  image: string | null;
  userId: number;
}

const ProductAddForm: React.FC<NavigationProps> = ({ navigation, route }) => {
  const { userId } = route.params;
  const [productData, setProductData] = useState<Product>({
    name: '',
    price: '',
    quantity: '',
    image: null,
    userId,
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
      setProductData({ ...productData, image: result.assets[0].uri });
    }
  };

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const form = new FormData();
      form.append('name', productData.name);
      form.append('price', productData.price);
      form.append('quantity', productData.quantity);
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
        throw new Error('Failed to add product');
      }
      Alert.alert('Success', 'Product added successfully!');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Failed to add product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>ADD PRODUCT</Text>
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
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.registerButtonText}>Add Product</Text>
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