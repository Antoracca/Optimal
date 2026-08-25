import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  X,
  CaretLeft,
  Info,
  AppleLogo,
  GooglePlayLogo,
} from 'phosphor-react-native';
import { useTransferStore } from '../../stores/transferStore';
import { ConfirmationMtnMomoCheckout } from './ConfirmationMtnMomoCheckout';

const mtnLogoImage = require('../../../assets/mtn_cropped.png');

export function MtnMomoCheckout() {
  const insets = useSafeAreaInsets();
  const { sendAmount, sourceCountry } = useTransferStore();

  const [mobileNumber, setMobileNumber] = useState('');
  const [isWaitingPush, setIsWaitingPush] = useState(false);
  const [orderId] = useState('23130264157');

  // Horodatage réel capturé automatiquement au moment exact de la commande
  const [formattedDate] = useState(() => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  });

  const countryName = sourceCountry?.name || 'Cameroun';
  const isCongo = sourceCountry?.iso === 'CG';
  const digitCount = isCongo ? '9' : '9';
  const placeholderNumber = isCongo ? '06 000 00 00' : '670 00 00 00';

  const parsedAmount = parseFloat(sendAmount || '0');
  const displayAmount = parsedAmount > 0
    ? `${parsedAmount.toFixed(2)} FCFA`
    : '0.00 FCFA';

  const isFormFilled = mobileNumber.trim().length >= 8;

  const handleConfirm = () => {
    if (!isFormFilled) return;
    setIsWaitingPush(true);
  };

  const handleCancelPush = () => {
    setIsWaitingPush(false);
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
        {/* ── 1. Header Propre App ── */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={10}>
            <ArrowLeft size={24} color="#111111" weight="bold" />
          </Pressable>
          <Text style={styles.headerTitle}>Paiement MTN MoMo</Text>
          <Pressable onPress={() => router.replace('/(tabs)/')} style={styles.closeButton} hitSlop={10}>
            <X size={22} color="#666660" weight="bold" />
          </Pressable>
        </View>

        {/* ── 2. Bandeau Supérieur Jaune Officiel MTN ── */}
        <View style={styles.mtnBanner}>
          <View style={styles.brandLeftContainer}>
            <Image
              source={mtnLogoImage}
              style={styles.bannerLogo}
              contentFit="contain"
              transition={150}
              cachePolicy="memory-disk"
            />
            <View style={styles.brandTexts}>
              <Text style={styles.brandTitle}>MTN Mobile Money</Text>
              <Text style={styles.brandCountry}>{countryName}</Text>
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
            <CaretLeft size={16} color="#000000" weight="bold" />
            <Text style={styles.returnMerchantText}>Pour revenir sur le site du marchand</Text>
          </Pressable>

          {/* ── 4. Bloc "Votre commande" (Directement sur fond blanc) ── */}
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

          {/* ── 5. Bloc "Confirmation de paiement" (Logique MTN Push USSD) ── */}
          <View style={styles.confirmSection}>
            <Text style={styles.sectionHeaderTitle}>Confirmation de paiement</Text>

            {/* Champ Numéro de mobile */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Numéro de mobile MTN ({digitCount} chiffres)*</Text>
              <TextInput
                style={styles.roundedInput}
                placeholder={placeholderNumber}
                placeholderTextColor="#A0A09C"
                value={mobileNumber}
                onChangeText={setMobileNumber}
                keyboardType="phone-pad"
                maxLength={12}
              />
            </View>

            {/* Notice Info Sobre */}
            <View style={styles.infoNoticeRow}>
              <View style={styles.infoIconWrap}>
                <Info size={18} color="#00263E" weight="fill" />
              </View>
              <Text style={styles.infoNoticeText}>
                Après avoir cliqué sur Confirmer, une invite de validation Push USSD s'affichera directement sur l'écran de votre mobile MTN pour approuver la transaction.
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
              disabled={!isFormFilled}
            >
              <Text style={[styles.confirmButtonText, isFormFilled && styles.confirmButtonTextActive]}>
                Confirmer le paiement
              </Text>
            </Pressable>

            {/* Bouton Annuler la Transaction */}
            <Pressable style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Annuler la Transaction</Text>
            </Pressable>
          </View>

          {/* ── 6. Pied de Page Sobre MTN ── */}
          <View style={styles.promoSection}>
            <Image
              source={mtnLogoImage}
              style={styles.footerLogo}
              contentFit="contain"
              transition={150}
              cachePolicy="memory-disk"
            />

            <Text style={styles.promoTitle}>
              Gérez votre argent en toute sécurité avec MTN MoMo {countryName}
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

      {/* ── 7. Composant Modal Dédié ── */}
      <ConfirmationMtnMomoCheckout
        visible={isWaitingPush}
        onCancel={handleCancelPush}
      />
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

  // 2. Bandeau Supérieur Jaune MTN
  mtnBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFCC00',
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 52,
  },
  brandLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bannerLogo: {
    width: 68,
    height: 28,
  },
  brandTexts: {
    gap: 1,
  },
  brandTitle: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '900',
  },
  brandCountry: {
    color: '#333330',
    fontSize: 12.5,
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
    color: '#000000',
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
    height: 42,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#000000',
  },

  infoNoticeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 2,
    marginBottom: 4,
  },
  infoIconWrap: {
    marginTop: 2,
  },
  infoNoticeText: {
    flex: 1,
    fontSize: 13,
    color: '#333330',
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
    backgroundColor: '#FFCC00',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  confirmButtonTextActive: {
    color: '#000000',
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
  footerLogo: {
    width: 100,
    height: 40,
    alignSelf: 'flex-start',
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
