import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ArrowRight } from 'phosphor-react-native';
import { router } from 'expo-router';
import { authColors } from '../auth/AuthUi';
import { AgencyStoreIllustration } from './illustrations/CardIllustrations';

export function RelayPointsCard() {
  return (
    <View style={styles.card}>
      {/* ── Barre d'accentuation Jaune Vif Western Union ── */}
      <View style={styles.accentBar} />

      <View style={styles.body}>
        <View style={styles.content}>
          <Text style={styles.title}>
            Recherche d'un point de relais près de chez vous
          </Text>

          <Pressable
            style={styles.linkRow}
            onPress={() => router.push('/(tabs)/relay')}
            accessibilityRole="button"
            accessibilityLabel="Trouver un point de relais"
          >
            <Text style={styles.linkText}>Trouver un point de relais</Text>
            <ArrowRight size={14} color="#0055AA" weight="bold" />
          </Pressable>
        </View>

        {/* ── Illustration Agence / Point de relais (Lampadaire surélevé) ── */}
        <View style={styles.visualWrap}>
          <AgencyStoreIllustration size={78} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: authColors.white,
    borderRadius: 18,
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ECECE8',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  accentBar: {
    width: 6.5,
    backgroundColor: '#FFE500', // Jaune Vif Optimal / Western Union
  },
  body: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  content: {
    flex: 1,
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  linkText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0055AA',
  },
  visualWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
