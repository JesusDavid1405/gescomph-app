import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import SearchButton from './SearchButton';
import NotificationModal from './notification/NotificationModal';

interface HeaderProps {
  showNotifications?: boolean;
  showSearch?: boolean;
  onNotificationsPress?: () => void;
}

export default function Header({
  showNotifications = true,
  showSearch = false,
  onNotificationsPress,
}: HeaderProps) {
  const { colors } = useTheme();
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const handleNotificationsPress = () => {
    if (onNotificationsPress) {
      onNotificationsPress();
    } else {
      setShowNotificationModal(true);
    }
  };

  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerIcons}>
          {showSearch && <SearchButton />}
          {showNotifications && (
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.surface }]} onPress={handleNotificationsPress}>
              <Ionicons name="notifications-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <NotificationModal
        visible={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});