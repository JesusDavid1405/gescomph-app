import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EstablishmentStackParamList } from './types';
import EstablishmentScreen from '../screens/establishment/EstablishmentScreen';
import DetailsEstablishmentScreen from '../screens/establishment/DetailsEstablishmentScreen';
import colors from '../styles/color';
import { defaultHeaderOptions } from './navigationOptions';

const Stack = createNativeStackNavigator<EstablishmentStackParamList>();

export default function EstablishmentNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="EstablishmentList"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="EstablishmentList"
        component={EstablishmentScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="DetailsEstablishment"
        component={DetailsEstablishmentScreen}
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
