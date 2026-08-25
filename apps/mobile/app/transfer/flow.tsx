import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Animated,
  Dimensions,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  CaretRight,
  CheckCircle,
  MagnifyingGlass,
  MapPin,
  X,
  Check,
} from 'phosphor-react-native';
import { authColors } from '../../src/components/auth/AuthUi';
import { useTransferStore } from '../../src/stores/transferStore';
import { OperatorLogo } from '../../src/components/transfer/OperatorLogo';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type MethodItem = {
  id: string;
  name: string;
  category: 'mobile' | 'card' | 'bank' | 'cash' | 'relay';
  categoryLabel?: string;
  sectionTitle?: string;
  subtext: string;
  deliveryTime: string;
  isPopular?: boolean;
};

// ── 1. MOYENS DE PAIEMENT (PAR PAYS SOURCE) ──
const PAYMENT_METHODS_BY_COUNTRY: Record<string, MethodItem[]> = {
  // 🇨🇲 Cameroun
  CM: [
    {
      id: 'mtn',
      name: 'MTN Mobile Money',
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
      category: 'cash',
      subtext: 'Dépôt d’espèces auprès d’un point partenaire',
      deliveryTime: 'En quelques minutes',
      isPopular: true,
    },
  ],

  // 🇬🇦 Gabon
  GA: [
    {
      id: 'airtel',
      name: 'Airtel Money',
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
      category: 'cash',
      subtext: 'Dépôt d’espèces auprès d’un point partenaire',
      deliveryTime: 'En quelques minutes',
      isPopular: true,
    },
  ],

  // 🇨🇬 Congo (Brazzaville)
  CG: [
    {
      id: 'mtn',
      name: 'MTN Mobile Money',
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
      isPopular: true,
    },
    {
      id: 'relay_deposit',
      name: 'Dépôt en point de relais',
      category: 'cash',
      subtext: 'Dépôt d’espèces auprès d’un point partenaire',
      deliveryTime: 'En quelques minutes',
      isPopular: true,
    },
  ],

  // 🇨🇩 RDC (Kinshasa)
  CD: [
    {
      id: 'airtel',
      name: 'Airtel Money',
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
      category: 'cash',
      subtext: 'Dépôt d’espèces auprès d’un point partenaire',
      deliveryTime: 'En quelques minutes',
      isPopular: true,
    },
  ],

  // 🇨🇫 RCA
  CF: [
    {
      id: 'orange',
      name: 'Orange Money',
      category: 'mobile',
      subtext: 'Paiement par Orange Money Centrafrique',
      deliveryTime: 'En quelques minutes',
      isPopular: true,
    },
    {
      id: 'relay_deposit',
      name: 'Dépôt en point de relais',
      category: 'cash',
      subtext: 'Dépôt d’espèces auprès d’un point partenaire',
      deliveryTime: 'En quelques minutes',
      isPopular: true,
    },
  ],

  // 🇹🇩 Tchad
  TD: [
    {
      id: 'airtel',
      name: 'Airtel Money',
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
      category: 'cash',
      subtext: 'Dépôt d’espèces auprès d’un point partenaire',
      deliveryTime: 'En quelques minutes',
      isPopular: true,
    },
  ],

  // 🇬🇶 Guinée Équatoriale
  GQ: [
    {
      id: 'card',
      name: 'Carte Bancaire (Visa / Mastercard)',
      category: 'card',
      subtext: 'Paiement sécurisé par carte bancaire',
      deliveryTime: 'En quelques minutes',
      isPopular: true,
    },
    {
      id: 'bank',
      name: 'Virement Bancaire National',
      category: 'bank',
      subtext: 'Virement depuis votre compte bancaire',
      deliveryTime: 'En quelques heures',
      isPopular: false,
    },
    {
      id: 'relay_deposit',
      name: 'Dépôt en point de relais',
      category: 'cash',
      subtext: 'Dépôt d’espèces auprès d’un point partenaire',
      deliveryTime: 'En quelques minutes',
      isPopular: true,
    },
  ],

  // 🇲🇦 Maroc
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

// ── 2. MODES DE RÉCEPTION (MAROC PAR ORDRE EXACT) ──
const MAROC_RECEPTION_SERVICES: MethodItem[] = [
  {
    id: 'cashplus',
    name: 'Cash Plus',
    sectionTitle: 'Agences de retrait',
    category: 'cash',
    categoryLabel: 'Retrait Espèces',
    deliveryTime: 'En quelques minutes',
    subtext: 'Retrait d’espèces',
    isPopular: true,
  },
  {
    id: 'wafacash',
    name: 'Wafacash',
    sectionTitle: 'Agences de retrait',
    category: 'cash',
    categoryLabel: 'Retrait Espèces',
    deliveryTime: 'En quelques minutes',
    subtext: 'Retrait d’espèces',
    isPopular: true,
  },
  {
    id: 'cih',
    name: 'CIH Bank',
    sectionTitle: 'Banques partenaires',
    category: 'bank',
    categoryLabel: 'Banque',
    deliveryTime: 'En quelques minutes',
    subtext: 'Virement sur compte bancaire',
    isPopular: true,
  },
  {
    id: 'attijari',
    name: 'Attijariwafa bank',
    category: 'bank',
    categoryLabel: 'Banque',
    deliveryTime: 'En quelques minutes',
    subtext: 'Virement sur compte bancaire',
    isPopular: false,
  },
  {
    id: 'banque_populaire',
    name: 'Banque Populaire (BCP)',
    category: 'bank',
    categoryLabel: 'Banque',
    deliveryTime: 'En quelques minutes',
    subtext: 'Virement sur compte bancaire',
    isPopular: false,
  },
  {
    id: 'bmce',
    name: 'Bank of Africa (BMCE)',
    category: 'bank',
    categoryLabel: 'Banque',
    deliveryTime: 'En quelques minutes',
    subtext: 'Virement sur compte bancaire',
    isPopular: false,
  },
  {
    id: 'credit_agricole',
    name: 'Crédit Agricole du Maroc',
    category: 'bank',
    categoryLabel: 'Banque',
    deliveryTime: 'En quelques heures',
    subtext: 'Virement sur compte bancaire',
    isPopular: false,
  },
  {
    id: 'bmci',
    name: 'BMCI (BNP Paribas)',
    category: 'bank',
    categoryLabel: 'Banque',
    deliveryTime: 'En quelques heures',
    subtext: 'Virement sur compte bancaire',
    isPopular: false,
  },
  {
    id: 'societe_generale',
    name: 'Société Générale Maroc',
    category: 'bank',
    categoryLabel: 'Banque',
    deliveryTime: 'En quelques minutes',
    subtext: 'Virement sur compte bancaire Société Générale',
    isPopular: false,
  },
];

// ── 3. MODES DE RÉCEPTION (ZONE CEMAC / RDC) ──
const CEMAC_RECEPTION_SERVICES: MethodItem[] = [
  {
    id: 'mtn',
    name: 'MTN Mobile Money',
    category: 'mobile',
    categoryLabel: 'Mobile Money',
    deliveryTime: 'En quelques minutes',
    subtext: 'Mobile Money',
    isPopular: true,
  },
  {
    id: 'orange',
    name: 'Orange Money',
    category: 'mobile',
    categoryLabel: 'Mobile Money',
    deliveryTime: 'En quelques minutes',
    subtext: 'Mobile Money',
    isPopular: true,
  },
  {
    id: 'airtel',
    name: 'Airtel Money',
    category: 'mobile',
    categoryLabel: 'Mobile Money',
    deliveryTime: 'En quelques minutes',
    subtext: 'Mobile Money',
    isPopular: true,
  },
  {
    id: 'moov',
    name: 'Moov Africa Money',
    category: 'mobile',
    categoryLabel: 'Mobile Money',
    deliveryTime: 'En quelques minutes',
    subtext: 'Mobile Money',
    isPopular: false,
  },
];

export default function TransferFlowScreen() {
  const insets = useSafeAreaInsets();
  const {
    direction,
    sourceCountry,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    selectedOperator,
    setSelectedOperator,
  } = useTransferStore();

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0.5)).current; // 50% au départ

  // Recherche étape 1 & 2
  const [searchStep1, setSearchStep1] = useState('');
  const [searchStep2, setSearchStep2] = useState('');
  const [filterCategoryStep2, setFilterCategoryStep2] = useState<'all' | 'bank' | 'cash' | 'relay'>('all');

  const countryIso = sourceCountry?.iso || 'CM';
  const paymentMethods = PAYMENT_METHODS_BY_COUNTRY[countryIso] || PAYMENT_METHODS_BY_COUNTRY['CM'];

  const isCemacToMaroc = direction === 'cemac_to_maroc';
  const receptionServices = isCemacToMaroc ? MAROC_RECEPTION_SERVICES : CEMAC_RECEPTION_SERVICES;

  // Filtrage Étape 1
  const filteredStep1 = paymentMethods.filter(
    (m) =>
      searchStep1.trim() === '' ||
      m.name.toLowerCase().includes(searchStep1.toLowerCase()) ||
      m.subtext.toLowerCase().includes(searchStep1.toLowerCase())
  );

  // Filtrage Étape 2
  const filteredStep2 = receptionServices.filter((s) => {
    const matchCat = filterCategoryStep2 === 'all' || s.category === filterCategoryStep2;
    const matchSearch =
      searchStep2.trim() === '' ||
      s.name.toLowerCase().includes(searchStep2.toLowerCase()) ||
      s.subtext.toLowerCase().includes(searchStep2.toLowerCase());
    return matchCat && matchSearch;
  });

  // ── Glissement fluide Étape 1 ➔ Étape 2 (Barre passe à 100%) ──
  const goToStep2 = (method: MethodItem) => {
    setSelectedPaymentMethod(method.name, method.id);
    setCurrentStep(2);

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -SCREEN_WIDTH,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1.0,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();
  };

  // ── Glissement inverse (Retour Étape 1 - Barre revient à 50%) ──
  const goToStep1 = () => {
    setCurrentStep(1);

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 0.5,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleBack = () => {
    if (currentStep === 2) {
      goToStep1();
    } else {
      router.back();
    }
  };

  const handleSelectReception = (operator: MethodItem) => {
    setSelectedOperator(operator.name, operator.id);
  };

  const handleContinueToRecipient = () => {
    if (!selectedOperator) return;
    setIsLoadingNext(true);
    setTimeout(() => {
      setIsLoadingNext(false);
      router.push('/transfer/recipient');
    }, 280);
  };

  const progressWidthInterpolation = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ── 1. Top Bar Globale ── */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={10}>
          <ArrowLeft size={22} color="#111111" weight="bold" />
        </Pressable>
        <Text style={styles.headerTitle}>
          {currentStep === 1 ? 'Moyen de paiement' : 'Mode de réception'}
        </Text>
        <Pressable onPress={() => router.replace('/(tabs)/')} style={styles.closeButton} hitSlop={10}>
          <X size={20} color="#666660" weight="bold" />
        </Pressable>
      </View>

      {/* ── 2. Barre de Progression Continue (50% étape 1 ➔ 100% étape 2) ── */}
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressBarFill,
            { width: progressWidthInterpolation },
          ]}
        />
      </View>

      {/* ── 3. Conteneur Coulissant Horizontal (Étape 1 & Étape 2) ── */}
      <View style={styles.sliderViewport}>
        <Animated.View
          style={[
            styles.sliderTrack,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* ══════════ PANNEAU 1 : MOYEN DE PAIEMENT ══════════ */}
          <View style={styles.slidePanel}>
            <FlatList
              data={filteredStep1}
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
                      value={searchStep1}
                      onChangeText={setSearchStep1}
                    />
                  </View>

                  <View style={styles.resultsRow}>
                    <Text style={styles.resultsTitle}>
                      Moyens de paiement disponibles ({filteredStep1.length})
                    </Text>
                  </View>
                </View>
              }
              renderItem={({ item }) => {
                const isSelected = selectedPaymentMethod === item.name;
                const showSectionHeader = searchStep1.trim() === '' && Boolean(item.sectionTitle);

                return (
                  <View style={styles.itemWrapper}>
                    {showSectionHeader && (
                      <View style={styles.sectionHeaderWrap}>
                        <Text style={styles.sectionHeaderText}>{item.sectionTitle?.toUpperCase()}</Text>
                      </View>
                    )}

                    <Pressable
                      style={({ pressed }) => [
                        styles.rowItem,
                        isSelected && styles.rowItemSelected,
                        pressed && styles.rowItemPressed,
                      ]}
                      onPress={() => goToStep2(item)}
                    >
                      <View style={styles.rowLeft}>
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

                      <View style={styles.rowRight}>
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
          </View>

          {/* ══════════ PANNEAU 2 : MODE DE RÉCEPTION ══════════ */}
          <View style={styles.slidePanel}>
            <FlatList
              data={filteredStep2}
              keyExtractor={(item) => item.id}
              contentContainerStyle={[
                styles.listContent,
                selectedOperator !== '' && { paddingBottom: 110 },
              ]}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <View style={styles.introHeader}>
                  <Text style={styles.title}>Choisissez votre banque ou opérateur</Text>
                  <Text style={styles.description}>
                    Sélectionnez comment recevoir les fonds.
                  </Text>

                  {/* Barre de recherche */}
                  <View style={styles.searchCard}>
                    <MagnifyingGlass size={20} color="#8A8A85" weight="bold" />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Rechercher une banque ou un service..."
                      placeholderTextColor="#9E9E98"
                      value={searchStep2}
                      onChangeText={setSearchStep2}
                    />
                  </View>

                  {/* Filtres de catégorie si Maroc */}
                  {isCemacToMaroc && (
                    <View style={styles.categoryFilters}>
                      {(
                        [
                          { id: 'all', label: 'Tous' },
                          { id: 'bank', label: 'Banques' },
                          { id: 'cash', label: 'Retrait d’espèces' },
                          { id: 'relay', label: 'Points Relais' },
                        ] as const
                      ).map((c) => {
                        const isActive = filterCategoryStep2 === c.id;
                        return (
                          <Pressable
                            key={c.id}
                            style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                            onPress={() => setFilterCategoryStep2(c.id)}
                          >
                            <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                              {c.label}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  )}

                  <View style={styles.resultsRow}>
                    <Text style={styles.resultsTitle}>
                      {filterCategoryStep2 === 'relay'
                        ? 'Points Relais (0)'
                        : `Services disponibles (${filteredStep2.length})`}
                    </Text>
                  </View>
                </View>
              }
              ListEmptyComponent={
                filterCategoryStep2 === 'relay' ? (
                  <View style={styles.emptyRelayBox}>
                    <MapPin size={36} color="#8E8E87" weight="duotone" />
                    <Text style={styles.emptyRelayTitle}>0 point relais pour le moment</Text>
                    <Text style={styles.emptyRelaySub}>
                      Les retraits en point relais seront bientôt disponibles dans cette zone.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.emptyRelayBox}>
                    <Text style={styles.emptyRelayTitle}>Aucun résultat trouvé</Text>
                  </View>
                )
              }
              renderItem={({ item }) => {
                const isSelected = selectedOperator === item.name;
                const showSectionHeader =
                  searchStep2.trim() === '' &&
                  filterCategoryStep2 === 'all' &&
                  Boolean(item.sectionTitle);

                return (
                  <View style={styles.itemWrapper}>
                    {showSectionHeader && (
                      <View style={styles.sectionHeaderWrap}>
                        <Text style={styles.sectionHeaderText}>{item.sectionTitle?.toUpperCase()}</Text>
                      </View>
                    )}

                    <Pressable
                      style={({ pressed }) => [
                        styles.rowItem,
                        isSelected && styles.rowItemSelected,
                        pressed && styles.rowItemPressed,
                      ]}
                      onPress={() => handleSelectReception(item)}
                    >
                      <View style={styles.rowLeft}>
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

                      <View style={styles.rowRight}>
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

            {/* ── Bouton « Continuer » qui apparaît dès sélection à l'étape 2 ── */}
            {selectedOperator !== '' && (
              <View style={[styles.bottomContinueBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                <Pressable
                  style={({ pressed }) => [
                    styles.continueButton,
                    pressed && styles.continueButtonPressed,
                    isLoadingNext && { opacity: 0.85 },
                  ]}
                  onPress={handleContinueToRecipient}
                  disabled={isLoadingNext}
                >
                  {isLoadingNext ? (
                    <ActivityIndicator size="small" color="#111111" />
                  ) : (
                    <Text style={styles.continueButtonText}>Continuer</Text>
                  )}
                </Pressable>
              </View>
            )}
          </View>
        </Animated.View>
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
  closeButton: {
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

  // Barre de progression unique continue
  progressTrack: {
    height: 4,
    backgroundColor: '#ECECE8',
    borderRadius: 2,
    marginHorizontal: 20,
    marginBottom: 14,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: authColors.yellow,
    borderRadius: 2,
  },

  // Viewport & Slider Track pour glissement horizontal
  sliderViewport: {
    flex: 1,
    overflow: 'hidden',
  },
  sliderTrack: {
    flexDirection: 'row',
    width: SCREEN_WIDTH * 2,
    flex: 1,
  },
  slidePanel: {
    width: SCREEN_WIDTH,
    flex: 1,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  introHeader: {
    paddingTop: 4,
    gap: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -0.4,
  },
  description: {
    fontSize: 14.5,
    color: '#6E6E68',
    lineHeight: 21,
  },

  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F5F5F3',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1,
    borderColor: '#ECECE8',
    marginTop: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111111',
  },

  categoryFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: '#F5F5F3',
    borderWidth: 1,
    borderColor: '#ECECE8',
  },
  categoryChipActive: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6E6E68',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },

  resultsRow: {
    marginTop: 6,
    paddingHorizontal: 2,
  },
  resultsTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
  },

  // Lignes épurées (SANS cartes blanches superposées)
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0ED',
  },
  rowItemSelected: {
    backgroundColor: '#F5F5F3',
    borderRadius: 14,
    paddingHorizontal: 10,
  },
  rowItemPressed: {
    backgroundColor: '#FAFAF8',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  info: {
    gap: 3,
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  methodName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.2,
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  popularText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  methodSubtext: {
    fontSize: 13,
    color: '#767670',
    fontWeight: '500',
  },
  deliveryText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#666660',
    marginTop: 2,
  },
  rowRight: {
    marginLeft: 10,
    paddingRight: 4,
  },
  selectedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#111111',
  },
  unselectedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D4D4D0',
    backgroundColor: '#FFFFFF',
  },

  // Bottom Continue Bar
  bottomContinueBar: {
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
  continueButton: {
    backgroundColor: authColors.yellow,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.9,
  },
  continueButtonText: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -0.2,
  },

  // Empty State Point Relais
  emptyRelayBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    gap: 8,
    backgroundColor: '#FAFAF8',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ECECE8',
    marginTop: 10,
  },
  emptyRelayTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
    marginTop: 4,
  },
  emptyRelaySub: {
    fontSize: 13,
    color: '#767670',
    textAlign: 'center',
    lineHeight: 18,
  },

  // Subdivision Headers
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
});
