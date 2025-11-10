import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppointmentScreen from '../screens/appointment/AppointmentScreen';

import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: any;
          switch (route.name) {
            case 'Contrato': iconName = 'document-text-outline'; break;
            case 'Citas': iconName = 'calendar-outline'; break;
            case 'Establecimientos': iconName = 'business-outline'; break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007BFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      {/* <Tab.Screen name="Contrato" component={ContratoScreen} /> */}
      <Tab.Screen name="Citas" component={AppointmentScreen} />
      {/* <Tab.Screen name="Establecimientos" component={EstablecimientosScreen} /> */}
    </Tab.Navigator>
  );
}
