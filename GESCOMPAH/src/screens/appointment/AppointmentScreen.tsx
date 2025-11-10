import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Calendar from '@/src/components/calendario/Calendar';
import AppointmentCard from '@/src/components/cita/AppointmentCard';
import colors from '@/src/styles/color';

export default function AppointmentScreen() {
  // Estado para la fecha seleccionada
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Datos de ejemplo con fechas futuras/cercanas
  const citas = [
    {
      id: '1',
      fecha: '2025-11-11',
      hora: '10:30 AM',
      establecimiento: 'Clínica Salud Total',
      estado: 'Confirmada',
    },
    {
      id: '2',
      fecha: '2025-11-12',
      hora: '3:00 PM',
      establecimiento: 'Centro Médico Norte',
      estado: 'Pendiente',
    },
    {
      id: '3',
      fecha: '2025-11-12',
      hora: '4:00 PM',
      establecimiento: 'Centro Médico Norte',
      estado: 'Pendiente',
    },
    {
      id: '4',
      fecha: '2025-11-12',
      hora: '8:00 AM',
      establecimiento: 'IPS Vida Sana',
      estado: 'Cancelada',
    },
    {
      id: '5',
      fecha: '2025-11-12',
      hora: '2:00 PM',
      establecimiento: 'Hospital Central',
      estado: 'Pendiente',
    },
    {
      id: '6',
      fecha: '2025-11-15',
      hora: '9:00 AM',
      establecimiento: 'Centro Médico Sur',
      estado: 'Confirmada',
    },
    {
      id: '7',
      fecha: '2025-11-16',
      hora: '11:00 AM',
      establecimiento: 'Clínica Dental Sonrisa',
      estado: 'Pendiente',
    },
    {
      id: '8',
      fecha: '2025-11-17',
      hora: '4:30 PM',
      establecimiento: 'Centro Oftalmológico Visión',
      estado: 'Confirmada',
    },
    {
      id: '9',
      fecha: '2025-11-18',
      hora: '1:00 PM',
      establecimiento: 'Laboratorio Clínico Análisis',
      estado: 'Pendiente',
    },
  ];

  // Filtrar citas para la fecha seleccionada
  const selectedDateString = selectedDate.toISOString().split('T')[0];
  const citasDelDia = citas.filter(cita => cita.fecha === selectedDateString);

  // Filtrar citas pendientes para la fecha seleccionada (para la sección inferior)
  const citasSeleccionadas = citas.filter(cita => cita.fecha === selectedDateString && cita.estado === 'Pendiente');

  const renderItem = ({ item }: any) => (
    <AppointmentCard appointment={item} />
  );

  return (
    <View style={styles.container}>
      {/* Calendario fijo en la parte superior */}
      <View style={styles.fixedCalendar}>
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          appointments={citas}
        />
      </View>

      {/* Título fijo con fondo blanco */}
      <View style={styles.fixedTitleContainer}>
        <Text style={styles.sectionTitle}>
          Citas del {selectedDate.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
      </View>

      {/* Contenedor scrollable solo para las citas */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Lista de citas del día seleccionado */}
        <View style={styles.appointmentsSection}>

          {citasDelDia.length > 0 ? (
            citasDelDia.map((cita) => (
              <AppointmentCard key={cita.id} appointment={cita} />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color={colors.textMuted} />
              <Text style={styles.emptyText}>No hay citas para esta fecha</Text>
            </View>
          )}
        </View>

        {/* Espacio para el botón flotante */}
        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Efecto de desvanecimiento en la parte inferior */}
      <View style={styles.fadeContainer}>
        <View style={styles.fadeGradient} />
      </View>

      {/* Botón flotante fijo en el lado izquierdo */}
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add-circle" size={64} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100, // Espacio para el botón flotante
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 16,
  },
  appointmentsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 12,
  },
  pendingSection: {
    marginBottom: 24,
  },
  pendingScrollContainer: {
    paddingRight: 16,
  },
  pendingCardWrapper: {
    width: 280,
    marginRight: 12,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixedCalendar: {
    backgroundColor: colors.background,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  fixedTitleContainer: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    elevation: 1,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
  },
  fadeContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 5,
  },
  fadeGradient: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  addButton: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    zIndex: 10,
  },
  bottomSpace: {
    height: 80, // Espacio adicional al final
  },
});
