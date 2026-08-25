import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Bell } from 'phosphor-react-native';
import { authColors } from '../auth/AuthUi';

export function HomeHeader() {
  return (
    <View style={styles.headerWrap}>
      <View style={styles.headerCurved}>
        <View style={styles.spacer} />
        {/* Cloche de notifications discrète */}
        <Pressable
          style={styles.notifButton}
          accessibilityLabel="Notifications"
          hitSlop={10}
        >
          <Bell size={22} color={authColors.ink} weight="bold" />
          <View style={styles.notifDot} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    backgroundColor: authColors.white,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    zIndex: 10,
  },
  headerCurved: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 16,
  },
  spacer: {
    width: 40,
  },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F7F7F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECECE8',
  },
  notifDot: {
    position: 'absolute',
    top: 11,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C82127',
    borderWidth: 1.5,
    borderColor: authColors.white,
  },
});
