import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  CaretRight,
  Check,
  MagnifyingGlass,
  MapPin,
} from 'phosphor-react-native';
import { authColors } from '../../src/components/auth/AuthUi';
import { useTransferStore } from '../../src/stores/transferStore';
import { OperatorLogo } from '../../src/components/transfer/OperatorLogo';

type OperatorItem = {
  id: string;
  name: string;
  category: 'cash' | 'bank' | 'mobile' | 'relay';
  categoryLabel: string;
  deliveryTime: string;
  subtext: string;
  isPopular?: boolean;
};

// ── BANQUES ET SERVICES MAROC PAR ORDRE EXACT DU CLIENT ──
const MAROC_SERVICES: OperatorItem[] = [
  {
    id: 'cashplus',
    name: 'Cash Plus',
    category: 'cash',
    categoryLabel: 'Retrait Espèces',
    deliveryTime: 'En quelques minutes',
    subtext: 'Retrait d’espèces',
    isPopular: true,
  },
  {
    id: 'wafacash',
    name: 'Wafacash',
    category: 'cash',
    categoryLabel: 'Retrait Espèces',
    deliveryTime: 'En quelques minutes',
    subtext: 'Retrait d’espèces',
    isPopular: true,
  },
  {
    id: 'cih',
    name: 'CIH Bank',
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
    categoryLabel: 'Virement Bancaire',
    deliveryTime: 'En quelques minutes',
    subtext: 'Crédit direct sur compte bancaire Attijariwafa',
    isPopular: false,
  },
  {
    id: 'banque_populaire',
    name: 'Banque Populaire (BCP)',
    category: 'bank',
    categoryLabel: 'Virement Bancaire',
    deliveryTime: 'En quelques minutes',
    subtext: 'Virement sur compte BCP & réseau Chaabi Cash',
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

// ── SERVICES ET OPÉRATEURS CEMAC / RDC ──
const CEMAC_SERVICES: OperatorItem[] = [
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

export default function OperatorsScreen() {
  const insets = useSafeAreaInsets();
  const { direction, selectedOperator, setSelectedOperator } = useTransferStore();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'bank' | 'cash' | 'relay'>('all');

  const isCemacToMaroc = direction === 'cemac_to_maroc';
  const allServices = isCemacToMaroc ? MAROC_SERVICES : CEMAC_SERVICES;

  const filtered = allServices.filter((s) => {
    const matchCat = filterCategory === 'all' || s.category === filterCategory;
    const matchSearch =
      search.trim() === '' ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.subtext.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSelect = (op: OperatorItem) => {
    setSelectedOperator(op.name);
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ── 1. Top Bar & Progression ── */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={10}>
          <ArrowLeft size={22} color="#111111" weight="bold" />
        </Pressable>
        <Text style={styles.headerTitle}>Mode de réception</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Barre de progression */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarActive} />
        <View style={styles.progressBarActive} />
        <View style={styles.progressBarInactive} />
      </View>

      {/* ── 2. Liste Déroulante avec Filtres et Logos ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
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
                value={search}
                onChangeText={setSearch}
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
                  const isActive = filterCategory === c.id;
                  return (
                    <Pressable
                      key={c.id}
                      style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                      onPress={() => setFilterCategory(c.id)}
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
                {filterCategory === 'relay'
                  ? 'Points Relais (0)'
                  : `Services disponibles (${filtered.length})`}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          filterCategory === 'relay' ? (
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
          return (
            <Pressable
              style={({ pressed }) => [
                styles.serviceCard,
                isSelected && styles.serviceCardSelected,
                pressed && styles.serviceCardPressed,
              ]}
              onPress={() => handleSelect(item)}
            >
              {/* Gauche : Logo Réel HD + Infos */}
              <View style={styles.cardLeft}>
                <OperatorLogo id={item.id} size={50} />

                <View style={styles.info}>
                  <View style={styles.titleRow}>
                    <Text style={styles.serviceName}>{item.name}</Text>
                    {item.isPopular && (
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularText}>POPULAIRE</Text>
                      </View>
                    )}
                  </View>

                  {/* Délai de réception */}
                  <Text style={styles.deliveryText}>{item.deliveryTime}</Text>
                </View>
              </View>

              {/* Droite : Checkbox Noir & Blanc */}
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
    gap: 12,
  },
  introHeader: {
    paddingTop: 4,
    gap: 10,
    marginBottom: 8,
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

  // Barre de recherche
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

  // Filtres
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

  // Cartes Services / Banques
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.25,
    borderColor: '#ECECE8',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  serviceCardSelected: {
    borderColor: '#111111',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    shadowOpacity: 0.06,
  },
  serviceCardPressed: {
    transform: [{ scale: 0.99 }],
    backgroundColor: '#FAFAF8',
  },
  cardLeft: {
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
  serviceName: {
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
  serviceSubtext: {
    fontSize: 13,
    color: '#767670',
    fontWeight: '500',
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  dotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#666660',
  },
  deliveryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666660',
  },
  cardRight: {
    marginLeft: 10,
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
    borderColor: '#D0D0CB',
    backgroundColor: '#FFFFFF',
  },
});
