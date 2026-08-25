import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Check,
  MagnifyingGlass,
} from 'phosphor-react-native';
import { authColors } from '../../src/components/auth/AuthUi';
import { useTransferStore } from '../../src/stores/transferStore';
import { OperatorLogo } from '../../src/components/transfer/OperatorLogo';

type PaymentMethodItem = {
  id: string;
  name: string;
  category: 'mobile' | 'card' | 'bank' | 'cash';
  sectionTitle?: string;
  subtext: string;
  deliveryTime: string;
  isPopular?: boolean;
};

// ── MOYENS DE PAIEMENT PAR PAYS D'ORIGINE ──
const PAYMENT_METHODS_BY_COUNTRY: Record<string, PaymentMethodItem[]> = {
  // 🇨🇲 Cameroun
  CM: [
    {
      id: 'mtn',
      name: 'MTN Mobile Money',
      sectionTitle: 'Mobile Money',
      category: 'mobile',
      subtext: 'Paiement par portefeuille MTN MoMo',
      deliveryTime: 'En quelques minutes',
      isPopular: true,
    },
    {
      id: 'orange',
      name: 'Orange Money',
      category: 'mobile',
      subtext: 'Paiement sécurisé par compte Orange Money',
      deliveryTime: 'En quelques minutes',
      isPopular: true,
    },
    {
      id: 'relay_deposit',
      name: 'Dépôt en point de relais',
      sectionTitle: 'Points de relais',
      category: 'cash',
      subtext: 'Dépôt d’espèces auprès d’un point partenaire',
      deliveryTime: 'En quelques minutes',
      isPopular: false,
    },
  ],

  // 🇬🇦 Gabon
  GA: [
    {
      id: 'airtel',
      name: 'Airtel Money',
      sectionTitle: 'Mobile Money',
      category: 'mobile',
      subtext: 'Paiement par compte Airtel Money Gabon',
      deliveryTime: 'En quelques minutes',
      isPopular: true,
    },
    {
      id: 'moov',
      name: 'Moov Africa Money',
      category: 'mobile',
      subtext: 'Paiement par portefeuille Moov Money',
      deliveryTime: 'En quelques minutes',
      isPopular: false,
    },
    {
      id: 'relay_deposit',
      name: 'Dépôt en point de relais',
      sectionTitle: 'Points de relais',
      category: 'cash',
      subtext: 'Dépôt d’espèces auprès d’un point partenaire',
      deliveryTime: 'En quelques minutes',
      isPopular: false,
    },
  ],

  // 🇨🇬 Congo (Brazzaville)
  CG: [
    {
      id: 'mtn',
      name: 'MTN Mobile Money',
      sectionTitle: 'Mobile Money',
      category: 'mobile',
      subtext: 'Paiement par compte MTN MoMo Congo',
      deliveryTime: 'En quelques minutes',
      isPopular: true,
    },
    {
      id: 'airtel',
      name: 'Airtel Money',
      category: 'mobile',
      subtext: 'Paiement par portefeuille Airtel Money Congo',
      deliveryTime: 'En quelques minutes',
      isPopular: false,
    },
    {
      id: 'relay_deposit',
      name: 'Dépôt en point de relais',
      sectionTitle: 'Points de relais',
      category: 'cash',
      subtext: 'Dépôt d’espèces auprès d’un point partenaire',
      deliveryTime: 'En quelques minutes',
      isPopular: false,
    },
  ],

  // 🇨🇩 RDC (Kinshasa)
  CD: [
    {
      id: 'airtel',
      name: 'Airtel Money',
      sectionTitle: 'Mobile Money',
      category: 'mobile',
      subtext: 'Paiement par Airtel Money RDC',
      deliveryTime: 'En quelques minutes',
      isPopular: true,
    },
    {
      id: 'orange',
      name: 'Orange Money',
      category: 'mobile',
      subtext: 'Paiement par compte Orange Money RDC',
      deliveryTime: 'En quelques minutes',
      isPopular: false,
    },
    {
      id: 'relay_deposit',
      name: 'Dépôt en point de relais',
      sectionTitle: 'Points de relais',
      category: 'cash',
      subtext: 'Dépôt d’espèces auprès d’un point partenaire',
      deliveryTime: 'En quelques minutes',
      isPopular: false,
    },
  ],

  // 🇨🇫 République Centrafricaine (RCA)
  CF: [
    {
      id: 'orange',
      name: 'Orange Money',
      sectionTitle: 'Mobile Money',
      category: 'mobile',
      subtext: 'Paiement par Orange Money Centrafrique',
      deliveryTime: 'En quelques minutes',
      isPopular: true,
    },
    {
      id: 'relay_deposit',
      name: 'Dépôt en point de relais',
      sectionTitle: 'Points de relais',
      category: 'cash',
      subtext: 'Dépôt d’espèces auprès d’un point partenaire',
      deliveryTime: 'En quelques minutes',
      isPopular: false,
    },
  ],

  // 🇹🇩 Tchad
  TD: [
    {
      id: 'airtel',
      name: 'Airtel Money',
      sectionTitle: 'Mobile Money',
      category: 'mobile',
      subtext: 'Paiement par compte Airtel Money Tchad',
      deliveryTime: 'En quelques minutes',
      isPopular: true,
    },
    {
      id: 'moov',
      name: 'Moov Africa Money',
      category: 'mobile',
      subtext: 'Paiement par Moov Money Tchad',
      deliveryTime: 'En quelques minutes',
      isPopular: false,
    },
    {
      id: 'relay_deposit',
      name: 'Dépôt en point de relais',
      sectionTitle: 'Points de relais',
      category: 'cash',
      subtext: 'Dépôt d’espèces auprès d’un point partenaire',
      deliveryTime: 'En quelques minutes',
      isPopular: false,
    },
  ],

  // 🇬🇶 Guinée Équatoriale
  GQ: [
    {
      id: 'card',
      name: 'Carte Bancaire (Visa / Mastercard)',
      sectionTitle: 'Paiement par carte',
      category: 'card',
      subtext: 'Paiement sécurisé par carte bancaire',
      deliveryTime: 'En quelques minutes',
      isPopular: true,
    },
    {
      id: 'bank',
      name: 'Virement Bancaire National',
      sectionTitle: 'Virement bancaire',
      category: 'bank',
      subtext: 'Virement depuis votre compte bancaire',
      deliveryTime: 'En quelques heures',
      isPopular: false,
    },
    {
      id: 'relay_deposit',
      name: 'Dépôt en point de relais',
      sectionTitle: 'Points de relais',
      category: 'cash',
      subtext: 'Dépôt d’espèces auprès d’un point partenaire',
      deliveryTime: 'En quelques minutes',
      isPopular: false,
    },
  ],

  // 🇲🇦 Maroc (si l'envoi part du Maroc)
  MA: [
    // ── 1. Carte Bancaire Nationale (Lui seul) ──
    {
      id: 'cmi',
      name: 'Carte bancaire CMI',
      sectionTitle: 'Carte bancaire nationale',
      category: 'card',
      subtext: 'Paiement sécurisé par carte CMI Maroc',
      deliveryTime: 'En quelques minutes',
      isPopular: true,
    },

    // ── 2. Cartes Internationales (Visa & Mastercard) ──
    {
      id: 'visa',
      name: 'Visa',
      sectionTitle: 'Cartes internationales',
      category: 'card',
      subtext: 'Paiement instantané par carte Visa',
      deliveryTime: 'En quelques minutes',
      isPopular: false,
    },
    {
      id: 'mastercard',
      name: 'Mastercard',
      category: 'card',
      subtext: 'Paiement instantané par carte Mastercard',
      deliveryTime: 'En quelques minutes',
      isPopular: false,
    },

    // ── 3. Agences (Cash Plus & Wafacash) ──
    {
      id: 'cashplus',
      name: 'Cash Plus',
      sectionTitle: 'Agences',
      category: 'cash',
      subtext: 'Paiement en espèces dans une agence Cash Plus',
      deliveryTime: 'En quelques minutes',
      isPopular: true,
    },
    {
      id: 'wafacash',
      name: 'Wafacash',
      category: 'cash',
      subtext: 'Paiement en espèces dans une agence Wafacash',
      deliveryTime: 'En quelques minutes',
      isPopular: true,
    },

    // ── 4. Points de Relais ──
    {
      id: 'relay_deposit',
      name: 'Dépôt en point de relais',
      sectionTitle: 'Points de relais',
      category: 'cash',
      subtext: 'Dépôt d’espèces auprès d’un point partenaire Optimal',
      deliveryTime: 'En quelques minutes',
      isPopular: false,
    },

    // ── 5. Virement Bancaire ──
    {
      id: 'bank',
      name: 'Virement Bancaire (CIH / Attijari / BCP / Société Générale)',
      sectionTitle: 'Virement bancaire',
      category: 'bank',
      subtext: 'Virement bancaire direct',
      deliveryTime: 'En quelques minutes',
      isPopular: false,
    },
  ],
};

