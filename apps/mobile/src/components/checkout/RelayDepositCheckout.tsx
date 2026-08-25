import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  X,
  CaretLeft,
  Storefront,
  Barcode,
  Copy,
  Check,
  MapPin,
  AppleLogo,
  GooglePlayLogo,
} from 'phosphor-react-native';
import { useTransferStore } from '../../stores/transferStore';

export function RelayDepositCheckout() {
  const insets = useSafeAreaInsets();
  const { sendAmount, direction, sourceCountry } = useTransferStore();
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId] = useState('23130264157');
  const [depositCode] = useState('OPT-849-204');

  // Horodatage réel capturé automatiquement au moment exact de la commande
  const [formattedDate] = useState(() => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  });

  const currency = direction === 'maroc_to_cemac' ? 'MAD' : 'FCFA';
  const partnerName = direction === 'maroc_to_cemac' ? 'Cash Plus / Wafacash' : 'Réseau Point Relais Optimal';

  const parsedAmount = parseFloat(sendAmount || '0');
  const displayAmount = parsedAmount > 0
    ? `${parsedAmount.toFixed(2)} ${currency}`
    : `0.00 ${currency}`;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      router.replace('/transfer/success');
    }, 1500);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ── 1. Top Bar Propre App ── */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={10}>
            <ArrowLeft size={24} color="#111111" weight="bold" />
          </Pressable>
          <Text style={styles.headerTitle}>Dépôt en Point Relais</Text>
          <Pressable onPress={() => router.replace('/(tabs)/')} style={styles.closeButton} hitSlop={10}>
            <X size={22} color="#666660" weight="bold" />
          </Pressable>
        </View>

        {/* ── 2. Bandeau Supérieur Sobre ── */}
        <View style={styles.brandBanner}>
          <View style={styles.brandLeftContainer}>
            <Storefront size={26} color="#FFFFFF" weight="fill" />
            <View style={styles.brandTexts}>
              <Text style={styles.brandTitle}>Dépôt Espèces Point Relais</Text>
              <Text style={styles.brandCountry}>{partnerName}</Text>
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 24) + 20 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── 3. Lien Retour Marchand ── */}
          <Pressable style={styles.returnMerchantRow} onPress={() => router.back()}>
            <CaretLeft size={16} color="#111111" weight="bold" />
            <Text style={styles.returnMerchantText}>Pour revenir sur le site du marchand</Text>
          </Pressable>

          {/* ── 4. Bloc "Votre commande" (Intégré directement sur fond blanc) ── */}
          <View style={styles.orderSection}>
            <Text style={styles.orderTitle}>
              Votre commande <Text style={styles.orderIdText}>{orderId}</Text>
            </Text>

            <View style={styles.orderGrid}>
              {/* Colonne Gauche : Montant */}
              <View style={styles.orderLeftCol}>
                <Text style={styles.labelMuted}>Montant</Text>
                <Text style={styles.amountBold}>{displayAmount}</Text>
                <Text style={styles.feesText}>+Frais: -</Text>
                <Text style={styles.totalText}>Montant total: -</Text>
              </View>

              {/* Colonne Droite : Bénéficiaire et Horodatage réel */}
              <View style={styles.orderRightCol}>
                <Text style={styles.labelMuted}>Beneficiaire</Text>
                <Text style={styles.dateText}>{formattedDate}</Text>
              </View>
            </View>
          </View>

          <View style={styles.thinSeparator} />

          {/* ── 5. Bloc "Code de Dépôt" ── */}
          <View style={styles.confirmSection}>
            <Text style={styles.sectionHeaderTitle}>Votre code de dépôt sécurisé</Text>

            {/* Code Box */}
            <View style={styles.codeBox}>
              <View style={styles.codeRow}>
                <Barcode size={32} color="#111111" weight="regular" />
                <Text style={styles.codeText}>{depositCode}</Text>
              </View>
              <Pressable style={styles.copyBtn} onPress={handleCopy}>
                {copied ? (
                  <Check size={18} color="#55BA68" weight="bold" />
                ) : (
                  <Copy size={18} color="#111111" weight="bold" />
                )}
                <Text style={styles.copyBtnText}>{copied ? 'Copié !' : 'Copier le code'}</Text>
              </Pressable>
            </View>

            {/* Instruction étape par étape */}
            <View style={styles.instructionStep}>
              <MapPin size={20} color="#111111" weight="fill" />
              <Text style={styles.instructionStepText}>
                Présentez ce code et remettez <Text style={{ fontWeight: '800' }}>{displayAmount}</Text> en espèces auprès de l'agent du point relais pour valider votre transfert instantanément.
              </Text>
            </View>

            {/* Bouton Confirmer */}
            <Pressable
              style={({ pressed }) => [
                styles.confirmButton,
                styles.confirmButtonActive,
                pressed && { opacity: 0.9 },
              ]}
              onPress={handleConfirm}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmButtonText}>
                  J'ai effectué le dépôt
                </Text>
              )}
            </Pressable>

            {/* Bouton Annuler la Transaction */}
            <Pressable style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Annuler la Transaction</Text>
            </Pressable>
          </View>

          {/* ── 6. Pied de Page Sobre ── */}
          <View style={styles.promoSection}>
            <View style={styles.footerBrandRow}>
              <Storefront size={24} color="#111111" weight="fill" />
              <Text style={styles.footerBrandText}>Réseau Points Relais Optimal</Text>
            </View>

            <Text style={styles.promoTitle}>
              Plus de 3 000 agences partenaires pour vos dépôts et retraits d'argent
            </Text>

            {/* Badges Stores */}
            <View style={styles.storesRow}>
              <View style={styles.storeBadge}>
                <GooglePlayLogo size={22} color="#FFFFFF" weight="fill" />
                <View style={styles.storeBadgeTexts}>
                  <Text style={styles.storeSub}>DISPONIBLE SUR</Text>
                  <Text style={styles.storeMain}>Google Play</Text>
                </View>
              </View>

              <View style={styles.storeBadge}>
                <AppleLogo size={24} color="#FFFFFF" weight="fill" />
                <View style={styles.storeBadgeTexts}>
                  <Text style={styles.storeSub}>Télécharger dans</Text>
                  <Text style={styles.storeMain}>l’App Store</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // 1. Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0ED',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F5F5F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F5F5F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
  },

  // 2. Bandeau Supérieur
  brandBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 52,
  },
  brandLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandTexts: {
    gap: 1,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  brandCountry: {
    color: '#D0D0CC',
    fontSize: 12.5,
    fontWeight: '600',
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 16,
  },

  // 3. Lien Retour Marchand
  returnMerchantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  returnMerchantText: {
    color: '#111111',
    fontSize: 14.5,
    fontWeight: '700',
  },

  // 4. Commande
  orderSection: {
    gap: 8,
  },
  orderTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: '#000000',
  },
  orderIdText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  orderGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 2,
  },
  orderLeftCol: {
    gap: 3,
  },
  orderRightCol: {
    alignItems: 'flex-start',
    gap: 3,
  },
  labelMuted: {
    fontSize: 13,
    color: '#767670',
    fontWeight: '500',
  },
  amountBold: {
    fontSize: 15,
    fontWeight: '900',
    color: '#000000',
  },
  feesText: {
    fontSize: 13,
    color: '#000000',
    fontWeight: '500',
  },
  totalText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#000000',
  },
  dateText: {
    fontSize: 13,
    color: '#000000',
    fontWeight: '500',
  },

  thinSeparator: {
    height: 1,
    backgroundColor: '#EBEBEB',
  },

  // 5. Confirmation de paiement
  confirmSection: {
    gap: 14,
  },
  sectionHeaderTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: '#000000',
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F3',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  codeText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: 1,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E5E0',
  },
  copyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111111',
  },

  instructionStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F9F9F8',
    padding: 12,
    borderRadius: 8,
  },
  instructionStepText: {
    flex: 1,
    fontSize: 13.5,
    color: '#333330',
    lineHeight: 19,
    fontWeight: '500',
  },

  // Bouton Confirmer
  confirmButton: {
    backgroundColor: '#111111',
    height: 44,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  confirmButtonActive: {
    backgroundColor: '#111111',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Annuler la Transaction
  cancelButton: {
    backgroundColor: '#000000',
    height: 38,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    marginTop: 4,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // 6. Footer Promo
  promoSection: {
    gap: 14,
    paddingTop: 16,
  },
  footerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerBrandText: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '900',
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
    lineHeight: 22,
  },

  storesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  storeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  storeBadgeTexts: {
    gap: -1,
  },
  storeSub: {
    fontSize: 7.5,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  storeMain: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
