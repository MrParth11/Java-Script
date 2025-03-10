import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, TextInput } from 'react-native';
import type { NavigationProps } from './navigation.d.ts'; // Adjust the import path as necessary

// Define User and Product interfaces
interface User {
  id: number;
  username: string;
  brandName: string;
  city: string;
  state: string;
  address: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  isPurchased: boolean;
}

const HomeScreen: React.FC<NavigationProps> = ({ navigation }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [userProducts, setUserProducts] = useState<{ [key: number]: Product[] }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/users');
        const data = await response.json();

        if (response.ok) {
          setUsers(data);
          setFilteredUsers(data); // Initialize filtered users with all users
          // Fetch products for each user
          data.forEach((user: User) => fetchProducts(user.id));
        } else {
          Alert.alert('Error', data.error || 'Failed to fetch users');
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  // Fetch products for a specific user
  const fetchProducts = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:5001/api/users/${userId}/products`);
      const data = await response.json();

      if (response.ok) {
        setUserProducts((prev) => ({ ...prev, [userId]: data }));
      } else {
        Alert.alert('Error', data.error || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to fetch products');
    }
  };

  // Handle search/filter
  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(
        (user) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users); // Reset to all users if search query is empty
    }
  }, [searchQuery, users]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User List</Text>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or city"
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#aaa"
      />

      {/* Register Button */}
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate('Registration')}
      >
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>

      {/* Display Users and Their Products */}
      <ScrollView>
        {filteredUsers.map((user) => (
          <View key={user.id} style={styles.userContainer}>
            <Text style={styles.userName}>{user.username}</Text>
            <Text style={styles.userDetails}>Brand: {user.brandName}</Text>
            <Text style={styles.userDetails}>City: {user.city}</Text>
            <Text style={styles.userDetails}>State: {user.state}</Text>
            <Text style={styles.userDetails}>Address: {user.address}</Text>
            {/* Display Products for the User */}
            {userProducts[user.id]?.map((product) => (
              <View key={product.id} style={styles.productContainer}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>Price: ${product.price}</Text>
                <Text style={styles.productQuantity}>Quantity: {product.quantity}</Text>
                {!product.isPurchased ? (
                  <TouchableOpacity
                    style={styles.purchaseButton}
                    onPress={() => {
                      navigation.navigate('Product', { userId: user.id});
                    }}
                  >
                    <Text style={styles.morePurchasesButtonText}>More Purchases</Text>
                    </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.morePurchasesButton}
                    onPress={() => {
                      navigation.navigate('Product', { userId: user.id });
                    }}
                  >
                    <Text style={styles.morePurchasesButtonText}>More Purchases</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2F33',
    padding: 20,
  },
  title: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: '#40444B',
    borderWidth: 1,
    borderColor: '#3A3E45',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 5,
    color: '#FFF',
    fontSize: 14,
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: '#7289DA',
    borderRadius: 5,
    paddingVertical: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  userContainer: {
    marginBottom: 20,
    backgroundColor: '#40444B',
    borderRadius: 5,
    padding: 15,
  },
  userName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  userDetails: {
    color: '#B9BBBE',
    fontSize: 14,
    marginTop: 5,
  },
  productContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#32353B',
    borderRadius: 5,
  },
  productName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  productPrice: {
    color: '#B9BBBE',
    fontSize: 14,
  },
  productQuantity: {
    color: '#B9BBBE',
    fontSize: 14,
  },
  purchaseButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F44336',
    borderRadius: 5,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#FFF',
    fontWeight: '700',
  },
  morePurchasesButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
  },
  morePurchasesButtonText: {
    color: '#FFF',
    fontWeight: '700',
  },
  registerButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default HomeScreen;