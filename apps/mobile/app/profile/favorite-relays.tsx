import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  Compass,
  PhoneCall,
  Clock,
  Trash,
  NavigationArrow,
  Storefront,
} from 'phosphor-react-native';
import { authColors } from '../../src/components/auth/AuthUi';
import { useUserSettingsStore } from '../../src/stores/userSettingsStore';

// Données statiques de référence d'agences réelles
const ALL_RELAYS = [
  {
    id: 'casa-voyageurs',
    name: 'Casa Voyageurs (Agence Partenaire)',
    country: 'Maroc',
    city: 'Casablanca',
    address: 'Boulevard Bahmad, Face Gare Casa Voyageurs',
    phone: '+212 5 22 24 10 30',
    hours: '08:00 - 20:30 (7j/7)',
  },
];

export default function FavoriteRelaysScreen() {
  const insets = useSafeAreaInsets();
  const { favoriteRelayIds, toggleFavoriteRelay } = useUserSettingsStore();

  const favoriteAgencies = ALL_RELAYS.filter((r) => favoriteRelayIds.includes(r.id));

  return (
    <View style={styles.screen}>
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 14) }]}>
        <View style={styles.topRow}>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
            onPress={() => router.back()}
            accessibilityLabel="Retour"
            hitSlop={10}
          >
            <ArrowLeft size={22} color="#111111" weight="bold" />
          </Pressable>
          <Text style={styles.headerTitle}>Points de relais favoris</Text>
          <View style={{ width: 42 }} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {favoriteAgencies.length === 0 ? (
          /* ── ÉTAT INITIAL VIDE (0 données moquées) ── */
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconCircle}>
              <Storefront size={34} color="#8E8E87" weight="regular" />
            </View>
            <Text style={styles.emptyTitle}>Aucun point de relais favori</Text>
            <Text style={styles.emptyDesc}>
              Enregistrez vos agences de dépôt et de retrait préférées pour les retrouver rapidement lors de vos prochains échanges.
            </Text>
            <Pressable
              style={({ pressed }) => [styles.exploreBtn, pressed && styles.btnPressed]}
              onPress={() => router.push('/(tabs)/relay')}
              accessibilityRole="button"
            >
              <Compass size={19} color="#111111" weight="bold" />
              <Text style={styles.exploreBtnText}>Explorer les points de relais</Text>
            </Pressable>
          </View>
        ) : (
          /* ── LISTE DES FAVORIS RÉELS ── */
          <View style={styles.relaysList}>
            {favoriteAgencies.map((agency) => (
              <View key={agency.id} style={styles.relayCard}>
                <View style={styles.relayTopRow}>
                  <View style={styles.relayIconBox}>
                    <MapPin size={22} color="#111111" weight="fill" />
                  </View>
                  <View style={styles.relayTitleWrap}>
                    <Text style={styles.relayName}>{agency.name}</Text>
                    <Text style={styles.relayCity}>{agency.city}, {agency.country}</Text>
                  </View>
                  <Pressable
                    style={styles.deleteBtn}
                    onPress={() => toggleFavoriteRelay(agency.id)}
                    hitSlop={8}
                    accessibilityLabel="Retirer des favoris"
                  >
                    <Trash size={18} color="#EF4444" weight="bold" />
                  </Pressable>
                </View>

                <View style={styles.relayDivider} />

                <View style={styles.relayMetaRows}>
                  <View style={styles.metaRow}>
                    <MapPin size={16} color="#7E7E78" />
                    <Text style={styles.metaText}>{agency.address}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Clock size={16} color="#7E7E78" />
                    <Text style={styles.metaText}>{agency.hours}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <PhoneCall size={16} color="#7E7E78" />
                    <Text style={styles.metaText}>{agency.phone}</Text>
                  </View>
                </View>
              </View>
            ))}

            <Pressable
              style={({ pressed }) => [styles.addMoreBtn, pressed && styles.btnPressed]}
              onPress={() => router.push('/(tabs)/relay')}
            >
              <Compass size={18} color="#111111" weight="bold" />
              <Text style={styles.addMoreBtnText}>Trouver d'autres agences</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F3',
  },
  header: {
    backgroundColor: authColors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEC',
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F5F5F3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E4',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
  },
  btnPressed: {
    opacity: 0.84,
    transform: [{ scale: 0.98 }],
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  emptyCard: {
    backgroundColor: authColors.white,
    borderRadius: 20,
    padding: 26,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#EEEEEC',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginTop: 24,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#F5F5F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 17.5,
    fontWeight: '800',
    color: '#111111',
  },
  emptyDesc: {
    fontSize: 13.5,
    lineHeight: 20,
    fontWeight: '500',
    color: '#7E7E78',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  exploreBtn: {
    backgroundColor: authColors.yellow,
    borderRadius: 24,
    height: 50,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    shadowColor: authColors.yellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
  },
  exploreBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#111111',
  },

  relaysList: {
    gap: 14,
  },
  relayCard: {
    backgroundColor: authColors.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EEEEEC',
    gap: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  relayTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  relayIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 229, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  relayTitleWrap: {
    flex: 1,
    gap: 2,
  },
  relayName: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#111111',
  },
  relayCity: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6E6E68',
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  relayDivider: {
    height: 1,
    backgroundColor: '#F0F0EC',
  },
  relayMetaRows: {
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#444440',
    flex: 1,
  },

  addMoreBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    height: 50,
    borderWidth: 1.5,
    borderColor: '#E8E8E4',
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  addMoreBtnText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#111111',
  },
});
