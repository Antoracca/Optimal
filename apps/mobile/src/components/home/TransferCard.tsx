import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { MagnifyingGlass, CaretDown, ArrowsDownUp } from 'phosphor-react-native';
import { authColors } from '../auth/AuthUi';
import { useTransferStore } from '../../stores/transferStore';
import { COUNTRIES, Country } from '../../data/countries';
import { CountryFlagCircle } from '../ui/CountryFlagCircle';
import { CountryPickerModal } from '../ui/CountryPickerModal';

export function TransferCard() {
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

  const cemacCountries = COUNTRIES.filter((c) => c.iso !== 'MA');
  const marocCountry = COUNTRIES.find((c) => c.iso === 'MA') || COUNTRIES[COUNTRIES.length - 1];
  const defaultCemac = cemacCountries[0];

  const handleSelectSource = (country: Country) => {
    if (country.iso === 'MA') {
      setSourceCountry(marocCountry);
      if (destinationCountry.iso === 'MA') {
        setDestinationCountry(defaultCemac);
      }
    } else {
      setSourceCountry(country);
      setDestinationCountry(marocCountry);
    }
  };

  const handleSelectDestination = (country: Country) => {
    setDestinationCountry(country);
  };

  const handleContinue = () => {
    router.push('/transfer/flow');
  };

  return (
    <View style={styles.card}>
      {/* ── Titre Principal (Fidèle à Western Union) ── */}
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>Échanger de l'argent</Text>
        <Pressable
          style={({ pressed }) => [styles.swapPill, pressed && styles.swapPillPressed]}
          onPress={toggleDirection}
          accessibilityLabel="Inverser"
        >
          <ArrowsDownUp size={18} color="#111111" weight="bold" />
        </Pressable>
      </View>

      {/* ── Frames Pays ── */}
      {isSendingFromMorocco ? (
        // Mode Maroc : 2 frames alignées (Envoyer de + Recevoir de)
        <View style={styles.twoFramesContainer}>
          {/* Frame 1 : Envoyer de */}
          <View style={styles.frameItem}>
            <Text style={styles.fieldLabel}>Échanger de</Text>
            <Pressable
              style={styles.countryPickerLine}
              onPress={() => setFromModalOpen(true)}
              accessibilityRole="button"
            >
              <View style={styles.countryLineLeft}>
                <CountryFlagCircle iso={sourceCountry.iso} size={28} />
                <Text style={styles.countryNameText} numberOfLines={1}>
                  {sourceCountry.name}
                </Text>
              </View>
              <CaretDown size={16} color="#666660" weight="bold" />
            </Pressable>
          </View>

          {/* Frame 2 : Recevoir de / Vers */}
          <View style={styles.frameItem}>
            <Text style={styles.fieldLabel}>Recevoir de</Text>
            <Pressable
              style={styles.countryPickerLine}
              onPress={() => setToModalOpen(true)}
              accessibilityRole="button"
            >
              <View style={styles.countryLineLeft}>
                <CountryFlagCircle iso={destinationCountry.iso} size={28} />
                <Text style={styles.countryNameText} numberOfLines={1}>
                  {destinationCountry.name}
                </Text>
              </View>
              <CaretDown size={16} color="#666660" weight="bold" />
            </Pressable>
          </View>
        </View>
      ) : (
        // Mode CEMAC : 1 frame (Envoyer de -> Destination Maroc automatique)
        <View style={styles.singleFrameWrap}>
          <Text style={styles.fieldLabel}>Échanger de</Text>
          <Pressable
            style={styles.countryPickerLine}
            onPress={() => setFromModalOpen(true)}
            accessibilityRole="button"
          >
            <View style={styles.countryLineLeft}>
              <CountryFlagCircle iso={sourceCountry.iso} size={28} />
              <Text style={styles.countryNameText}>{sourceCountry.name}</Text>
            </View>
            <MagnifyingGlass size={18} color="#666660" weight="bold" />
          </Pressable>
        </View>
      )}

      {/* ── Champ 1 : Vous envoyez ── */}
      <View style={styles.amountBox}>
        <Text style={styles.fieldLabel}>Montant à échanger</Text>
        <View style={styles.amountLine}>
          <TextInput
            style={styles.amountInput}
            value={sendAmount}
            onChangeText={setSendAmount}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor="#AAAAA2"
          />
          <Text style={styles.currencyCode}>{sendCurrency}</Text>
        </View>
      </View>

      {/* ── Champ 2 : Le bénéficiaire reçoit ── */}
      <View style={styles.amountBox}>
        <Text style={styles.fieldLabel}>Le bénéficiaire reçoit</Text>
        <View style={styles.amountLine}>
          <TextInput
            style={styles.amountInput}
            value={receiveAmount}
            onChangeText={setReceiveAmount}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor="#AAAAA2"
          />
          <Text style={styles.currencyCode}>{receiveCurrency}</Text>
        </View>
      </View>

      {/* ── Bouton Jaune Optimal « Continuer » ── */}
      <Pressable
        style={({ pressed }) => [styles.continueButton, pressed && styles.continueButtonPressed]}
        onPress={handleContinue}
        accessibilityRole="button"
      >
        <Text style={styles.continueButtonText}>Continuer</Text>
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
  card: {
    backgroundColor: authColors.white,
    borderRadius: 24,
    padding: 20,
    gap: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#ECECE8',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -0.4,
  },
  swapPill: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E6E6E2',
  },
  swapPillPressed: {
    backgroundColor: '#EBEBE8',
    transform: [{ scale: 0.94 }],
  },

  // 1 Frame
  singleFrameWrap: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7E7E78',
  },
  countryPickerLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E2DC',
  },
  countryLineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  countryNameText: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#111111',
  },

  // 2 Frames
  twoFramesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  frameItem: {
    flex: 1,
    gap: 6,
  },

  // Montant
  amountBox: {
    gap: 6,
  },
  amountLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E2DC',
    paddingVertical: 6,
  },
  amountInput: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111111',
    flex: 1,
    padding: 0,
  },
  currencyCode: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111111',
  },

  // Bouton Continuer
  continueButton: {
    backgroundColor: authColors.yellow,
    borderRadius: 28,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: authColors.yellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 3,
  },
  continueButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  continueButtonText: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: 0.2,
  },
});
