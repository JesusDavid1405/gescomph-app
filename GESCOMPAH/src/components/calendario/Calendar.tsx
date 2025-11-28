import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/src/styles/color';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  appointments?: Array<{ fecha: string; estado: string }>;
}

export default function Calendar({ selectedDate, onDateSelect, appointments = [] }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Función para navegar meses
  const navigateMonth = (direction: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  // Función para seleccionar fecha
  const selectDate = (day: number) => {
    const newDate = new Date(currentMonth);
    newDate.setDate(day);
    onDateSelect(newDate);
  };

  // Generar días del mes
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  // Verificar si un día tiene citas pendientes
  const hasPendingAppointments = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return appointments.some(cita => cita.fecha === dateString && cita.estado === 'Pendiente');
  };

  // Formatear nombre del mes
  const formatMonth = () => {
    const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
    return currentMonth.toLocaleDateString('es-ES', options);
  };

  const calendarDays = generateCalendarDays();

  return (
    <LinearGradient
      colors={[colors.primary, colors.text, colors.primaryLight]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.calendarContainer}
    >
      {/* Header del calendario */}
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={() => navigateMonth(-1)} style={styles.navButton}>
          <Ionicons name="chevron-back" size={24} color={colors.textLight} />
        </TouchableOpacity>
        <Text style={styles.monthText}>{formatMonth()}</Text>
        <TouchableOpacity onPress={() => navigateMonth(1)} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={24} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      {/* Días de la semana */}
      <View style={styles.weekDays}>
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <Text key={day} style={styles.weekDayText}>{day}</Text>
        ))}
      </View>

      {/* Grid de días */}
      <View style={styles.daysGrid}>
        {calendarDays.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const isToday = day.toDateString() === new Date().toDateString();
          const isSelected = day.toDateString() === selectedDate.toDateString();
          const hasAppointments = hasPendingAppointments(day);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                !isCurrentMonth && styles.otherMonthDay,
                isToday && styles.todayCell,
                isSelected && styles.selectedCell,
              ]}
              onPress={() => selectDate(day.getDate())}
            >
              <Text style={[
                styles.dayText,
                !isCurrentMonth && styles.otherMonthText,
                isToday && styles.todayText,
                isSelected && styles.selectedText,
              ]}>
                {day.getDate()}
              </Text>
              {hasAppointments && <View style={styles.appointmentDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textLight,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    position: 'relative',
  },
  dayText: {
    fontSize: 16,
    color: colors.textLight,
  },
  otherMonthDay: {
    opacity: 0.3,
  },
  otherMonthText: {
    color: colors.textLight,
    opacity: 0.5,
  },
  todayCell: {
    backgroundColor: colors.textLight,
    borderRadius: 20,
  },
  todayText: {
    color: colors.text,
    fontWeight: '700',
  },
  selectedCell: {
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  selectedText: {
    color: colors.textLight,
    fontWeight: '700',
  },
  appointmentDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textLight,
  },
});