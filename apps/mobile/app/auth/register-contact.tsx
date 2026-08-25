import React, { useState, useMemo } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { CaretDown, EnvelopeSimple, MagnifyingGlass, Phone, X } from 'phosphor-react-native';
import { AuthPage, authColors, Field, PrimaryAction, TextLink } from '../../src/components/auth/AuthUi';
import { useRegistrationStore } from '../../src/stores/registration';
import { COUNTRIES, Country, formatPhoneForCountry, validatePhone } from '../../src/data/countries';

const isValidEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email.trim());

export default function RegisterContactScreen() {
  const draft = useRegistrationStore();
  const [submitted, setSubmitted] = useState(false);
  const [countryPickerOpen, setCountryPickerOpen] = useState(false);
  const [dialPickerOpen, setDialPickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Trouver le pays actuel correspondant au store
  const selectedCountry = useMemo(() => {
    return (
      COUNTRIES.find((c) => c.name.toLowerCase() === draft.country.toLowerCase()) ||
      COUNTRIES.find((c) => c.code === draft.dialCode) ||
      COUNTRIES[0]
    );
  }, [draft.country, draft.dialCode]);

  // Filtrage des pays pour la recherche
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return COUNTRIES;
    const q = searchQuery.toLowerCase();
    return COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.includes(q) || c.iso.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const phoneDigits = draft.phone.replace(/\D/g, '');
  const isPhoneValid = phoneDigits.length >= 8 && validatePhone(draft.phone, selectedCountry);
  const isEmailValid = isValidEmail(draft.email);

  const phoneError =
    submitted && !isPhoneValid
      ? `Numéro invalide pour ${selectedCountry.name} (ex: ${selectedCountry.example}).`
      : undefined;

  const emailError = submitted && !isEmailValid ? 'Saisissez une adresse e-mail valide.' : undefined;

  const handleCountrySelect = (country: Country) => {
    draft.update({
      country: country.name,
      dialCode: country.code,
    });
    setCountryPickerOpen(false);
    setSearchQuery('');
  };

  const handleDialSelect = (country: Country) => {
    draft.update({
      dialCode: country.code,
    });
    setDialPickerOpen(false);
    setSearchQuery('');
  };

  const handlePhoneChange = (raw: string) => {
    const formatted = formatPhoneForCountry(raw, selectedCountry);
    draft.update({ phone: formatted });
  };

  const continueRegistration = () => {
    setSubmitted(true);
    if (!isPhoneValid || !isEmailValid) return;
    router.push('/auth/register-password');
  };

  return (
    <AuthPage
      title="Comment vous joindre ?"
      description="Nous utiliserons ces coordonnées pour sécuriser votre compte et vous tenir informé."
      onBack={() => router.back()}
      action={<TextLink title="Passer" onPress={() => router.push('/auth/register-password')} />}
      step={2}
      totalSteps={3}
      footer={<PrimaryAction title="Continuer" onPress={continueRegistration} />}
    >
      {/* ── 1. Pays de résidence (Drapeau + Nom, SANS indicatif) ── */}
      <View style={styles.fieldWrap}>
        <Text style={styles.label}>Pays de résidence</Text>
        <Pressable
          style={styles.countryButton}
          onPress={() => {
            setSearchQuery('');
            setCountryPickerOpen(true);
          }}
          accessibilityRole="button"
          accessibilityLabel="Choisir le pays de résidence"
        >
          <View style={styles.countryLeft}>
            <Text style={styles.flagEmoji}>{selectedCountry.flag}</Text>
            <Text style={styles.countryValue}>{selectedCountry.name}</Text>
          </View>
          <CaretDown size={18} color="#4D4D48" weight="bold" />
        </Pressable>
      </View>

      {/* ── 2. Numéro de téléphone (Indicatif & Drapeau intégrés dans le champ) ── */}
      <View style={styles.fieldWrap}>
        <Text style={styles.label}>Numéro de téléphone</Text>
        <View style={[styles.phoneInputRow, phoneError ? styles.phoneInputError : undefined]}>
          {/* Bouton sélecteur d'indicatif avec drapeau */}
          <Pressable
            style={styles.dialSelector}
            onPress={() => {
              setSearchQuery('');
              setDialPickerOpen(true);
            }}
            accessibilityRole="button"
            accessibilityLabel="Changer d'indicatif"
          >
            <Text style={styles.dialFlag}>{selectedCountry.flag}</Text>
            <Text style={styles.dialCodeText}>{draft.dialCode || selectedCountry.code}</Text>
            <CaretDown size={14} color="#555550" weight="bold" />
          </Pressable>

          <View style={styles.dialDivider} />

          {/* Saisie du numéro */}
          <TextInput
            style={styles.phoneTextInput}
            placeholder={selectedCountry.example}
            placeholderTextColor="#92928E"
            value={draft.phone}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            autoComplete="tel"
            returnKeyType="next"
          />
        </View>
        {phoneError ? (
          <Text style={styles.errorText}>{phoneError}</Text>
        ) : (
          <Text style={styles.helperText}>
            Nous vous enverrons un code de confirmation sur ce numéro de téléphone ou par SMS.
          </Text>
        )}
      </View>

      {/* ── 3. Adresse e-mail ── */}
      <Field
        label="Adresse e-mail"
        placeholder="vous@exemple.com"
        value={draft.email}
        onChangeText={(email) => draft.update({ email: email.trimStart() })}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        keyboardType="email-address"
        returnKeyType="done"
        icon={<EnvelopeSimple size={19} color="#65655F" weight="regular" />}
        error={emailError}
      />

      {/* ── Modal Sélection Pays de Résidence ── */}
      <Modal
        visible={countryPickerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setCountryPickerOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Pays de résidence</Text>
              <Pressable
                onPress={() => setCountryPickerOpen(false)}
                style={styles.closeButton}
                accessibilityLabel="Fermer"
              >
                <X size={20} color={authColors.ink} weight="bold" />
              </Pressable>
            </View>

            {/* Barre de recherche */}
            <View style={styles.searchWrap}>
              <MagnifyingGlass size={19} color="#8A8A85" weight="bold" />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un pays..."
                placeholderTextColor="#999995"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </View>

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.iso + item.code}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable style={styles.countryOption} onPress={() => handleCountrySelect(item)}>
                  <View style={styles.optionLeft}>
                    <Text style={styles.optionFlag}>{item.flag}</Text>
                    <Text style={styles.optionName}>{item.name}</Text>
                  </View>
                  {selectedCountry.name === item.name && (
                    <Text style={styles.selectedCheck}>✓</Text>
                  )}
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* ── Modal Sélection Indicatif Téléphonique ── */}
      <Modal
        visible={dialPickerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setDialPickerOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Indicatif pays</Text>
              <Pressable
                onPress={() => setDialPickerOpen(false)}
                style={styles.closeButton}
                accessibilityLabel="Fermer"
              >
                <X size={20} color={authColors.ink} weight="bold" />
              </Pressable>
            </View>

            {/* Barre de recherche */}
            <View style={styles.searchWrap}>
              <MagnifyingGlass size={19} color="#8A8A85" weight="bold" />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un pays ou indicatif..."
                placeholderTextColor="#999995"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </View>

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.iso + item.code}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable style={styles.countryOption} onPress={() => handleDialSelect(item)}>
                  <View style={styles.optionLeft}>
                    <Text style={styles.optionFlag}>{item.flag}</Text>
                    <Text style={styles.optionName}>{item.name}</Text>
                  </View>
                  <Text style={styles.optionCode}>{item.code}</Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </AuthPage>
  );
}

