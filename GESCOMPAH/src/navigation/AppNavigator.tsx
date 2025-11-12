import { createDrawerNavigator } from '@react-navigation/drawer';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import TabsNavigator from './TabsNavigator';
import AppointmentScreen from '../screens/appointment/AppointmentScreen';
import EstablishmentScreen from '../screens/establishment/EstablishmentScreen';
import CustomDrawer from '../components/CustomDrawer';

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: true,
        drawerType: 'front',
        drawerActiveTintColor: '#3F8A4E', // Verde principal para la ruta activa
        drawerInactiveTintColor: '#555555', // Gris medio para rutas inactivas
        drawerActiveBackgroundColor: '#f0f8f0', // Fondo verde claro para ruta activa
      }}
    >
      <Drawer.Screen name="Inicio" component={DashboardScreen} />
      <Drawer.Screen name="Citas" component={AppointmentScreen} />
      <Drawer.Screen name="Establecimientos" component={EstablishmentScreen} />
      <Drawer.Screen name="Configuración" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}
