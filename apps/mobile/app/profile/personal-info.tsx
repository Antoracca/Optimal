import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  User,
  EnvelopeSimple,
  Phone,
  MapPin,
  CalendarBlank,
  CheckCircle,
  CaretDown,
} from 'phosphor-react-native';
import { authColors } from '../../src/components/auth/AuthUi';
import { useUserSettingsStore } from '../../src/stores/userSettingsStore';
import { useRegistrationStore } from '../../src/stores/registration';
import { CountryFlagCircle } from '../../src/components/ui/CountryFlagCircle';
import { CountryPickerModal } from '../../src/components/ui/CountryPickerModal';
import { COUNTRIES, Country, formatPhoneForCountry } from '../../src/data/countries';

export default function PersonalInfoScreen() {
  const insets = useSafeAreaInsets();
  const regStore = useRegistrationStore();
  const { profile, setProfile } = useUserSettingsStore();

  // Initialisation à partir du store
  const [firstName, setFirstName] = useState(profile.firstName || regStore.firstName || '');
  const [lastName, setLastName] = useState(profile.lastName || regStore.lastName || '');
  const [email, setEmail] = useState(profile.email || regStore.email || '');
  const [birthDate, setBirthDate] = useState(profile.birthDate || regStore.birthDate || '');
  const [address, setAddress] = useState(profile.address || '');
  const [city, setCity] = useState(profile.city || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Modal sélecteur de pays
  const [countryPickerOpen, setCountryPickerOpen] = useState(false);

  // Pays d'origine sélectionné
  const [selectedCountry, setSelectedCountry] = useState<Country>(() => {
    const fromProfile = COUNTRIES.find((c) => c.iso === profile.countryIso);
    if (fromProfile) return fromProfile;
    const fromDial = COUNTRIES.find((c) => c.code === regStore.dialCode);
    if (fromDial) return fromDial;
    return COUNTRIES[0]; // Gabon par défaut
  });

  // Numéro de téléphone
  const [phone, setPhone] = useState(() => {
    const raw = profile.phone || regStore.phone || '';
    return raw;
  });

  // Changement de pays (nationalité) ➔ Détection et mise à jour automatique de l'indicatif
  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    // Met à jour l'indicatif dans le store d'inscription et recalibre le téléphone
    regStore.update({
      country: country.name,
      dialCode: country.code,
    });
  };

  const handlePhoneChange = (raw: string) => {
    const formatted = formatPhoneForCountry(raw, selectedCountry);
    setPhone(formatted);
  };

  const handleSave = () => {
    setProfile({
      firstName,
      lastName,
      email,
      phone,
      countryIso: selectedCountry.iso,
      birthDate,
      address,
      city,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <View style={styles.screen}>
      {/* ── 1. HEADER JAUNE OPTIMAL UNIFIÉ ── */}
      <View style={[styles.yellowHeader, { paddingTop: Math.max(insets.top, 14) }]}>
        <View style={styles.topBar}>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
            onPress={() => router.back()}
            accessibilityLabel="Retour"
            hitSlop={10}
          >
            <ArrowLeft size={22} color="#111111" weight="bold" />
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

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Informations personnelles</Text>
          <Text style={styles.headerSubtitle}>
            Consultez et mettez à jour vos données de profil.
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Feedback Succès */}
        {savedSuccess && (
          <View style={styles.successBanner}>
            <CheckCircle size={20} color="#10B981" weight="fill" />
            <Text style={styles.successBannerText}>Informations mises à jour avec succès.</Text>
          </View>
        )}

        {/* ── 1. SOUS-SECTION : IDENTITÉ LÉGALE ── */}
        <View style={styles.cardSection}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconWrap}>
              <User size={18} color="#111111" weight="bold" />
            </View>
            <Text style={styles.sectionTitle}>Identité légale</Text>
          </View>

          <View style={styles.fieldsWrap}>
            {/* Prénom */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Prénom</Text>
              <TextInput
                style={styles.textInput}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Votre prénom"
                placeholderTextColor="#9E9E98"
              />
            </View>

            {/* Nom */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Nom</Text>
              <TextInput
                style={styles.textInput}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Votre nom de famille"
                placeholderTextColor="#9E9E98"
              />
            </View>

            {/* Date de naissance */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Date de naissance (JJ/MM/AAAA)</Text>
              <View style={styles.inputWithIconRow}>
                <CalendarBlank size={19} color="#7E7E78" weight="regular" />
                <TextInput
                  style={styles.textInputInside}
                  value={birthDate}
                  onChangeText={setBirthDate}
                  placeholder="Ex: 14/08/1995"
                  placeholderTextColor="#9E9E98"
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>
            </View>

            {/* Nationalité / Pays d'origine avec sélecteur interactif */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Nationalité / Pays d’origine</Text>
              <Pressable
                style={({ pressed }) => [
                  styles.countrySelectButton,
                  pressed && styles.countrySelectButtonPressed,
                ]}
                onPress={() => setCountryPickerOpen(true)}
                accessibilityRole="button"
                accessibilityLabel="Sélectionner le pays d'origine"
              >
                <View style={styles.countrySelectLeft}>
                  <CountryFlagCircle iso={selectedCountry.iso} size={26} />
                  <Text style={styles.countrySelectName}>{selectedCountry.name}</Text>
                </View>
                <CaretDown size={18} color="#666660" weight="bold" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* ── 2. SOUS-SECTION : COORDONNÉES DE CONTACT ── */}
        <View style={styles.cardSection}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconWrap}>
              <EnvelopeSimple size={18} color="#111111" weight="bold" />
            </View>
            <Text style={styles.sectionTitle}>Coordonnées de contact</Text>
          </View>

          <View style={styles.fieldsWrap}>
            {/* Adresse E-mail */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Adresse e-mail</Text>
              <View style={styles.inputWithIconRow}>
                <EnvelopeSimple size={19} color="#7E7E78" weight="regular" />
                <TextInput
                  style={styles.textInputInside}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="vous@exemple.com"
                  placeholderTextColor="#9E9E98"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Numéro de téléphone avec indicatif automatique selon le pays */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Numéro de téléphone</Text>
              <View style={styles.phoneInputRow}>
                <View style={styles.dialBadge}>
                  <Text style={styles.dialBadgeText}>{selectedCountry.code}</Text>
                </View>
                <TextInput
                  style={styles.phoneInputInside}
                  value={phone}
                  onChangeText={handlePhoneChange}
                  placeholder={selectedCountry.example || '62 12 34 56'}
                  placeholderTextColor="#9E9E98"
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>
        </View>

        {/* ── 3. SOUS-SECTION : ADRESSE DE RÉSIDENCE ── */}
        <View style={styles.cardSection}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconWrap}>
              <MapPin size={18} color="#111111" weight="bold" />
            </View>
            <Text style={styles.sectionTitle}>Adresse de résidence</Text>
          </View>

          <View style={styles.fieldsWrap}>
            {/* Adresse */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Adresse postale</Text>
              <TextInput
                style={styles.textInput}
                value={address}
                onChangeText={setAddress}
                placeholder="Rue, quartier, numéro"
                placeholderTextColor="#9E9E98"
              />
            </View>

            {/* Ville */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Ville</Text>
              <TextInput
                style={styles.textInput}
                value={city}
                onChangeText={setCity}
                placeholder="Ex: Libreville, Douala, Casablanca"
                placeholderTextColor="#9E9E98"
              />
            </View>
          </View>
        </View>

        {/* ── Bouton Enregistrer Épuré ── */}
        <Pressable
          style={({ pressed }) => [styles.saveBtn, pressed && styles.btnPressed]}
          onPress={handleSave}
          accessibilityRole="button"
        >
          <Text style={styles.saveBtnText}>Enregistrer</Text>
        </Pressable>
      </ScrollView>

      {/* Modal Sélecteur de Pays (Identique à la page d'accueil) */}
      <CountryPickerModal
        visible={countryPickerOpen}
        onClose={() => setCountryPickerOpen(false)}
        onSelect={handleSelectCountry}
        title="Sélectionnez votre pays"
        selectedIso={selectedCountry.iso}
        allowedCountries={COUNTRIES}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F3',
  },

  // 1. Header Jaune Optimal Unifié
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
  backBtn: {
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
  btnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
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

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },

  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  successBannerText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#065F46',
    flex: 1,
  },

  cardSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEC',
    gap: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F5F5F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
  },

  fieldsWrap: {
    gap: 12,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#555550',
  },
  textInput: {
    backgroundColor: '#F9F9F8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E6E2',
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14.5,
    fontWeight: '600',
    color: '#111111',
  },
  inputWithIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E6E2',
    paddingHorizontal: 12,
    height: 48,
    gap: 10,
  },
  textInputInside: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '600',
    color: '#111111',
    padding: 0,
  },

  // Sélecteur de pays
  countrySelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9F9F8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E6E2',
    paddingHorizontal: 14,
    height: 48,
  },
  countrySelectButtonPressed: {
    backgroundColor: '#F0F0ED',
  },
  countrySelectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  countrySelectName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#111111',
  },

  // Input Téléphone avec badge indicatif
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E6E2',
    height: 48,
    overflow: 'hidden',
  },
  dialBadge: {
    backgroundColor: '#EEEEEC',
    paddingHorizontal: 12,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E6E6E2',
  },
  dialBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
  },
  phoneInputInside: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '600',
    color: '#111111',
    paddingHorizontal: 12,
  },

  saveBtn: {
    backgroundColor: authColors.yellow,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -0.2,
  },
});
