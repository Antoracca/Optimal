import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ArrowRight } from 'phosphor-react-native';
import { router } from 'expo-router';
import { authColors } from '../auth/AuthUi';
import { EnvelopePenIllustration } from './illustrations/CardIllustrations';

export function SecondaryPromoCard() {
  return (
    <View style={styles.card}>
      {/* ── Barre d'accentuation Cyan Western Union ── */}
      <View style={styles.accentBar} />

      <View style={styles.body}>
        <View style={styles.content}>
          <Text style={styles.title}>
            Changez la façon dont vous pouvez recevoir l'argent
          </Text>

          <Pressable
            style={styles.linkRow}
            onPress={() => router.push('/transfer/operators')}
            accessibilityRole="button"
            accessibilityLabel="Mettre à jour le mode de réception"
          >
            <Text style={styles.linkText}>Mettre à jour le mode de réception</Text>
            <ArrowRight size={14} color="#0055AA" weight="bold" />
          </Pressable>
        </View>

        {/* ── Illustration Enveloppe + Billets + Stylo sur cercle jaune ── */}
        <View style={styles.visualWrap}>
          <EnvelopePenIllustration size={78} />
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
    backgroundColor: '#00A3A6', // Cyan Western Union
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
