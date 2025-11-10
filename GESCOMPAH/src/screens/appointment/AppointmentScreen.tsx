import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AppointmentScreen() {
  // Datos de ejemplo por ahora
  const citas = [
    {
      id: '1',
      fecha: '2025-11-12',
      hora: '10:30 AM',
      establecimiento: 'Clínica Salud Total',
      estado: 'Confirmada',
    },
    {
      id: '2',
      fecha: '2025-11-15',
      hora: '3:00 PM',
      establecimiento: 'Centro Médico Norte',
      estado: 'Pendiente',
    },
    {
      id: '3',
      fecha: '2025-11-20',
      hora: '8:00 AM',
      establecimiento: 'IPS Vida Sana',
      estado: 'Cancelada',
    },
  ];

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Ionicons name="calendar-outline" size={22} color="#007BFF" />
        <Text style={styles.fecha}>{item.fecha} — {item.hora}</Text>
      </View>
      <Text style={styles.establecimiento}>{item.establecimiento}</Text>
      <Text style={[styles.estado, getEstadoStyle(item.estado)]}>{item.estado}</Text>
    </View>
  );

  const getEstadoStyle = (estado: string) => {
    switch (estado) {
      case 'Confirmada':
        return { color: '#28a745' };
      case 'Pendiente':
        return { color: '#ffc107' };
      case 'Cancelada':
        return { color: '#dc3545' };
      default:
        return { color: '#333' };
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Citas</Text>

      <FlatList
        data={citas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
      />

      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add-circle" size={64} color="#007BFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#007BFF',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  fecha: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  establecimiento: {
    fontSize: 15,
    color: '#555',
    marginBottom: 4,
  },
  estado: {
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
});
