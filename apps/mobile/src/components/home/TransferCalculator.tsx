import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { CaretDown, ArrowsDownUp } from 'phosphor-react-native';
import { authColors } from '../auth/AuthUi';
import { useTransferStore } from '../../stores/transferStore';
import { COUNTRIES, Country } from '../../data/countries';
import { CountryFlagCircle } from '../ui/CountryFlagCircle';
import { CountryPickerModal } from '../ui/CountryPickerModal';

export function TransferCalculator() {
  const {
    direction,
    sourceCountry,
    destinationCountry,
    sendAmount,
    receiveAmount,
    setSourceCountry,
    setDestinationCountry,
    setSendAmount,
    setReceiveAmount,
    toggleDirection,
  } = useTransferStore();

  const [fromModalOpen, setFromModalOpen] = useState(false);
  const [toModalOpen, setToModalOpen] = useState(false);

  const isSendingFromMorocco = sourceCountry.iso === 'MA';
  const sendCurrency = isSendingFromMorocco ? 'MAD' : 'XAF';
  const receiveCurrency = isSendingFromMorocco ? 'XAF' : 'MAD';

  // Pays CEMAC + RDC
  const cemacCountries = COUNTRIES.filter((c) => c.iso !== 'MA');
  const marocCountry = COUNTRIES.find((c) => c.iso === 'MA') || COUNTRIES[COUNTRIES.length - 1];
  const defaultCemac = cemacCountries[0];

  // Sélection du pays d'envoi ("Envoyer depuis")
  const handleSelectSource = (country: Country) => {
    if (country.iso === 'MA') {
      // Envoi depuis le Maroc ➔ Destination = pays CEMAC par défaut
      setSourceCountry(marocCountry);
      if (destinationCountry.iso === 'MA') {
        setDestinationCountry(defaultCemac);
      }
    } else {
      // Envoi depuis la CEMAC ➔ Destination = obligatoirement le Maroc
      setSourceCountry(country);
      setDestinationCountry(marocCountry);
    }
  };

  // Sélection du pays destinataire (uniquement actif quand on envoie depuis le Maroc)
  const handleSelectDestination = (country: Country) => {
    setDestinationCountry(country);
  };

  const handleContinue = () => {
    router.push('/transfer/operators');
  };

  return (
    <View style={styles.container}>
      {/* ── 1. Sélecteur "Échanger depuis" ── */}
      <View style={styles.corridorRow}>
        <View style={styles.corridorInfo}>
          <Text style={styles.corridorLabel}>Échanger depuis</Text>
          <Pressable
            style={styles.countryPickerBtn}
            onPress={() => setFromModalOpen(true)}
            accessibilityRole="button"
          >
            <CountryFlagCircle iso={sourceCountry.iso} size={28} />
            <Text style={styles.pickerCountryName}>{sourceCountry.name}</Text>
            <CaretDown size={16} color="#666660" weight="bold" />
          </Pressable>
        </View>

        {/* Bouton d'inversion rapide */}
        <Pressable
          style={({ pressed }) => [styles.swapIconBtn, pressed && styles.swapPressed]}
          onPress={toggleDirection}
          accessibilityLabel="Inverser la direction de l’échange"
        >
          <ArrowsDownUp size={20} color="#111111" weight="bold" />
        </Pressable>
      </View>

      {/* ── 1 bis. Option supplémentaire : "Vers" (uniquement si envoi depuis le Maroc) ── */}
      {isSendingFromMorocco && (
        <View style={styles.destinationDropdownRow}>
          <Text style={styles.destinationLabel}>Vers le pays bénéficiaire :</Text>
          <Pressable
            style={styles.destPickerBtn}
            onPress={() => setToModalOpen(true)}
            accessibilityRole="button"
          >
            <CountryFlagCircle iso={destinationCountry.iso} size={26} />
            <Text style={styles.destCountryName}>{destinationCountry.name}</Text>
            <CaretDown size={15} color="#666660" weight="bold" />
          </Pressable>
        </View>
      )}

      {/* ── 2. Double Champ de Saisie (Initialisé à 0.00) ── */}
      <View style={styles.inputsCard}>
        {/* Champ : Vous échangez */}
        <View style={styles.amountField}>
          <Text style={styles.amountLabel}>Vous échangez</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.amountInput}
              value={sendAmount}
              onChangeText={setSendAmount}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor="#B0B0A8"
            />
            <Text style={styles.currencyTag}>{sendCurrency}</Text>
          </View>
        </View>

        <View style={styles.inputDivider} />

        {/* Champ : Le bénéficiaire reçoit */}
        <View style={styles.amountField}>
          <Text style={styles.amountLabel}>Le bénéficiaire reçoit</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.amountInput}
              value={receiveAmount}
              onChangeText={setReceiveAmount}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor="#B0B0A8"
            />
            <Text style={styles.currencyTag}>{receiveCurrency}</Text>
          </View>
        </View>
      </View>

      {/* ── 3. Bouton CTA Principal Jaune ── */}
      <Pressable
        style={({ pressed }) => [styles.continueBtn, pressed && styles.continueBtnPressed]}
        onPress={handleContinue}
        accessibilityRole="button"
      >
        <Text style={styles.continueBtnText}>Continuer</Text>
      </Pressable>

      {/* ── Modal Western Union : Pays d'envoi ── */}
      <CountryPickerModal
        visible={fromModalOpen}
        onClose={() => setFromModalOpen(false)}
        onSelect={handleSelectSource}
        title="Sélectionnez le pays d'envoi"
        selectedIso={sourceCountry.iso}
        allowedCountries={COUNTRIES}
      />

      {/* ── Modal Western Union : Pays bénéficiaire (quand départ = Maroc) ── */}
      <CountryPickerModal
        visible={toModalOpen}
        onClose={() => setToModalOpen(false)}
        onSelect={handleSelectDestination}
        title="Sélectionnez d'où vous voulez recevoir de l'argent"
        selectedIso={destinationCountry.iso}
        allowedCountries={cemacCountries}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: authColors.white,
    borderRadius: 22,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: '#EEEEEC',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },

  // Corridor
  corridorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  corridorInfo: {
    gap: 4,
    flex: 1,
  },
  corridorLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8A8A84',
  },
  countryPickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 2,
  },
  pickerCountryName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
  },
  swapIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E4',
  },
  swapPressed: {
    backgroundColor: '#EBEBE8',
    transform: [{ scale: 0.94 }],
  },

  // Destination optionnelle si départ = Maroc
  destinationDropdownRow: {
    backgroundColor: '#FAF9F5',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EFEFEA',
    gap: 6,
  },
  destinationLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#767670',
  },
  destPickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  destCountryName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
    flex: 1,
  },

  // Inputs Card
  inputsCard: {
    backgroundColor: '#F7F7F5',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#ECECE8',
  },
  amountField: {
    gap: 4,
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E87',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amountInput: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111111',
    flex: 1,
    padding: 0,
  },
  currencyTag: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
  },
  inputDivider: {
    height: 1,
    backgroundColor: '#E8E8E4',
  },

  // CTA
  continueBtn: {
    backgroundColor: authColors.yellow,
    borderRadius: 18,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: authColors.yellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
  },
  continueBtnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  continueBtnText: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#111111',
  },
});
