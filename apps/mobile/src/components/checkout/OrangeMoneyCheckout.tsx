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
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  X,
  CaretLeft,
  Info,
  QrCode,
  CaretRight,
  AppleLogo,
  GooglePlayLogo,
} from 'phosphor-react-native';
import { useTransferStore } from '../../stores/transferStore';

const orangeMoneyBannerImage = require('../../../assets/orangemonneyRca_cropped.png');
const orangePImage = require('../../../assets/orangep_cropped.png');
const orangeMoneyFooterImage = require('../../../assets/orangemonney3_cropped.png');
const orangeAppQrImage = require('../../../assets/orange_app_qr.png');

export function OrangeMoneyCheckout() {
  const insets = useSafeAreaInsets();
  const { sendAmount } = useTransferStore();

  const [mobileNumber, setMobileNumber] = useState('');
  const [paymentCode, setPaymentCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId] = useState('23130264157');

  // Horodatage réel capturé automatiquement au moment exact de la commande
  const [formattedDate] = useState(() => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  });

  const parsedAmount = parseFloat(sendAmount || '0');
  const displayAmount = parsedAmount > 0
    ? `${parsedAmount.toFixed(2)} FCFA`
    : '0.00 FCFA';

  const isFormFilled = mobileNumber.trim().length >= 8 && paymentCode.trim().length >= 6;

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
          <Text style={styles.headerTitle}>Code de dépôt</Text>
          <Pressable onPress={() => router.replace('/(tabs)/')} style={styles.closeButton} hitSlop={10}>
            <X size={22} color="#666660" weight="bold" />
          </Pressable>
        </View>

        {/* ── 2. Bandeau Noir Officiel (Gauche: Orange Money Logo, Droite: Orange P) ── */}
        <View style={styles.blackBanner}>
          <Image
            source={orangeMoneyBannerImage}
            style={styles.bannerLogoLeft}
            contentFit="contain"
            transition={150}
            cachePolicy="memory-disk"
          />
          <Image
            source={orangePImage}
            style={styles.bannerLogoRight}
            contentFit="contain"
            transition={150}
            cachePolicy="memory-disk"
          />
        </View>

        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 24) + 20 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── 3. Lien Retour Marchand ── */}
          <Pressable style={styles.returnMerchantRow} onPress={() => router.back()}>
            <CaretLeft size={16} color="#EA5A0B" weight="bold" />
            <Text style={styles.returnMerchantText}>Pour revenir sur le site du marchand</Text>
          </Pressable>

          {/* ── 4. Bloc "Votre commande" ── */}
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
            <Text style={styles.sectionHeaderTitle}>Confirmation de paiement</Text>

            {/* Champ Numéro de mobile */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Numero de mobile (8 chiffres)*</Text>
              <TextInput
                style={styles.roundedInput}
                placeholder=""
                placeholderTextColor="#999990"
                value={mobileNumber}
                onChangeText={setMobileNumber}
                keyboardType="phone-pad"
                maxLength={12}
              />
            </View>

            {/* Champ Code de paiement */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Code de paiement (6 chiffres)*</Text>

              {/* Notice Info Orange */}
              <View style={styles.infoNoticeRow}>
                <View style={styles.infoIconWrap}>
                  <Info size={18} color="#2B78C5" weight="fill" />
                </View>
                <Text style={styles.infoNoticeText}>
                  Obtenez votre code de paiement depuis le menu USSD Orange Money ou{' '}
                  <Text style={styles.orangeUssdText}>Composez #144*34#</Text>
                </Text>
              </View>

              <TextInput
                style={styles.roundedInput}
                placeholder=""
                placeholderTextColor="#999990"
                value={paymentCode}
                onChangeText={setPaymentCode}
                keyboardType="numeric"
                secureTextEntry
                maxLength={8}
              />
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
                  Confirmer
                </Text>
              )}
            </Pressable>

            {/* Option Flash QR Code */}
            <Pressable style={styles.flashQrRow} onPress={() => {}}>
              <QrCode size={24} color="#000000" weight="bold" />
              <Text style={styles.flashQrText}>
                J’ai l’application Orange Money avec Flash QR Code
              </Text>
              <CaretRight size={18} color="#000000" weight="bold" />
            </Pressable>

            {/* Bouton Annuler la Transaction */}
            <Pressable style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Annuler la Transaction</Text>
            </Pressable>
          </View>

          {/* ── 6. Pied de Page / Promotion Application Orange Money ── */}
          <View style={styles.promoSection}>
            <Image
              source={orangeMoneyFooterImage}
              style={styles.footerLogoLeft}
              contentFit="contain"
              transition={150}
              cachePolicy="memory-disk"
            />

            <Text style={styles.promoTitle}>
              Gerer votre argent simplement avec l’application Orange Money
            </Text>

            <Pressable style={styles.downloadLinkRow} onPress={() => {}}>
              <Text style={styles.downloadLinkText}>Telecharger</Text>
              <CaretRight size={16} color="#EA5A0B" weight="bold" />
            </Pressable>

            {/* Vrais Badges Officiels Google Play & App Store */}
            <View style={styles.storesRow}>
              {/* Google Play */}
              <View style={styles.storeBadge}>
                <GooglePlayLogo size={22} color="#FFFFFF" weight="fill" />
                <View style={styles.storeBadgeTexts}>
                  <Text style={styles.storeSub}>DISPONIBLE SUR</Text>
                  <Text style={styles.storeMain}>Google Play</Text>
                </View>
              </View>

              {/* App Store */}
              <View style={styles.storeBadge}>
                <AppleLogo size={24} color="#FFFFFF" weight="fill" />
                <View style={styles.storeBadgeTexts}>
                  <Text style={styles.storeSub}>Télécharger dans</Text>
                  <Text style={styles.storeMain}>l’App Store</Text>
                </View>
              </View>
            </View>

            {/* Vrai QR Code officiel haute fidélité */}
            <Text style={styles.qrInstructionText}>
              Flashez le QR Code et telechargez votre application Orange Money ici:
            </Text>

            <Image
              source={orangeAppQrImage}
              style={styles.qrImage}
              contentFit="contain"
              transition={150}
              cachePolicy="memory-disk"
            />
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

  // 2. Bandeau Noir Officiel
  blackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000000',
    paddingHorizontal: 14,
    paddingVertical: 8,
    minHeight: 52,
  },
  bannerLogoLeft: {
    width: 140,
    height: 38,
  },
  bannerLogoRight: {
    width: 26,
    height: 26,
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
    color: '#EA5A0B',
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
  orangeUssdText: {
    color: '#EA5A0B',
    fontWeight: '700',
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
    backgroundColor: '#FF6600',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  confirmButtonTextActive: {
    color: '#FFFFFF',
  },

  // Flash QR Code
  flashQrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    marginTop: 2,
  },
  flashQrText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
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
  footerLogoLeft: {
    width: 155,
    height: 42,
    alignSelf: 'flex-start',
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
    lineHeight: 22,
  },
  downloadLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  downloadLinkText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EA5A0B',
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

  qrInstructionText: {
    fontSize: 13.5,
    color: '#000000',
    fontWeight: '500',
    lineHeight: 19,
  },
  qrImage: {
    width: 175,
    height: 175,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
});
