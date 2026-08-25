import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { MagnifyingGlass, X } from 'phosphor-react-native';
import { CountryFlagCircle } from './CountryFlagCircle';
import { COUNTRIES, Country } from '../../data/countries';

type CountryPickerModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (country: Country) => void;
  title?: string;
  selectedIso?: string;
  allowedCountries?: Country[];
};

export function CountryPickerModal({
  visible,
  onClose,
  onSelect,
  title = "Sélectionnez d'où vous voulez recevoir de l'argent",
  selectedIso,
  allowedCountries,
}: CountryPickerModalProps) {
  const [search, setSearch] = useState('');

  const list = allowedCountries || COUNTRIES;

  // Ordre officiel : Gabon, Cameroun, Congo, Maroc
  const popularIsos = ['GA', 'CM', 'CG', 'MA'];
  
  const popularCountries = popularIsos
    .map((iso) => list.find((c) => c.iso === iso))
    .filter((c): c is Country => Boolean(c));

  const otherCountries = list.filter((c) => !popularIsos.includes(c.iso));

  // Filtrage lors de la recherche
  const query = search.trim().toLowerCase();
  const searchResults = query
    ? list.filter((c) => c.name.toLowerCase().includes(query) || c.code.includes(query))
    : null;

  const handleCountryPress = (country: Country) => {
    onSelect(country);
    setSearch('');
    onClose();
  };

  const handleCloseModal = () => {
    setSearch('');
    onClose();
  };

  const renderCountryRow = (country: Country) => {
    const isSelected = selectedIso === country.iso;
    return (
      <Pressable
        key={country.iso}
        style={({ pressed }) => [
          styles.countryRow,
          pressed && styles.countryRowPressed,
        ]}
        onPress={() => handleCountryPress(country)}
        accessibilityRole="button"
        accessibilityLabel={country.name}
      >
        <CountryFlagCircle iso={country.iso} size={32} />
        <Text style={[styles.countryName, isSelected && styles.countryNameSelected]}>
          {country.name}
        </Text>
      </Pressable>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCloseModal}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.dismissOverlay} onPress={handleCloseModal} />

        <View style={styles.sheetContainer}>
          {/* ── Poignée de glissement (Drag Handle) ── */}
          <View style={styles.handleWrap}>
            <View style={styles.dragHandle} />
          </View>

          {/* ── Bouton Fermer X ── */}
          <Pressable
            style={styles.closeBtn}
            onPress={handleCloseModal}
            accessibilityLabel="Fermer"
            hitSlop={12}
          >
            <X size={20} color="#111111" weight="bold" />
          </Pressable>

          {/* ── Titre Principal Sobre & Pro ── */}
          <Text style={styles.title}>{title}</Text>

          {/* ── Barre de recherche avec ligne inférieure épurée ── */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un pays"
              placeholderTextColor="#9A9A94"
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
            <MagnifyingGlass size={20} color="#0055AA" weight="bold" />
          </View>

          {/* ── Liste des pays ── */}
          <ScrollView
            style={styles.scrollList}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {searchResults ? (
              // ── Résultat de recherche ──
              <View style={styles.sectionWrap}>
                <Text style={styles.sectionHeader}>Résultats ({searchResults.length})</Text>
                {searchResults.length > 0 ? (
                  searchResults.map(renderCountryRow)
                ) : (
                  <Text style={styles.emptyText}>Aucun pays trouvé</Text>
                )}
              </View>
            ) : (
              // ── Vue Catégorisée Standard Western Union ──
              <>
                {/* 1. Pays les plus populaires */}
                <View style={styles.sectionWrap}>
                  <Text style={styles.sectionHeader}>Pays les plus populaires</Text>
                  {popularCountries.map(renderCountryRow)}
                </View>

                {/* 2. Tous les pays ou régions */}
                {otherCountries.length > 0 && (
                  <View style={[styles.sectionWrap, { marginTop: 24 }]}>
                    <Text style={styles.sectionHeader}>Tous les pays ou régions</Text>
                    {otherCountries.map(renderCountryRow)}
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  dismissOverlay: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 22,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '85%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  handleWrap: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  dragHandle: {
    width: 44,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: '#DCDCD6',
  },
  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 22,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F3',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
    marginTop: 14,
    marginBottom: 16,
    paddingRight: 40,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E6E6E0',
    paddingVertical: 8,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 15.5,
    fontWeight: '500',
    color: '#111111',
    paddingVertical: 4,
    marginRight: 10,
  },
  scrollList: {
    maxHeight: 480,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionWrap: {
    gap: 16,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 2,
    letterSpacing: -0.1,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 7,
  },
  countryRowPressed: {
    opacity: 0.7,
  },
  countryName: {
    fontSize: 15.5,
    fontWeight: '600',
    color: '#004797', // Bleu Western Union officiel et chaleureux
  },
  countryNameSelected: {
    fontWeight: '800',
    color: '#002B66',
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E87',
    fontStyle: 'italic',
    paddingVertical: 12,
  },
});
