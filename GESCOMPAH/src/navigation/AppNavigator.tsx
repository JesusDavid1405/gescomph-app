import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute, DrawerActions, useNavigation } from '@react-navigation/native';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import AppointmentScreen from '../screens/appointment/AppointmentScreen';
import EstablishmentNavigator from './EstablishmentNavigator';
import SettingsNavigator from './SettingsNavigator';
import CustomDrawer from '../components/CustomDrawer';
import Header from '../components/Header';
import { defaultHeaderOptions } from './navigationOptions';
import colors from '../styles/color';

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
      <Drawer.Screen name="Citas" component={AppointmentScreen} options={{ headerTitle: 'Citas' }} />
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
