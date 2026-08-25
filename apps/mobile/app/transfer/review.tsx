import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  X,
  ShieldCheck,
  ArrowsLeftRight,
  Check,
} from 'phosphor-react-native';
import { authColors } from '../../src/components/auth/AuthUi';
import { useTransferStore } from '../../src/stores/transferStore';
import { OperatorLogo } from '../../src/components/transfer/OperatorLogo';

export default function ReviewTransferScreen() {
  const insets = useSafeAreaInsets();
  const {
    direction,
    sourceCountry,
    destinationCountry,
    sendAmount,
    receiveAmount,
    selectedPaymentMethod,
    selectedPaymentId,
    selectedOperator,
    selectedOperatorId,
    recipient,
  } = useTransferStore();

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const isCemacToMaroc = direction === 'cemac_to_maroc';
  const sendCurrency = isCemacToMaroc ? 'XAF' : 'MAD';
  const receiveCurrency = isCemacToMaroc ? 'MAD' : 'XAF';

  const recipientDisplayName =
    recipient.firstName && recipient.lastName
      ? `${recipient.firstName} ${recipient.lastName}`
      : recipient.firstName || 'Bénéficiaire';

  const handleContinueToPayment = () => {
    if (!acceptedTerms) return;
    router.push('/transfer/payment-checkout');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={10}>
          <ArrowLeft size={24} color="#111111" weight="bold" />
        </Pressable>
        <Text style={styles.headerTitle}>Récapitulatif</Text>
        <Pressable onPress={() => router.replace('/(tabs)/')} style={styles.closeButton} hitSlop={10}>
          <X size={22} color="#666660" weight="bold" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. Grand Montant Net à Recevoir (Direct sur fond blanc, aligné gauche) ── */}
        <View style={styles.heroSection}>
          <Text style={styles.heroSub}>Le bénéficiaire recevra exactement</Text>
          <View style={styles.amountRow}>
            <Text style={styles.heroAmount}>{receiveAmount}</Text>
            <Text style={styles.heroCurrency}>{receiveCurrency}</Text>
          </View>
          <View style={styles.rateRow}>
            <ArrowsLeftRight size={16} color="#767670" weight="bold" />
            <Text style={styles.rateText}>
              {isCemacToMaroc ? '1 MAD = 60 XAF' : '60 XAF = 1 MAD'} • Taux fixe
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* ── 2. Détails de l’Échange (Bénéficiaire d'abord, puis montants financiers) ── */}
        <View style={styles.section}>
          <Text style={styles.sectionHeaderTitle}>Détails de l’échange</Text>

          {/* Informations Bénéficiaire */}
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>Bénéficiaire</Text>
            <Text style={styles.itemValue}>{recipientDisplayName}</Text>
          </View>

          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>Téléphone</Text>
            <Text style={styles.itemValue}>{recipient.phone || 'Non renseigné'}</Text>
          </View>

          {recipient.rib ? (
            <View style={styles.itemRow}>
              <Text style={styles.itemLabel}>Numéro de compte / RIB</Text>
              <Text style={[styles.itemValue, { letterSpacing: 0.5 }]}>{recipient.rib}</Text>
            </View>
          ) : null}

          {recipient.city ? (
            <View style={styles.itemRow}>
              <Text style={styles.itemLabel}>Ville</Text>
              <Text style={styles.itemValue}>{recipient.city}</Text>
            </View>
          ) : null}

          {/* Montants financiers */}
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>Montant envoyé</Text>
            <Text style={styles.itemValue}>
              {sendAmount} {sendCurrency}
            </Text>
          </View>

          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>Frais d’échange</Text>
            <Text style={styles.itemValue}>0 {sendCurrency}</Text>
          </View>

          <View style={[styles.itemRow, styles.totalHighlightRow]}>
            <Text style={styles.totalLabel}>Total à payer</Text>
            <Text style={styles.totalValue}>
              {sendAmount} {sendCurrency}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* ── 3. Méthodes d'Envoi & Réception ── */}
        <View style={styles.section}>
          <Text style={styles.sectionHeaderTitle}>Méthodes d'envoi & de réception</Text>

          {/* Moyen de Paiement */}
          <View style={styles.flowRow}>
            <OperatorLogo id={selectedPaymentId || 'mobile'} size={48} />
            <View style={styles.flowInfo}>
              <Text style={styles.flowTag}>VOUS PAYEZ AVEC</Text>
              <Text style={styles.flowName}>{selectedPaymentMethod || 'Moyen de paiement'}</Text>
              <Text style={styles.flowSub}>{sourceCountry.name}</Text>
            </View>
          </View>

          {/* Mode de Réception */}
          <View style={styles.flowRow}>
            <OperatorLogo id={selectedOperatorId || 'bank'} size={48} />
            <View style={styles.flowInfo}>
              <Text style={styles.flowTag}>RÉCEPTION DES FONDS</Text>
              <Text style={styles.flowName}>{selectedOperator || 'Mode de réception'}</Text>
              <Text style={styles.flowSub}>{destinationCountry.name} • En quelques minutes</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* ── 4. Clause Juridique d'Acceptation des Conditions ── */}
        <Pressable
          style={styles.termsRow}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
        >
          <View style={[styles.checkbox, acceptedTerms && styles.checkboxActive]}>
            {acceptedTerms && <Check size={16} color="#FFFFFF" weight="bold" />}
          </View>
          <Text style={styles.termsText}>
            En continuant, j’accepte les{' '}
            <Text style={styles.termsLink}>Conditions Générales d’Utilisation</Text> et la{' '}
            <Text style={styles.termsLink}>Politique de Confidentialité</Text> d’Optimal. Je certifie l’exactitude des informations renseignées pour cet échange.
          </Text>
        </Pressable>

        {/* ── 5. Copywriting Institutionnel Haute Sécurité ── */}
        <View style={styles.securityBlock}>
          <View style={styles.securityIconContainer}>
            <ShieldCheck size={24} color="#111111" weight="regular" />
          </View>
          <Text style={styles.securityParagraph}>
            Optimal applique les standards internationaux de sécurité financière et de conformité bancaire. Votre échange est garanti et suivi de bout en bout jusqu’à la mise à disposition effective des fonds.
          </Text>
        </View>
      </ScrollView>

      {/* ── Bouton Fixe : Continuer vers le paiement ── */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable
          style={({ pressed }) => [
            styles.confirmButton,
            !acceptedTerms && styles.confirmButtonDisabled,
            acceptedTerms && pressed && styles.confirmButtonPressed,
          ]}
          onPress={handleContinueToPayment}
          disabled={!acceptedTerms}
        >
          <Text style={[styles.confirmButtonText, !acceptedTerms && styles.confirmButtonTextDisabled]}>
            Continuer vers le paiement
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0ED',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#111111',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 22,
  },

  // Hero Amount Section (Directement sur fond blanc)
  heroSection: {
    alignItems: 'flex-start',
    gap: 6,
  },
  heroSub: {
    fontSize: 16,
    color: '#767670',
    fontWeight: '600',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  heroAmount: {
    fontSize: 42,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -1,
  },
  heroCurrency: {
    fontSize: 26,
    fontWeight: '900',
    color: '#111111',
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  rateText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#767670',
  },

  divider: {
    height: 1,
    backgroundColor: '#F0F0ED',
  },

  // Sections
  section: {
    gap: 14,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#8E8E87',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  itemLabel: {
    fontSize: 16.5,
    color: '#6E6E68',
    fontWeight: '500',
  },
  itemValue: {
    fontSize: 17.5,
    fontWeight: '700',
    color: '#111111',
    textAlign: 'right',
    flexShrink: 1,
    marginLeft: 16,
  },

  totalHighlightRow: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0ED',
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111111',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111111',
  },

  // Flow items
  flowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 6,
  },
  flowInfo: {
    flex: 1,
    gap: 3,
  },
  flowTag: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#8E8E87',
    letterSpacing: 0.5,
  },
  flowName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111111',
  },
  flowSub: {
    fontSize: 14,
    color: '#767670',
  },

  // Terms Row (Clause Juridique)
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingVertical: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.75,
    borderColor: '#C8C8C2',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#555550',
    lineHeight: 20,
    fontWeight: '500',
  },
  termsLink: {
    fontWeight: '800',
    color: '#111111',
    textDecorationLine: 'underline',
  },

  securityBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingTop: 4,
    paddingBottom: 8,
  },
  securityIconContainer: {
    paddingTop: 4,
  },
  securityParagraph: {
    flex: 1,
    fontSize: 13.5,
    color: '#767670',
    lineHeight: 20,
    fontWeight: '500',
    textAlign: 'left',
  },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0ED',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmButton: {
    backgroundColor: authColors.yellow,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#EBEBE8',
  },
  confirmButtonPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.9,
  },
  confirmButtonText: {
    fontSize: 17.5,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -0.2,
  },
  confirmButtonTextDisabled: {
    color: '#9E9E98',
  },
});
