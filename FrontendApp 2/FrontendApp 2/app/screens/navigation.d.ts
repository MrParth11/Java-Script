import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined; // No parameters for Home screen
  Product: { userId: number }; // Product screen expects a userId parameter
  Registration: undefined; // No parameters for Registration screen
  ProductAddForm: { userId: number }; // Add this line
};

export type NavigationProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};