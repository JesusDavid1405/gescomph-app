import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/src/styles/color';

interface Appointment {
  id: string;
  fecha: string;
  hora: string;
  establecimiento: string;
  estado: string;
}

interface AppointmentCardProps {
  appointment: Appointment;
}

export default function AppointmentCard({ appointment }: AppointmentCardProps) {
  const getEstadoStyle = (estado: string) => {
    switch (estado) {
      case 'Confirmada':
        return { color: colors.success };
      case 'Pendiente':
        return { color: colors.warning };
      case 'Cancelada':
        return { color: colors.danger };
      default:
        return { color: colors.text };
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Ionicons name="calendar-outline" size={22} color="#007BFF" />
        <Text style={styles.fecha}>{appointment.fecha} — {appointment.hora}</Text>
      </View>
      <Text style={styles.establecimiento}>{appointment.establecimiento}</Text>
      <Text style={[styles.estado, getEstadoStyle(appointment.estado)]}>{appointment.estado}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  fecha: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  establecimiento: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  estado: {
    fontSize: 14,
    fontWeight: '600',
  },
});