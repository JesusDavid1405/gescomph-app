import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Notification, NotificationPriority } from '../../api/types/notification';
import { useTheme } from '../../context/ThemeContext';

interface NotificationCardProps {
  notification: Notification;
  onPress?: () => void;
}

const getPriorityClass = (priority: NotificationPriority): string => {
  switch (priority) {
    case NotificationPriority.Critical:
      return 'priority-critical';
    case NotificationPriority.Warning:
      return 'priority-warning';
    default:
      return 'priority-info';
  }
};

const getPriorityColor = (priority: NotificationPriority, colors: any) => {
  switch (priority) {
    case NotificationPriority.Critical:
      return colors.error;
    case NotificationPriority.Warning:
      return colors.warning;
    default:
      return colors.primary;
  }
};

export default function NotificationCard({ notification, onPress }: NotificationCardProps) {
  const { colors } = useTheme();
  const priorityClass = getPriorityClass(notification.priority);
  const priorityColor = getPriorityColor(notification.priority, colors);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderLeftColor: priorityColor,
          borderLeftWidth: 4,
        },
        !notification.isRead && { backgroundColor: colors.surfaceSecondary },
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{notification.title}</Text>
          {!notification.isRead && (
            <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
          )}
        </View>
        <Text style={[styles.message, { color: colors.textSecondary }]} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          {new Date(notification.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderLeftWidth: 4,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
  },
});