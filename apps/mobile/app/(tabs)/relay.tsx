import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Image,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Bell,
  MagnifyingGlass,
  MapPin,
  NavigationArrow,
  PhoneCall,
  Clock,
  CaretDown,
  X,
  Check,
} from 'phosphor-react-native';
import { authColors } from '../../src/components/auth/AuthUi';

type PartnerAgency = {
  id: string;
  name: string;
  partnerType: string;
  countryIso: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  distance: string;
};

type CountryInfo = {
  iso: string;
  name: string;
  currency: string;
  cities: string[];
};

const CORRIDOR_COUNTRIES: CountryInfo[] = [
  { iso: 'MA', name: 'Maroc', currency: 'MAD', cities: ['Toutes', 'Casablanca', 'Rabat', 'Marrakech', 'Tanger'] },
  { iso: 'CM', name: 'Cameroun', currency: 'XAF', cities: ['Toutes', 'Douala', 'Yaoundé'] },
  { iso: 'GA', name: 'Gabon', currency: 'XAF', cities: ['Toutes', 'Libreville', 'Port-Gentil'] },
  { iso: 'CG', name: 'Congo', currency: 'XAF', cities: ['Toutes', 'Brazzaville', 'Pointe-Noire'] },
  { iso: 'CD', name: 'RDC (Congo)', currency: 'USD/CDF', cities: ['Toutes', 'Kinshasa'] },
  { iso: 'TD', name: 'Tchad', currency: 'XAF', cities: ['Toutes', 'N’Djaména'] },
  { iso: 'CF', name: 'RCA', currency: 'XAF', cities: ['Toutes', 'Bangui'] },
  { iso: 'GQ', name: 'Guinée Équatoriale', currency: 'XAF', cities: ['Toutes', 'Malabo'] },
];

// Uniquement Casa Voyageurs
const AGENCIES: PartnerAgency[] = [
  {
    id: 'casa-voyageurs',
    name: 'Casa Voyageurs',
    partnerType: 'Agence Partenaire',
    countryIso: 'MA',
    city: 'Casablanca',
    address: 'Boulevard Bahmad, Face Gare Casa Voyageurs',
    phone: '+212 5 22 24 10 30',
    hours: '08:00 - 20:30',
    distance: '350 m',
  },
];

