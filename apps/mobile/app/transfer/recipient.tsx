import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  X,
  User,
  Phone,
  Bank,
  IdentificationCard,
  Users,
  UserPlus,
  MagnifyingGlass,
  ArrowSquareOut,
} from 'phosphor-react-native';
import { authColors } from '../../src/components/auth/AuthUi';
import { useTransferStore } from '../../src/stores/transferStore';
import { OperatorLogo } from '../../src/components/transfer/OperatorLogo';

// Liste de bénéficiaires enregistrés simulés
const SAVED_RECIPIENTS = [
  { id: '1', name: 'Youssef El Amrani', phone: '+212 661 23 45 67', rib: '230 780 4561234567890123 45', city: 'Casablanca' },
  { id: '2', name: 'Fatima Zahra Mansouri', phone: '+212 662 98 76 54', rib: '190 780 9876543210987654 32', city: 'Rabat' },
  { id: '3', name: 'Mohamed Bennani', phone: '+212 663 11 22 33', rib: '007 780 1122334455667788 99', city: 'Marrakech' },
  { id: '4', name: 'Jean-Pierre Ondoa', phone: '+237 699 00 11 22', rib: '', city: 'Douala' },
];

export default function RecipientScreen() {
  const insets = useSafeAreaInsets();
  const {
    direction,
    destinationCountry,
    receiveAmount,
    selectedOperator,
    selectedOperatorId,
    recipient,
    setRecipientInfo,
  } = useTransferStore();

  const [activeTab, setActiveTab] = useState<'new' | 'saved'>('new');
  const [savedSearch, setSavedSearch] = useState('');

  // Form states
  const [firstName, setFirstName] = useState(recipient.firstName || '');
  const [lastName, setLastName] = useState(recipient.lastName || '');
  const [fullName, setFullName] = useState(
    recipient.firstName && recipient.lastName ? `${recipient.firstName} ${recipient.lastName}` : ''
  );
  const [phone, setPhone] = useState(recipient.phone || '');
  const [rib, setRib] = useState(recipient.rib || '');
  const [city, setCity] = useState(recipient.city || '');
  const [saveBeneficiary, setSaveBeneficiary] = useState(recipient.save ?? true);

  const isCemacToMaroc = direction === 'cemac_to_maroc';
  const receiveCurrency = isCemacToMaroc ? 'MAD' : 'XAF';

  // Déterminer le type de réception
  const isBank =
    selectedOperatorId === 'cih' ||
    selectedOperatorId === 'attijari' ||
    selectedOperatorId === 'banque_populaire' ||
    selectedOperatorId === 'bmce' ||
    selectedOperatorId === 'credit_agricole' ||
    selectedOperatorId === 'bmci' ||
    selectedOperatorId === 'bank';

  const isCashPickup =
    selectedOperatorId === 'cashplus' ||
    selectedOperatorId === 'wafacash' ||
    selectedOperatorId === 'relay_deposit' ||
    selectedOperatorId === 'cash';

  // Formatage automatique du RIB (blocs de 4 chiffres)
  const handleRibChange = (text: string) => {
    const raw = text.replace(/[^0-9]/g, '').slice(0, 24);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setRib(formatted);
  };

  // Validation
  const isValid = (() => {
    if (isBank) {
      const cleanRib = rib.replace(/\s+/g, '');
      return (
        fullName.trim().length >= 3 &&
        phone.trim().length >= 8 &&
        (isCemacToMaroc ? cleanRib.length === 24 : cleanRib.length >= 10)
      );
    }
    if (isCashPickup) {
      return (
        firstName.trim().length >= 2 &&
        lastName.trim().length >= 2 &&
        phone.trim().length >= 8
      );
    }
    // Mobile money ou autre
    return fullName.trim().length >= 3 && phone.trim().length >= 8;
  })();

  const handleSelectSaved = (saved: typeof SAVED_RECIPIENTS[0]) => {
    const parts = saved.name.split(' ');
    const fName = parts[0] || '';
    const lName = parts.slice(1).join(' ') || '';

    setFirstName(fName);
    setLastName(lName);
    setFullName(saved.name);
    setPhone(saved.phone);
    if (saved.rib) setRib(saved.rib);
    if (saved.city) setCity(saved.city);

    setRecipientInfo({
      firstName: fName,
      lastName: lName,
      phone: saved.phone,
      rib: saved.rib,
      city: saved.city,
      save: false,
    });

    router.push('/transfer/review');
  };

  const handleContinue = () => {
    if (!isValid) return;

    const fName = isCashPickup ? firstName.trim() : fullName.trim().split(' ')[0] || '';
    const lName = isCashPickup
      ? lastName.trim()
      : fullName.trim().split(' ').slice(1).join(' ') || '';

    setRecipientInfo({
      firstName: fName,
      lastName: lName,
      phone: phone.trim(),
      rib: rib.replace(/\s+/g, ''),
      city: city.trim(),
      save: saveBeneficiary,
    });

    router.push('/transfer/review');
  };

  const filteredSaved = SAVED_RECIPIENTS.filter(
    (s) =>
      s.name.toLowerCase().includes(savedSearch.toLowerCase()) ||
      s.phone.includes(savedSearch)
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ── Top Bar ── */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={10}>
            <ArrowLeft size={24} color="#111111" weight="bold" />
          </Pressable>
          <Text style={styles.headerTitle}>Bénéficiaire</Text>
          <Pressable onPress={() => router.replace('/(tabs)/')} style={styles.closeButton} hitSlop={10}>
            <X size={22} color="#666660" weight="bold" />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 14) }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── 1. En-tête Récapitulatif du Mode et Montant Réception ── */}
          <View style={styles.summaryBadge}>
            <OperatorLogo id={selectedOperatorId || 'bank'} size={48} />
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>
                {selectedOperator || 'Mode de réception'} • {destinationCountry.name}
              </Text>
              <Text style={styles.summaryAmount}>
                {receiveAmount} <Text style={styles.summaryCurrency}>{receiveCurrency}</Text>
              </Text>
            </View>
          </View>

          {/* ── 2. Sélecteur Spacieux : Nouveau ou Enregistré ── */}
          <View style={styles.tabSelector}>
            <Pressable
              style={[styles.tabButton, activeTab === 'new' && styles.tabButtonActive]}
              onPress={() => setActiveTab('new')}
            >
              <UserPlus size={20} color={activeTab === 'new' ? '#111111' : '#8A8A85'} weight="bold" />
              <Text style={[styles.tabText, activeTab === 'new' && styles.tabTextActive]}>
                Nouveau
              </Text>
            </Pressable>

            <Pressable
              style={[styles.tabButton, activeTab === 'saved' && styles.tabButtonActive]}
              onPress={() => setActiveTab('saved')}
            >
              <Users size={20} color={activeTab === 'saved' ? '#111111' : '#8A8A85'} weight="bold" />
              <Text style={[styles.tabText, activeTab === 'saved' && styles.tabTextActive]}>
                Enregistrés ({SAVED_RECIPIENTS.length})
              </Text>
            </Pressable>
          </View>

          {/* ── 3. Contenu de l'onglet actif ── */}
          {activeTab === 'saved' ? (
            <View style={styles.savedSection}>
              {/* Barre de recherche */}
              <View style={styles.searchCard}>
                <MagnifyingGlass size={22} color="#8A8A85" weight="bold" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Rechercher un bénéficiaire..."
                  placeholderTextColor="#9E9E98"
                  value={savedSearch}
                  onChangeText={setSavedSearch}
                />
              </View>

              {filteredSaved.map((item) => (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [styles.savedItem, pressed && styles.savedItemPressed]}
                  onPress={() => handleSelectSaved(item)}
                >
                  <View style={styles.savedAvatar}>
                    <Text style={styles.savedAvatarText}>
                      {item.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.savedInfo}>
                    <Text style={styles.savedName}>{item.name}</Text>
                    <Text style={styles.savedPhone}>{item.phone}</Text>
                  </View>
                  <View style={styles.savedAction}>
                    <ArrowSquareOut size={22} color="#111111" weight="bold" />
                  </View>
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.formSection}>
              {/* Message d'aide aéré */}
              <Text style={styles.sectionSubtitle}>
                {isCashPickup
                  ? 'Entrez les nom et prénom exactement tels qu’inscrits sur la pièce d’identité du bénéficiaire pour le retrait au guichet.'
                  : isBank
                  ? 'Renseignez les coordonnées bancaires du titulaire du compte pour le virement direct.'
                  : 'Renseignez les coordonnées du compte destinataire.'}
              </Text>

              {/* ── Formulaire Retrait Espèces (Cash Plus / Wafacash) ── */}
              {isCashPickup ? (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Prénom du bénéficiaire</Text>
                    <View style={styles.inputWrapper}>
                      <User size={22} color="#8E8E87" weight="regular" />
                      <TextInput
                        style={styles.input}
                        placeholder="Ex: Youssef"
                        placeholderTextColor="#9E9E98"
                        value={firstName}
                        onChangeText={setFirstName}
                        autoCapitalize="words"
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Nom de famille</Text>
                    <View style={styles.inputWrapper}>
                      <IdentificationCard size={22} color="#8E8E87" weight="regular" />
                      <TextInput
                        style={styles.input}
                        placeholder="Ex: El Amrani"
                        placeholderTextColor="#9E9E98"
                        value={lastName}
                        onChangeText={setLastName}
                        autoCapitalize="words"
                      />
                    </View>
                  </View>
                </>
              ) : (
                /* ── Formulaire Banque ou Mobile Money ── */
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Nom complet du titulaire</Text>
                  <View style={styles.inputWrapper}>
                    <User size={22} color="#8E8E87" weight="regular" />
                    <TextInput
                      style={styles.input}
                      placeholder="Ex: Youssef El Amrani"
                      placeholderTextColor="#9E9E98"
                      value={fullName}
                      onChangeText={setFullName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              )}

              {/* Champ RIB si Virement Bancaire */}
              {isBank && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    Numéro de compte / RIB {isCemacToMaroc ? '(24 chiffres)' : ''}
                  </Text>
                  <View style={styles.inputWrapper}>
                    <Bank size={22} color="#8E8E87" weight="regular" />
                    <TextInput
                      style={[styles.input, { letterSpacing: 0.8 }]}
                      placeholder={isCemacToMaroc ? '0000 0000 0000 0000 0000 0000' : 'Numéro RIB'}
                      placeholderTextColor="#9E9E98"
                      value={rib}
                      onChangeText={handleRibChange}
                      keyboardType="numeric"
                      maxLength={29}
                    />
                  </View>
                  {isCemacToMaroc && (
                    <Text style={styles.helperText}>
                      {rib.replace(/\s+/g, '').length}/24 chiffres
                    </Text>
                  )}
                </View>
              )}

              {/* Numéro de téléphone */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Numéro de téléphone {isCashPickup ? '(pour SMS de retrait)' : ''}
                </Text>
                <View style={styles.inputWrapper}>
                  <Phone size={22} color="#8E8E87" weight="regular" />
                  <TextInput
                    style={styles.input}
                    placeholder={isCemacToMaroc ? '+212 600 00 00 00' : '+237 600 00 00 00'}
                    placeholderTextColor="#9E9E98"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Ville (Optionnel) */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Ville de résidence (Facultatif)</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, { paddingLeft: 4 }]}
                    placeholder="Ex: Casablanca, Rabat, Douala..."
                    placeholderTextColor="#9E9E98"
                    value={city}
                    onChangeText={setCity}
                  />
                </View>
              </View>

              {/* Option Enregistrer le bénéficiaire */}
              <View style={styles.switchRow}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={styles.switchTitle}>Enregistrer ce bénéficiaire</Text>
                  <Text style={styles.switchSubtitle}>
                    Pour le retrouver en 1 clic lors de vos prochains envois.
                  </Text>
                </View>
                <Switch
                  value={saveBeneficiary}
                  onValueChange={setSaveBeneficiary}
                  trackColor={{ false: '#ECECE8', true: '#111111' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {/* Bouton d'action inséré directement à l'intérieur de l'écran */}
              <Pressable
                style={({ pressed }) => [
                  styles.submitButton,
                  !isValid && styles.submitButtonDisabled,
                  isValid && pressed && styles.submitButtonPressed,
                ]}
                onPress={handleContinue}
                disabled={!isValid}
              >
                <Text style={[styles.submitButtonText, !isValid && styles.submitButtonTextDisabled]}>
                  Continuer vers le récapitulatif
                </Text>
              </Pressable>
            </View>
          )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0ED',
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
    fontSize: 19,
    fontWeight: '800',
    color: '#111111',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 16,
  },

  // Badge récapitulatif du mode choisi
  summaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
  },
  summaryInfo: {
    flex: 1,
    gap: 3,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#767670',
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -0.4,
  },
  summaryCurrency: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
  },

  // Onglets Nouveau / Enregistrés
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F3',
    borderRadius: 18,
    padding: 4,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#8A8A85',
  },
  tabTextActive: {
    color: '#111111',
  },

  formSection: {
    gap: 16,
    paddingTop: 4,
  },
  sectionSubtitle: {
    fontSize: 14.5,
    color: '#6E6E68',
    lineHeight: 21,
  },

  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#F7F7F5',
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1.25,
    borderColor: '#ECECE8',
  },
  input: {
    flex: 1,
    fontSize: 16.5,
    fontWeight: '600',
    color: '#111111',
  },
  helperText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E87',
    textAlign: 'right',
    marginTop: 2,
  },

  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F0ED',
    marginTop: 6,
  },
  switchTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#111111',
  },
  switchSubtitle: {
    fontSize: 13.5,
    color: '#767670',
    marginTop: 2,
    lineHeight: 18,
  },

  // Section Bénéficiaires enregistrés
  savedSection: {
    gap: 12,
  },
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F5F5F3',
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: '#ECECE8',
    marginBottom: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 15.5,
    color: '#111111',
  },
  savedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0ED',
    gap: 16,
  },
  savedItemPressed: {
    backgroundColor: '#FAFAF8',
  },
  savedAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: authColors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedAvatarText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111111',
  },
  savedInfo: {
    flex: 1,
    gap: 3,
  },
  savedName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111111',
  },
  savedPhone: {
    fontSize: 14,
    color: '#767670',
    fontWeight: '500',
  },
  savedAction: {
    padding: 6,
  },

  // Bottom action bar
  submitButton: {
    backgroundColor: authColors.yellow,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 0,
  },
  submitButtonDisabled: {
    backgroundColor: '#EBEBE8',
  },
  submitButtonPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.9,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -0.2,
  },
  submitButtonTextDisabled: {
    color: '#9E9E98',
  },
});
