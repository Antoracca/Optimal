import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Share,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  CheckCircle,
  ShareNetwork,
  House,
  Copy,
  Clock,
  ShieldCheck,
  Check,
} from 'phosphor-react-native';
import { authColors } from '../../src/components/auth/AuthUi';
import { useTransferStore } from '../../src/stores/transferStore';
import { OperatorLogo } from '../../src/components/transfer/OperatorLogo';

export default function TransferSuccessScreen() {
  const insets = useSafeAreaInsets();
  const {
    direction,
    sendAmount,
    receiveAmount,
    selectedOperator,
    selectedOperatorId,
    recipient,
    resetSelections,
  } = useTransferStore();

  const [copied, setCopied] = useState(false);
  const transactionCode = 'OPT-8492048';

  const isCemacToMaroc = direction === 'cemac_to_maroc';
  const sendCurrency = isCemacToMaroc ? 'XAF' : 'MAD';
  const receiveCurrency = isCemacToMaroc ? 'MAD' : 'XAF';

  const recipientDisplayName =
    recipient.firstName && recipient.lastName
      ? `${recipient.firstName} ${recipient.lastName}`
      : recipient.firstName || 'Bénéficiaire';

  const handleCopyCode = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Échange Optimal réussi !\nCode de suivi : ${transactionCode}\nMontant : ${receiveAmount} ${receiveCurrency}\nBénéficiaire : ${recipientDisplayName}\nOpérateur : ${selectedOperator}`,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleDone = () => {
    resetSelections();
    router.replace('/(tabs)/');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. Icon & Header de Succès ── */}
        <View style={styles.successHeader}>
          <View style={styles.checkCircle}>
            <CheckCircle size={72} color="#10B981" weight="fill" />
          </View>
          <Text style={styles.successTitle}>Échange envoyé !</Text>
          <Text style={styles.successSubtitle}>
            Vos fonds ont été transmis avec succès et seront disponibles en quelques minutes.
          </Text>
        </View>

        {/* ── 2. Boîte Code de Suivi (MTCN) ── */}
        <View style={styles.codeBox}>
          <Text style={styles.codeLabel}>CODE DE SUIVI DE L’ÉCHANGE</Text>
          <View style={styles.codeRow}>
            <Text style={styles.codeValue}>{transactionCode}</Text>
            <Pressable onPress={handleCopyCode} style={styles.copyBtn} hitSlop={10}>
              {copied ? (
                <Check size={18} color="#10B981" weight="bold" />
              ) : (
                <Copy size={18} color="#111111" weight="bold" />
              )}
            </Pressable>
          </View>
          <Text style={styles.codeHint}>
            Communiquez ce code au bénéficiaire si un retrait au guichet est requis.
          </Text>
        </View>

        {/* ── 3. Synthèse du Reçu ── */}
        <View style={styles.receiptCard}>
          <View style={styles.receiptHeader}>
            <Text style={styles.receiptTitle}>Reçu de transaction</Text>
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>En cours de livraison</Text>
            </View>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Montant envoyé</Text>
            <Text style={styles.receiptValue}>
              {sendAmount} {sendCurrency}
            </Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Montant à recevoir</Text>
            <Text style={[styles.receiptValue, { color: '#111111', fontWeight: '900' }]}>
              {receiveAmount} {receiveCurrency}
            </Text>
          </View>

          <View style={styles.receiptDivider} />

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Bénéficiaire</Text>
            <Text style={styles.receiptValue}>{recipientDisplayName}</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Mode de réception</Text>
            <Text style={styles.receiptValue}>{selectedOperator}</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Délai estimé</Text>
            <Text style={[styles.receiptValue, { color: '#059669' }]}>En quelques minutes</Text>
          </View>
        </View>
      </ScrollView>

      {/* ── Actions en bas ── */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable style={styles.shareBtn} onPress={handleShare}>
          <ShareNetwork size={20} color="#111111" weight="bold" />
          <Text style={styles.shareBtnText}>Partager le reçu</Text>
        </Pressable>

        <Pressable style={styles.doneBtn} onPress={handleDone}>
          <Text style={styles.doneBtnText}>Retour à l’accueil</Text>
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 32,
    alignItems: 'center',
    gap: 20,
  },
  successHeader: {
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
  },
  checkCircle: {
    marginBottom: 4,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -0.4,
  },
  successSubtitle: {
    fontSize: 14.5,
    color: '#6E6E68',
    textAlign: 'center',
    lineHeight: 21,
  },

  // Code Box
  codeBox: {
    width: '100%',
    backgroundColor: '#FAFAF8',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.2,
    borderColor: '#ECECE8',
  },
  codeLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8E8E87',
    letterSpacing: 0.6,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  codeValue: {
    fontSize: 26,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: 1.5,
  },
  copyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECECE8',
  },
  codeHint: {
    fontSize: 12,
    color: '#767670',
    textAlign: 'center',
    marginTop: 2,
  },

  // Receipt Card
  receiptCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.2,
    borderColor: '#ECECE8',
    gap: 12,
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  receiptTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#059669',
  },
  receiptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  receiptLabel: {
    fontSize: 13.5,
    color: '#767670',
  },
  receiptValue: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#111111',
  },
  receiptDivider: {
    height: 1,
    backgroundColor: '#F0F0ED',
    marginVertical: 4,
  },

  // Bottom actions
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
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F5F5F3',
    height: 50,
    borderRadius: 16,
  },
  shareBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
  },
  doneBtn: {
    backgroundColor: authColors.yellow,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111111',
  },
});
