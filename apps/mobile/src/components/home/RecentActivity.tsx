import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ClockCounterClockwise } from 'phosphor-react-native';
import { authColors } from '../auth/AuthUi';

export function RecentActivity() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Derniers échanges</Text>
      </View>

      {/* Directement posé sur le fond de l'application (sans carte ni cadre blanc) */}
      <View style={styles.emptyContainer}>
        <View style={styles.iconBox}>
          <ClockCounterClockwise size={24} color="#8A8A84" weight="regular" />
        </View>
        <Text style={styles.emptyTitle}>Aucun échange pour le moment</Text>
        <Text style={styles.emptyText}>
          Vos échanges récents et leurs reçus apparaîtront ici.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginTop: 6,
    marginBottom: 24,
  },
  header: {
    paddingHorizontal: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: authColors.ink,
  },
  emptyContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EBEBE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: authColors.ink,
  },
  emptyText: {
    fontSize: 13,
    color: authColors.muted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
