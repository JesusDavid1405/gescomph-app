import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerActions, getFocusedRouteNameFromRoute, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import CustomDrawer from '../components/CustomDrawer';
import Header from '../components/Header';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import ContractScreen from '../screens/contract/contract';
import colors from '../styles/color';
import EstablishmentNavigator from './EstablishmentNavigator';
import ContractNavigator from './ContractNavigator';
import SettingsNavigator from './SettingsNavigator';
import { defaultHeaderOptions } from './navigationOptions';

const Drawer = createDrawerNavigator();

// Component for drawer button in header
function DrawerButton() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.drawerButton}
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
    >
      <Ionicons name="menu" size={24} color="white" />
    </TouchableOpacity>
  );
}

export default function AppNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: true,
        ...defaultHeaderOptions,
        headerTitleStyle: { fontSize: 16 },
        headerTransparent: true,
        drawerType: 'front',
        drawerActiveTintColor: '#3F8A4E', // Verde principal para la ruta activa
        drawerInactiveTintColor: '#555555', // Gris medio para rutas inactivas
        drawerActiveBackgroundColor: '#f0f8f0', // Fondo verde claro para ruta activa
      }}
    >
      <Drawer.Screen name="Inicio" component={DashboardScreen} options={{ headerTitle: 'Inicio' }} />
      <Drawer.Screen
        name="Establecimientos"
        component={EstablishmentNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'EstablishmentList';
          return {
            headerShown: routeName !== 'DetailsEstablishment',
            headerTitle: 'Establecimientos',
            headerRight: () => (
              <Header
                showSearch={routeName === 'EstablishmentList'}
                showNotifications={true}
              />
            ),
          };
        }}
      />
      <Drawer.Screen
        name="Contratos"
        component={ContractNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'ContractList';
          return {
            headerShown: routeName !== 'DetailsContract',
            headerTitle: 'Contratos',
            headerRight: () => (
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications-outline" size={24} color="white" />
              </TouchableOpacity>
            ),
          };
        }}
      />
      <Drawer.Screen
        name="Configuración"
        component={SettingsNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'SettingsMain';
          return {
            headerShown: routeName === 'SettingsMain',
            headerTitle: 'Configuración',
            headerLeft: () => <DrawerButton />,
            headerRight: () => (
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications-outline" size={24} color="white" />
              </TouchableOpacity>
            ),
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: 'white',
          };
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerButton: {
    marginLeft: 16,
  },
  notificationButton: {
    marginRight: 16,
  },
});
