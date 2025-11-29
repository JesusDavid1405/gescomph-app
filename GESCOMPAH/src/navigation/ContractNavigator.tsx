import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import ContractScreen from '../screens/contract/contract';
import DetailsContractScreen from '../screens/contract/DetailsContractScreen';
import colors from '../styles/color';
import { ContractStackParamList } from './types';

const Stack = createNativeStackNavigator<ContractStackParamList>();

export default function ContractNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="ContractList"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="ContractList"
        component={ContractScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="DetailsContract"
        component={DetailsContractScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTransparent: true, // NO ocupa espacio
          headerTitle: '',
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color={colors.primary} />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    backgroundColor: 'rgba(255,255,255,0.9)', // igual que en la imagen
    padding: 8,
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    marginLeft: 10,
    marginRight: 10,
  },
});