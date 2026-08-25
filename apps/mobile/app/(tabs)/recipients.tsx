import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  MagnifyingGlass,
  Plus,
  ArrowUpRight,
  Bell,
  Users,
} from 'phosphor-react-native';
import { authColors } from '../../src/components/auth/AuthUi';
import { useTransferStore } from '../../src/stores/transferStore';
import { COUNTRIES } from '../../src/data/countries';
import { CountryFlagCircle } from '../../src/components/ui/CountryFlagCircle';

type Recipient = {
  id: string;
  name: string;
  countryName: string;
  flag: string;
  iso: string;
  phone: string;
};

// Initialisation à zéro (0 mock data)
const RECIPIENTS_DATA: Recipient[] = [];

export default function RecipientsScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const { setDestinationCountry, setSourceCountry } = useTransferStore();

  const filtered = RECIPIENTS_DATA.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.countryName.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.includes(search)
  );

  const handleSendToRecipient = (recipient: Recipient) => {
    const country = COUNTRIES.find((c) => c.iso === recipient.iso);
    if (country) {
      if (country.iso === 'MA') {
        const cm = COUNTRIES.find((c) => c.iso === 'CM') || COUNTRIES[0];
        setSourceCountry(cm);
        setDestinationCountry(country);
      } else {
        const ma = COUNTRIES.find((c) => c.iso === 'MA') || COUNTRIES[COUNTRIES.length - 1];
        setSourceCountry(ma);
        setDestinationCountry(country);
      }
    }
    router.push('/(tabs)/');
  };

  return (
    <View style={styles.screen}>
      {/* ── 1. Header Jaune Optimal ── */}
      <View style={[styles.yellowHeader, { paddingTop: Math.max(insets.top, 14) }]}>
        {/* Top Bar : Cloche à gauche + Gros Favicon à droite */}
        <View style={styles.topBar}>
          <Pressable
            style={styles.notifButton}
            onPress={() => router.push('/notifications')}
            accessibilityLabel="Notifications"
            hitSlop={10}
          >
            <Bell size={24} color="#111111" weight="bold" />
            <View style={styles.notifDot} />
          </Pressable>

          <View style={styles.largeFaviconCircle}>
            <Image
              source={require('../../assets/favicon.jpg')}
              style={styles.largeFaviconImage}
              contentFit="contain"
              transition={150}
              cachePolicy="memory-disk"
            />
          </View>
        </View>

        {/* Titre & Sous-titre */}
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Bénéficiaires</Text>
          <Text style={styles.headerSubtitle}>
            Gérez vos contacts et échangez en un clin d’œil.
          </Text>
        </View>
      </View>

      {/* ── 2. Corps Déroulant : Recherche + Bouton Ajouter + Liste / Empty State ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.controlsHeader}>
            {/* Barre de recherche blanche et épurée */}
            <View style={styles.searchCard}>
              <MagnifyingGlass size={20} color="#8A8A85" weight="bold" />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher par nom, numéro ou pays..."
                placeholderTextColor="#9E9E98"
                value={search}
                onChangeText={setSearch}
              />
            </View>

            {/* Gros Bouton Visible « Ajouter » */}
            <Pressable
              style={({ pressed }) => [
                styles.addMainButton,
                pressed && styles.addMainButtonPressed,
              ]}
              accessibilityRole="button"
            >
              <Plus size={20} color="#000000" weight="bold" />
              <Text style={styles.addMainButtonText}>Ajouter un bénéficiaire</Text>
            </Pressable>

            {/* Titre de section */}
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Mes contacts</Text>
              <Text style={styles.sectionCount}>{filtered.length} {filtered.length <= 1 ? 'enregistré' : 'enregistrés'}</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Users size={32} color="#8E8E87" weight="regular" />
            </View>
            <Text style={styles.emptyTitle}>Aucun bénéficiaire enregistré</Text>
            <Text style={styles.emptyText}>
              Ajoutez vos proches pour échanger de l’argent encore plus rapidement.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => handleSendToRecipient(item)}
          >
            {/* Gauche : Avatar + Infos */}
            <View style={styles.cardLeft}>
              <View style={styles.avatarWrap}>
                <Text style={styles.avatarText}>
                  {item.name.slice(0, 1).toUpperCase()}
                </Text>
                <View style={styles.flagPill}>
                  <CountryFlagCircle iso={item.iso} size={18} />
                </View>
              </View>

              <View style={styles.infoBlock}>
                <Text style={styles.recipientName}>{item.name}</Text>
                <Text style={styles.recipientPhone}>{item.phone}</Text>
              </View>
            </View>

            {/* Droite : Bouton Envoyer */}
            <View style={styles.sendActionBtn}>
              <ArrowUpRight size={18} color="#111111" weight="bold" />
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F3',
  },

  // 1. Header Jaune Optimal
  yellowHeader: {
    backgroundColor: authColors.yellow,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  notifDot: {
    position: 'absolute',
    top: 11,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  largeFaviconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  largeFaviconImage: {
    width: '100%',
    height: '100%',
  },
  headerTitleWrap: {
    gap: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444440',
    lineHeight: 19,
  },

  // 2. Contrôles & Liste
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 36,
  },
  controlsHeader: {
    gap: 14,
    marginBottom: 12,
  },

  // Barre de recherche
  searchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
    borderWidth: 1,
    borderColor: '#EEEEEC',
  },
  searchInput: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '600',
    color: '#111111',
    padding: 0,
  },

  // Bouton Ajouter
  addMainButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#EEEEEC',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  addMainButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  addMainButtonText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#111111',
  },

  // Titre section
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111111',
  },
  sectionCount: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#8E8E87',
  },

  // Empty State
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#EEEEEC',
    marginTop: 8,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#767670',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },

  // Carte Contact
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EEEEEC',
    marginBottom: 10,
  },
  cardPressed: {
    backgroundColor: '#FAFAF8',
    transform: [{ scale: 0.99 }],
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECECE8',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
  },
  flagPill: {
    position: 'absolute',
    bottom: -2,
    right: -4,
  },
  infoBlock: {
    gap: 2,
    flex: 1,
  },
  recipientName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
  },
  recipientPhone: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#6E6E68',
  },
  sendActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