export default function RelayScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo>(CORRIDOR_COUNTRIES[0]);
  const [selectedCity, setSelectedCity] = useState('Toutes');
  const [search, setSearch] = useState('');
  const [modalCountryVisible, setModalCountryVisible] = useState(false);

  const filteredAgencies = AGENCIES.filter((agency) => {
    const matchCountry = agency.countryIso === selectedCountry.iso;
    const matchCity = selectedCity === 'Toutes' || agency.city.toLowerCase() === selectedCity.toLowerCase();
    const matchSearch =
      search.trim() === '' ||
      agency.name.toLowerCase().includes(search.toLowerCase()) ||
      agency.address.toLowerCase().includes(search.toLowerCase()) ||
      agency.city.toLowerCase().includes(search.toLowerCase());

    return matchCountry && matchCity && matchSearch;
  });

  return (
    <View style={styles.screen}>
      {/* ── 1. Header Jaune Optimal Cohérent ── */}
      <View style={[styles.yellowHeader, { paddingTop: Math.max(insets.top, 14) }]}>
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
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Points de Relais</Text>
          <Text style={styles.headerSubtitle}>
            Consultez les agences partenaires disponibles.
          </Text>
        </View>
      </View>

      {/* ── 2. Corps Déroulant ── */}
      <FlatList
        data={filteredAgencies}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.controlsSection}>
            {/* ── A. BARRE DE RECHERCHE EN HAUT ── */}
            <View style={styles.searchCard}>
              <MagnifyingGlass size={20} color="#8A8A85" weight="bold" />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher une agence, quartier, ville..."
                placeholderTextColor="#9E9E98"
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 && (
                <Pressable onPress={() => setSearch('')}>
                  <X size={18} color="#8A8A85" weight="bold" />
                </Pressable>
              )}
            </View>

            {/* ── B. SÉLECTEUR DE PAYS (Épuré) ── */}
            <Pressable
              style={styles.countryPickerCard}
              onPress={() => setModalCountryVisible(true)}
              accessibilityRole="button"
            >
              <View style={styles.pickerLeft}>
                <View style={styles.iconCircle}>
                  <MapPin size={20} color="#111111" weight="fill" />
                </View>
                <View style={styles.pickerInfo}>
                  <Text style={styles.pickerLabel}>Pays</Text>
                  <Text style={styles.pickerCountryName}>{selectedCountry.name}</Text>
                </View>
              </View>

              <View style={styles.pickerRight}>
                <Text style={styles.changeText}>Changer</Text>
                <CaretDown size={16} color="#6E6E68" weight="bold" />
              </View>
            </Pressable>

            {/* ── C. Filtre de Villes ── */}
            <View style={styles.cityFilterWrap}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={selectedCountry.cities}
                keyExtractor={(item) => item}
                contentContainerStyle={styles.cityScroll}
                renderItem={({ item }) => {
                  const isSelected = selectedCity === item;
                  return (
                    <Pressable
                      style={[styles.cityChip, isSelected && styles.cityChipActive]}
                      onPress={() => setSelectedCity(item)}
                    >
                      <Text style={[styles.cityChipText, isSelected && styles.cityChipTextActive]}>
                        {item}
                      </Text>
                    </Pressable>
                  );
                }}
              />
            </View>

            {/* Titre des résultats */}
            <View style={styles.resultsHeaderRow}>
              <Text style={styles.resultsTitle}>Agences disponibles</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.agencyCard}>
            {/* Haut de la carte : Nom + Distance */}
            <View style={styles.agencyTopRow}>
              <View style={styles.agencyNameWrap}>
                <Text style={styles.agencyName}>{item.name}</Text>
                <Text style={styles.partnerType}>{item.partnerType}</Text>
              </View>
              <View style={styles.distanceBadge}>
                <Text style={styles.distanceText}>{item.distance}</Text>
              </View>
            </View>

            {/* Adresse & Horaires */}
            <View style={styles.agencyAddressWrap}>
              <Text style={styles.agencyAddress}>{item.address} • {item.city}</Text>
              <View style={styles.hoursRow}>
                <Clock size={13} color="#059669" weight="bold" />
                <Text style={styles.hoursText}>Ouvert ({item.hours})</Text>
              </View>
            </View>

            {/* Boutons d'action : Itinéraire & Appeler */}
            <View style={styles.actionsRow}>
              <Pressable style={styles.directionsBtn}>
                <NavigationArrow size={16} color="#000000" weight="bold" />
                <Text style={styles.directionsBtnText}>Itinéraire GPS</Text>
              </Pressable>

              <Pressable style={styles.callBtn}>
                <PhoneCall size={16} color="#111111" weight="bold" />
                <Text style={styles.callBtnText}>Appeler</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      {/* ── Modal de Sélection du Pays ── */}
      <Modal
        visible={modalCountryVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalCountryVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choisir votre pays</Text>
              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => setModalCountryVisible(false)}
              >
                <X size={20} color="#111111" weight="bold" />
              </Pressable>
            </View>

            <FlatList
              data={CORRIDOR_COUNTRIES}
              keyExtractor={(item) => item.iso}
              contentContainerStyle={styles.modalList}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = selectedCountry.iso === item.iso;

                return (
                  <Pressable
                    style={styles.modalCountryItem}
                    onPress={() => {
                      setSelectedCountry(item);
                      setSelectedCity('Toutes');
                      setModalCountryVisible(false);
                    }}
                  >
                    <View style={styles.modalCountryLeft}>
                      <Text style={[styles.modalCountryName, isSelected && styles.modalCountryNameSelected]}>
                        {item.name}
                      </Text>
                    </View>

                    {isSelected ? (
                      <View style={styles.selectedCircle}>
                        <Check size={14} color="#FFFFFF" weight="bold" />
                      </View>
                    ) : (
                      <View style={styles.unselectedCircle} />
                    )}
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F3',
  },

  // Header Jaune
  yellowHeader: {
    backgroundColor: authColors.yellow,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  notifButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  notifDot: {
    position: 'absolute',
    top: 13,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C82127',
  },
  largeFaviconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 7,
  },
  largeFaviconImage: {
    width: 56,
    height: 56,
  },
  headerTitleWrap: {
    marginTop: 18,
    gap: 4,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -0.6,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333330',
  },

  // Contenu défilant
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    gap: 14,
  },
  controlsSection: {
    paddingTop: 16,
    gap: 12,
    marginBottom: 4,
  },

  // Barre de recherche
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 54,
    borderWidth: 1,
    borderColor: '#ECECE8',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15.5,
    color: '#111111',
  },

  // Carte Sélecteur de Pays
  countryPickerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#ECECE8',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  pickerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5F5F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerInfo: {
    gap: 1,
  },
  pickerLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#8E8E87',
  },
  pickerCountryName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
  },
  pickerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6E6E68',
  },

  // Villes
  cityFilterWrap: {
    marginTop: 2,
  },
  cityScroll: {
    gap: 8,
  },
  cityChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECE8',
  },
  cityChipActive: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  cityChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6E6E68',
  },
  cityChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // Résultats
  resultsHeaderRow: {
    marginTop: 6,
    paddingHorizontal: 4,
  },
  resultsTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111111',
  },

  // Carte Agence
  agencyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#ECECE8',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  agencyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  agencyNameWrap: {
    gap: 3,
    flex: 1,
  },
  agencyName: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#111111',
  },
  partnerType: {
    fontSize: 12.5,
    color: '#6E6E68',
    fontWeight: '600',
  },
  distanceBadge: {
    backgroundColor: '#F5F5F3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111111',
  },
  agencyAddressWrap: {
    gap: 4,
  },
  agencyAddress: {
    fontSize: 13.5,
    color: '#555550',
    fontWeight: '500',
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  hoursText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },

  // Actions
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 2,
  },
  directionsBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: authColors.yellow,
    height: 44,
    borderRadius: 14,
  },
  directionsBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000000',
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F5F5F3',
    height: 44,
    borderRadius: 14,
  },
  callBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
  },

  // Modal Pays
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '75%',
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0ED',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalList: {
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  modalCountryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0ED',
  },
  modalCountryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalCountryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444440',
  },
  modalCountryNameSelected: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
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
});
