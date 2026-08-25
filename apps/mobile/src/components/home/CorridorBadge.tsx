import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ArrowsDownUp } from 'phosphor-react-native';
import { authColors } from '../auth/AuthUi';
import { useTransferStore, EXCHANGE_RATE_MAD_TO_XAF } from '../../stores/transferStore';

export function CorridorBadge() {
  const { direction, toggleDirection } = useTransferStore();
  const isCemacToMaroc = direction === 'cemac_to_maroc';

  return (
    <View style={styles.container}>
      {/* Badge du taux fixe */}
      <View style={styles.ratePill}>
        <View style={styles.liveDot} />
        <Text style={styles.rateText}>
          {isCemacToMaroc
            ? `Taux fixe : 60 XAF = 1 MAD`
            : `Taux fixe : 1 MAD = 60 XAF`}
        </Text>
      </View>

      {/* Bouton d'inversion */}
      <Pressable
        style={({ pressed }) => [styles.swapButton, pressed && styles.swapButtonPressed]}
        onPress={toggleDirection}
        accessibilityRole="button"
        accessibilityLabel="Inverser la direction du transfert"
      >
        <ArrowsDownUp size={16} color={authColors.ink} weight="bold" />
        <Text style={styles.swapText}>Inverser</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginVertical: 10,
  },
  ratePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#F5F5F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ECECE8',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  rateText: {
    fontSize: 13,
    fontWeight: '700',
    color: authColors.ink,
  },
  swapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 229, 0, 0.18)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 229, 0, 0.5)',
  },
  swapButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
  swapText: {
    fontSize: 13,
    fontWeight: '800',
    color: authColors.ink,
  },
});
