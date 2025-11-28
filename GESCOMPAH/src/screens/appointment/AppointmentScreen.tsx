import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Calendar from '@/src/components/calendario/Calendar';
import AppointmentCard from '@/src/components/cita/AppointmentCard';
import { AppointmentService } from '@/src/api/services/appointmentServices';
import { Appointment } from '@/src/api/types/appointment';
import { useTheme } from '@/src/context/ThemeContext';
import { useHeaderHeight } from '@react-navigation/elements';

export default function AppointmentScreen() {
  const { colors } = useTheme();
  // Estado para la fecha seleccionada
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const headerHeight = useHeaderHeight();

  // Cargar citas al montar el componente
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const result = await AppointmentService.getAll();
        if (result.success && result.data) {
          setAppointments(result.data);
        }
      } catch (error) {
        console.error('Error loading appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  // Transformar citas para el formato que espera el calendario
  const calendarAppointments = appointments.map(appointment => ({
    fecha: appointment.dateTimeAssigned.split('T')[0], // Extraer solo la fecha
    estado: appointment.active ? 'Pendiente' : 'Cancelada', // Mapear active a estado
  }));

  // Transformar citas para el formato que esperan las tarjetas
  const citas = appointments.map(appointment => ({
    id: appointment.id.toString(),
    fecha: appointment.dateTimeAssigned.split('T')[0],
    hora: new Date(appointment.dateTimeAssigned).toLocaleTimeString('es-ES', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }),
    establecimiento: appointment.establishmentName,
    estado: appointment.active ? 'Pendiente' : 'Cancelada',
    descripcion: appointment.description,
    persona: appointment.personName,
    telefono: appointment.phone,
  }));

  // Filtrar citas para la fecha seleccionada
  const selectedDateString = selectedDate.toISOString().split('T')[0];
  const citasDelDia = citas.filter(cita => cita.fecha === selectedDateString);

  // Filtrar citas pendientes para la fecha seleccionada (para la sección inferior)
  const citasSeleccionadas = citas.filter(cita => cita.fecha === selectedDateString && cita.estado === 'Pendiente');

  const renderItem = ({ item }: any) => (
    <AppointmentCard appointment={item} />
  );

  return (
    <View style={[styles.container, { paddingTop: headerHeight, backgroundColor: colors.surfaceSecondary }]}>
      {/* Calendario fijo en la parte superior */}
      <View style={[styles.fixedCalendar, { backgroundColor: colors.background }]}>
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          appointments={calendarAppointments}
        />
      </View>

      {/* Título fijo con fondo blanco */}
      <View style={[styles.fixedTitleContainer, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
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
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No hay citas para esta fecha</Text>
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
    marginBottom: 16,
  },
  appointmentsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
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
    elevation: 2,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  fixedTitleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    elevation: 1,
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