const styles = StyleSheet.create({
  fieldWrap: { gap: 8 },
  label: { color: '#333330', fontSize: 15, lineHeight: 20, fontWeight: '700' },
  countryButton: {
    minHeight: 58,
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1.25,
    borderColor: '#E4E4E0',
    backgroundColor: authColors.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  countryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flagEmoji: {
    fontSize: 24,
  },
  countryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: authColors.ink,
  },

  // Numéro de téléphone avec indicatif intégré
  phoneInputRow: {
    minHeight: 58,
    borderRadius: 14,
    borderWidth: 1.25,
    borderColor: '#E4E4E0',
    backgroundColor: authColors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneInputError: {
    borderColor: authColors.red,
  },
  dialSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: '100%',
  },
  dialFlag: {
    fontSize: 22,
  },
  dialCodeText: {
    fontSize: 17,
    fontWeight: '700',
    color: authColors.ink,
  },
  dialDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E4E4E0',
  },
  phoneTextInput: {
    flex: 1,
    minHeight: 56,
    paddingHorizontal: 14,
    fontSize: 18,
    color: authColors.ink,
  },
  helperText: {
    color: authColors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  errorText: {
    color: authColors.red,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },

  // Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: authColors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    maxHeight: '80%',
    gap: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: authColors.ink,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F3',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F5F5F3',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: authColors.ink,
  },
  countryOption: {
    minHeight: 56,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0ED',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  optionFlag: {
    fontSize: 26,
  },
  optionName: {
    color: authColors.ink,
    fontSize: 18,
    fontWeight: '600',
  },
  optionCode: {
    color: authColors.muted,
    fontSize: 16,
    fontWeight: '700',
  },
  selectedCheck: {
    color: '#10B981',
    fontSize: 20,
    fontWeight: '700',
  },
});