export default function PaymentMethodScreen() {
  const insets = useSafeAreaInsets();
  const { sourceCountry, selectedPaymentMethod, setSelectedPaymentMethod } = useTransferStore();
  const [search, setSearch] = useState('');

  const countryIso = sourceCountry?.iso || 'CM';
  const availableMethods = PAYMENT_METHODS_BY_COUNTRY[countryIso] || PAYMENT_METHODS_BY_COUNTRY['CM'];

  const filtered = availableMethods.filter(
    (m) =>
      search.trim() === '' ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.subtext.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (method: PaymentMethodItem) => {
    setSelectedPaymentMethod(method.name);
    router.push('/transfer/operators');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ── 1. Top Bar & Progression ── */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={10}>
          <ArrowLeft size={22} color="#111111" weight="bold" />
        </Pressable>
        <Text style={styles.headerTitle}>Moyen de paiement</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Barre de progression : 1er segment jaune actif */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarActive} />
        <View style={styles.progressBarInactive} />
        <View style={styles.progressBarInactive} />
      </View>

      {/* ── 2. Liste Déroulante avec Sous-Divisions Claires ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.introHeader}>
            <Text style={styles.title}>Comment souhaitez-vous payer ?</Text>
            <Text style={styles.description}>
              Moyens de paiement disponibles pour{' '}
              <Text style={{ fontWeight: '800', color: '#111111' }}>{sourceCountry.name}</Text>.
            </Text>

            {/* Barre de recherche */}
            <View style={styles.searchCard}>
              <MagnifyingGlass size={20} color="#8A8A85" weight="bold" />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un moyen de paiement..."
                placeholderTextColor="#9E9E98"
                value={search}
                onChangeText={setSearch}
              />
            </View>

            <View style={styles.resultsRow}>
              <Text style={styles.resultsTitle}>
                Moyens de paiement disponibles ({filtered.length})
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const isSelected = selectedPaymentMethod === item.name;
          const showSectionHeader = search.trim() === '' && Boolean(item.sectionTitle);

          return (
            <View style={styles.itemWrapper}>
              {/* En-tête de subdivision */}
              {showSectionHeader && (
                <View style={styles.sectionHeaderWrap}>
                  <Text style={styles.sectionHeaderText}>{item.sectionTitle?.toUpperCase()}</Text>
                </View>
              )}

              <Pressable
                style={({ pressed }) => [
                  styles.paymentCard,
                  isSelected && styles.paymentCardSelected,
                  pressed && styles.paymentCardPressed,
                ]}
                onPress={() => handleSelect(item)}
              >
                {/* Gauche : Logo avec fond blanc net */}
                <View style={styles.cardLeft}>
                  <OperatorLogo id={item.id} size={50} />

                  <View style={styles.info}>
                    <View style={styles.titleRow}>
                      <Text style={styles.methodName}>{item.name}</Text>
                      {item.isPopular && (
                        <View style={styles.popularBadge}>
                          <Text style={styles.popularText}>POPULAIRE</Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.methodSubtext}>{item.subtext}</Text>

                    <Text style={styles.deliveryText}>{item.deliveryTime}</Text>
                  </View>
                </View>

                {/* Droite : Checkbox de sélection */}
                <View style={styles.cardRight}>
                  {isSelected ? (
                    <View style={styles.selectedCircle}>
                      <Check size={14} color="#FFFFFF" weight="bold" />
                    </View>
                  ) : (
                    <View style={styles.unselectedCircle} />
                  )}
                </View>
              </Pressable>
            </View>
          );
        }}
      />
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
    paddingBottom: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  progressBarActive: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: authColors.yellow,
  },
  progressBarInactive: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#EBEBE8',
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
    gap: 8,
  },
  introHeader: {
    paddingTop: 8,
    paddingBottom: 8,
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -0.4,
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6E6E68',
    lineHeight: 20,
  },

  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F5',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#ECECE8',
  },
  searchInput: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '600',
    color: '#111111',
    padding: 0,
  },

  resultsRow: {
    paddingTop: 10,
    paddingBottom: 4,
  },
  resultsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#8E8E87',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  itemWrapper: {
    gap: 6,
  },
  sectionHeaderWrap: {
    paddingTop: 10,
    paddingBottom: 2,
    paddingHorizontal: 4,
  },
  sectionHeaderText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#444440',
    letterSpacing: 0.8,
  },

  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.25,
    borderColor: '#EEEEEC',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  paymentCardSelected: {
    borderColor: '#111111',
    backgroundColor: '#FFFDF0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  paymentCardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },

  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  methodName: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#111111',
  },
  popularBadge: {
    backgroundColor: '#FFE500',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  popularText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: 0.5,
  },
  methodSubtext: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#6E6E68',
    lineHeight: 16,
  },
  deliveryText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#059669',
    marginTop: 2,
  },

  cardRight: {
    paddingLeft: 10,
  },
  unselectedCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D8D8D4',
  },
  selectedCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
