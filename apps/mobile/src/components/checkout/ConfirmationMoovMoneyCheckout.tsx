import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Image } from 'expo-image';

const moovLogoImage = require('../../../assets/moov_cropped.png');

type Props = {
  visible: boolean;
  onCancel: () => void;
};

export function ConfirmationMoovMoneyCheckout({ visible, onCancel }: Props) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!visible) {
      setDots('');
      return;
    }
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.pushCard}>
          {/* Logo Moov Agrandie et Net */}
          <Image
            source={moovLogoImage}
            style={styles.logoBadge}
            contentFit="contain"
            transition={150}
            cachePolicy="memory-disk"
          />

          {/* Spinner de chargement */}
          <ActivityIndicator size="large" color="#005B94" style={styles.spinner} />

          {/* Titre avec 3 points clignotants */}
          <Text style={styles.title}>En attente de paiement{dots}</Text>

          {/* Instruction directe et épurée */}
          <Text style={styles.subtitle}>
            Veuillez confirmer sur votre téléphone
          </Text>

          {/* Bouton Annuler sobre */}
          <Pressable
            style={({ pressed }) => [styles.cancelBtn, pressed && { opacity: 0.7 }]}
            onPress={onCancel}
          >
            <Text style={styles.cancelBtnText}>Annuler</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  pushCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  logoBadge: {
    width: 90,
    height: 90,
    marginBottom: 16,
    borderRadius: 16,
  },
  spinner: {
    marginVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888888',
  },
});
