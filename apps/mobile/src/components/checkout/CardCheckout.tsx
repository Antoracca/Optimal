import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
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
  CreditCard,
  LockSimple,
  ShieldCheck,
  AppleLogo,
  GooglePlayLogo,
} from 'phosphor-react-native';
import { useTransferStore } from '../../stores/transferStore';

export function CardCheckout() {
  const insets = useSafeAreaInsets();
  const { sendAmount, direction } = useTransferStore();

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId] = useState('23130264157');

  // Horodatage réel capturé automatiquement au moment exact de la commande
  const [formattedDate] = useState(() => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  });

  const currency = direction === 'maroc_to_cemac' ? 'MAD' : 'FCFA';

  const formatCardNumber = (text: string) => {
    const clean = text.replace(/\D/g, '').slice(0, 16);
    const parts = clean.match(/.{1,4}/g) || [];
    setCardNumber(parts.join(' '));
  };

  const formatExpiry = (text: string) => {
    const clean = text.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 3) {
      setExpiry(`${clean.slice(0, 2)}/${clean.slice(2)}`);
    } else {
      setExpiry(clean);
    }
  };

  const parsedAmount = parseFloat(sendAmount || '0');
  const displayAmount = parsedAmount > 0
    ? `${parsedAmount.toFixed(2)} ${currency}`
    : `0.00 ${currency}`;

  const isFormFilled =
    cardNumber.replace(/\s/g, '').length === 16 &&
    expiry.length === 5 &&
    cvv.length >= 3 &&
    cardHolder.trim().length >= 3;

  const handleConfirm = () => {
    if (!isFormFilled) return;
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
        {/* ── 1. Top Bar Propre App : Code de dépôt ── */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={10}>
            <ArrowLeft size={24} color="#111111" weight="bold" />
          </Pressable>
          <Text style={styles.headerTitle}>Paiement par Carte monétique</Text>
          <Pressable onPress={() => router.replace('/(tabs)/')} style={styles.closeButton} hitSlop={10}>
            <X size={22} color="#666660" weight="bold" />
          </Pressable>
        </View>

        {/* ── 2. Bandeau Supérieur Sobre Carte Monétique (CMI, Mastercard, Visa) ── */}
        <View style={styles.brandBanner}>
          <View style={styles.brandLeftContainer}>
            <CreditCard size={26} color="#FFFFFF" weight="fill" />
            <View style={styles.brandTexts}>
              <Text style={styles.brandTitle}>Carte monétique</Text>
              <Text style={styles.brandCountry}>CMI • Mastercard • Visa</Text>
            </View>
          </View>
          <View style={styles.secureBadge}>
            <LockSimple size={14} color="#55BA68" weight="bold" />
            <Text style={styles.secureText}>3D Secure</Text>
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

          {/* ── 5. Bloc "Confirmation de paiement" ── */}
          <View style={styles.confirmSection}>
            <Text style={styles.sectionHeaderTitle}>Coordonnées de la carte</Text>

            {/* Champ Numéro de carte */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Numéro de carte (16 chiffres)*</Text>
              <TextInput
                style={styles.roundedInput}
                placeholder="4000 1234 5678 9010"
                placeholderTextColor="#A0A09C"
                value={cardNumber}
                onChangeText={formatCardNumber}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            {/* Ligne Expiration & CVV */}
            <View style={styles.rowFields}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Date d’expiration*</Text>
                <TextInput
                  style={styles.roundedInput}
                  placeholder="MM/AA"
                  placeholderTextColor="#A0A09C"
                  value={expiry}
                  onChangeText={formatExpiry}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Code CVC / CVV*</Text>
                <TextInput
                  style={styles.roundedInput}
                  placeholder="123"
                  placeholderTextColor="#A0A09C"
                  value={cvv}
                  onChangeText={(t) => setCvv(t.replace(/\D/g, '').slice(0, 4))}
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={4}
                />
              </View>
            </View>

            {/* Titulaire */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Nom du titulaire de la carte*</Text>
              <TextInput
                style={styles.roundedInput}
                placeholder="Nom complet tel qu'indiqué sur la carte"
                placeholderTextColor="#A0A09C"
                value={cardHolder}
                onChangeText={setCardHolder}
                autoCapitalize="characters"
              />
            </View>

            {/* Notice Info Sobre */}
            <View style={styles.infoNoticeRow}>
              <View style={styles.infoIconWrap}>
                <ShieldCheck size={18} color="#55BA68" weight="fill" />
              </View>
              <Text style={styles.infoNoticeText}>
                Paiement ultra-sécurisé avec authentification 3D-Secure de votre banque. Vos données sont chiffrées de bout en bout.
              </Text>
            </View>

            {/* Bouton Confirmer */}
            <Pressable
              style={({ pressed }) => [
                styles.confirmButton,
                isFormFilled && styles.confirmButtonActive,
                pressed && { opacity: 0.9 },
              ]}
              onPress={handleConfirm}
              disabled={!isFormFilled || isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={[styles.confirmButtonText, isFormFilled && styles.confirmButtonTextActive]}>
                  Payer {displayAmount}
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
              <CreditCard size={24} color="#111111" weight="fill" />
              <Text style={styles.footerBrandText}>Paiement Sécurisé Carte</Text>
            </View>

            <Text style={styles.promoTitle}>
              Optimal protège vos transactions conformément aux standards PCI-DSS
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
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1A2E1C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  secureText: {
    color: '#55BA68',
    fontSize: 11,
    fontWeight: '700',
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
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  roundedInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 6,
    height: 40,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#000000',
  },
  rowFields: {
    flexDirection: 'row',
    gap: 12,
  },

  infoNoticeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 2,
    marginBottom: 4,
  },
  infoIconWrap: {
    marginTop: 1,
  },
  infoNoticeText: {
    flex: 1,
    fontSize: 13,
    color: '#000000',
    lineHeight: 18,
    fontWeight: '500',
  },

  // Bouton Confirmer
  confirmButton: {
    backgroundColor: '#D0D0D0',
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
  confirmButtonTextActive: {
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
