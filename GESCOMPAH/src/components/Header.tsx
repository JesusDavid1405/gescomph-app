import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import SearchButton from './SearchButton';

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

  return (
    <View style={styles.header}>
      <View style={styles.headerIcons}>
        {showSearch && <SearchButton />}
        {showNotifications && (
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.surface }]} onPress={onNotificationsPress}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
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