import { Ionicons } from '@expo/vector-icons';
import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { NotificationService } from '../../api/services/notificationServices';
import { Notification } from '../../api/types/notification';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import NotificationCard from './NotificationCard';

// Utility function to decode JWT
const decodeJWT = (token: string) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    return null;
  }
};

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function NotificationModal({ visible, onClose }: NotificationModalProps) {
  const { colors } = useTheme();
  const { user } = useContext(AuthContext);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && user?.data?.accessToken) {
      console.log("NotificationModal - User token available, fetching notifications");
      fetchNotifications();
    } else {
      console.log("NotificationModal - No user token or modal not visible");
    }
  }, [visible, user]);

  const fetchNotifications = async () => {
    console.log("NotificationModal.fetchNotifications - Starting");
    if (!user?.data?.accessToken) {
      console.log("NotificationModal.fetchNotifications - No access token");
      return;
    }

    const decoded = decodeJWT(user.data.accessToken);
    console.log("NotificationModal.fetchNotifications - Decoded JWT:", decoded);
    if (!decoded?.person_id) {
      console.log("NotificationModal.fetchNotifications - No person_id in JWT");
      return;
    }

    console.log("NotificationModal.fetchNotifications - Person ID:", decoded.person_id);
    setLoading(true);
    try {
      const response = await NotificationService.getUnread(decoded.person_id, user.data.accessToken);
      console.log("NotificationModal.fetchNotifications - Service response:", response);
      if (response.success && response.data) {
        console.log("NotificationModal.fetchNotifications - Setting notifications:", response.data.length);
        setNotifications(response.data);
      } else {
        console.log("NotificationModal.fetchNotifications - Error response:", response.message);
        Alert.alert('Error', response.message || 'Error al cargar notificaciones');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      Alert.alert('Error', 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    console.log("NotificationModal.handleMarkAsRead - notificationId:", notificationId);
    if (!user?.data?.accessToken) {
      console.log("NotificationModal.handleMarkAsRead - No access token");
      return;
    }

    try {
      const response = await NotificationService.markAsRead(notificationId, user.data.accessToken);
      console.log("NotificationModal.handleMarkAsRead - Service response:", response);
      if (response.success) {
        console.log("NotificationModal.handleMarkAsRead - Marking as read in state");
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId ? { ...notif, isRead: true } : notif
          )
        );
      } else {
        console.log("NotificationModal.handleMarkAsRead - Error response:", response.message);
        Alert.alert('Error', response.message || 'Error al marcar como leída');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      Alert.alert('Error', 'Error de conexión');
    }
  };

  const handleMarkAllAsRead = async () => {
    console.log("NotificationModal.handleMarkAllAsRead - Starting");
    if (!user?.data?.accessToken) {
      console.log("NotificationModal.handleMarkAllAsRead - No access token");
      return;
    }

    const decoded = decodeJWT(user.data.accessToken);
    console.log("NotificationModal.handleMarkAllAsRead - Decoded JWT:", decoded);
    if (!decoded?.person_id) {
      console.log("NotificationModal.handleMarkAllAsRead - No person_id in JWT");
      return;
    }

    console.log("NotificationModal.handleMarkAllAsRead - Person ID:", decoded.person_id);
    try {
      const response = await NotificationService.markAllAsRead(decoded.person_id, user.data.accessToken);
      console.log("NotificationModal.handleMarkAllAsRead - Service response:", response);
      if (response.success) {
        console.log("NotificationModal.handleMarkAllAsRead - Marking all as read in state");
        setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
      } else {
        console.log("NotificationModal.handleMarkAllAsRead - Error response:", response.message);
        Alert.alert('Error', response.message || 'Error al marcar todas como leídas');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      Alert.alert('Error', 'Error de conexión');
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: colors.surfaceSecondary }]}>
        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Notificaciones</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {unreadCount > 0 && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.markAllButton, { backgroundColor: colors.primary }]}
              onPress={handleMarkAllAsRead}
            >
              <Text style={[styles.markAllButtonText, { color: colors.textLight }]}>
                Marcar todas como leídas ({unreadCount})
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <NotificationCard
              notification={item}
              onPress={() => !item.isRead && handleMarkAsRead(item.id)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No tienes notificaciones
              </Text>
            </View>
          }
          refreshing={loading}
          onRefresh={fetchNotifications}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  actionsContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  markAllButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  markAllButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});