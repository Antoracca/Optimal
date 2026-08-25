import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Plus } from 'phosphor-react-native';
import { authColors } from '../auth/AuthUi';

export function RecentRecipients() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bénéficiaires</Text>
      </View>

      {/* Bouton d'ajout épuré */}
      <Pressable style={styles.newRecipientCard} accessibilityRole="button">
        <View style={styles.plusCircle}>
          <Plus size={20} color="#000000" weight="bold" />
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.cardTitle}>Nouveau bénéficiaire</Text>
          <Text style={styles.cardSubtitle}>Ajoutez un proche pour vos prochains échanges</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginTop: 4,
  },
  header: {
    paddingHorizontal: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: authColors.ink,
  },
  newRecipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: authColors.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEEEEC',
  },
  plusCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECECE8',
  },
  textWrap: {
    gap: 2,
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: authColors.ink,
  },
  cardSubtitle: {
    fontSize: 13,
    color: authColors.muted,
  },
});
