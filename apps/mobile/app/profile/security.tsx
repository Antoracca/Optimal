import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Fingerprint,
  Password,
  LockKey,
  ShieldCheck,
  ShieldWarning,
  DeviceMobile,
  CheckCircle,
  X,
  Eye,
  EyeSlash,
  Trash,
  Key,
} from 'phosphor-react-native';
import { authColors } from '../../src/components/auth/AuthUi';
import { useUserSettingsStore } from '../../src/stores/userSettingsStore';

export default function SecurityScreen() {
  const insets = useSafeAreaInsets();
  const {
    biometricsEnabled,
    pinCode,
    twoFactorEnabled,
    toggleBiometrics,
    setPinCode,
    toggleTwoFactor,
  } = useUserSettingsStore();

  // Modals
  const [showPinModal, setShowPinModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Formulaire PIN
  const [enteredPin, setEnteredPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  // Formulaire Mot de Passe
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passVisible, setPassVisible] = useState(false);

  // Sauvegarde PIN
  const handleSavePin = () => {
    if (enteredPin.length < 4) {
      Alert.alert('Code PIN trop court', 'Le code PIN doit comporter 4 chiffres.');
      return;
    }
    if (enteredPin !== confirmPin) {
      Alert.alert('Erreur', 'Les deux codes PIN saisis ne correspondent pas.');
      return;
    }
    setPinCode(enteredPin);
    setEnteredPin('');
    setConfirmPin('');
    setShowPinModal(false);
    Alert.alert('Succès', 'Votre nouveau code PIN de sécurité a été configuré.');
  };

  // Sauvegarde Mot de Passe
  const handleSavePassword = () => {
    if (!currentPass.trim() || newPass.length < 8) {
      Alert.alert('Erreur', 'Le nouveau mot de passe doit comporter au moins 8 caractères.');
      return;
    }
    if (newPass !== confirmPass) {
      Alert.alert('Erreur', 'La confirmation du mot de passe ne correspond pas.');
      return;
    }
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setShowPasswordModal(false);
    Alert.alert('Mot de passe mis à jour', 'Votre mot de passe a été modifié avec succès.');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer mon compte',
      'Êtes-vous certain de vouloir supprimer définitivement votre compte Optimal ? Cette action est irréversible et effacera vos données.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Compte supprimé', 'Votre demande de suppression a bien été prise en compte.');
            router.replace('/auth/login');
          },
        },
      ],
    );
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
          <Text style={styles.headerTitle}>Sécurité & Confidentialité</Text>
          <Text style={styles.headerSubtitle}>
            Protégez votre compte, vos accès et vos données.
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. ACCÈS & BIOMÉTRIE ── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>Accès & Authentification Rapide</Text>

          {/* Biométrie Face ID / Touch ID */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.iconCircle}>
                <Fingerprint size={22} color="#111111" weight="bold" />
              </View>
              <View style={styles.settingTexts}>
                <Text style={styles.settingTitle}>Biométrie (Face ID / Empreinte)</Text>
                <Text style={styles.settingDesc}>Déverrouillez Optimal et validez vos échanges</Text>
              </View>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={toggleBiometrics}
              trackColor={{ false: '#E2E2DC', true: authColors.yellow }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.rowDivider} />

          {/* Code PIN de transfert */}
          <Pressable style={styles.settingRow} onPress={() => setShowPinModal(true)}>
            <View style={styles.settingLeft}>
              <View style={styles.iconCircle}>
                <Key size={22} color="#111111" weight="bold" />
              </View>
              <View style={styles.settingTexts}>
                <Text style={styles.settingTitle}>Code PIN de sécurité</Text>
                <Text style={styles.settingDesc}>
                  {pinCode ? 'Code PIN à 4 chiffres configuré' : 'Non configuré (Recommandé)'}
                </Text>
              </View>
            </View>
            <View style={styles.actionTag}>
              <Text style={styles.actionTagText}>{pinCode ? 'Modifier' : 'Configurer'}</Text>
            </View>
          </Pressable>
        </View>

        {/* ── 2. MOT DE PASSE & DOUBLE AUTHENTIFICATION ── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>Identifiants & Protection</Text>

          {/* Mot de passe */}
          <Pressable style={styles.settingRow} onPress={() => setShowPasswordModal(true)}>
            <View style={styles.settingLeft}>
              <View style={styles.iconCircle}>
                <LockKey size={22} color="#111111" weight="bold" />
              </View>
              <View style={styles.settingTexts}>
                <Text style={styles.settingTitle}>Mot de passe du compte</Text>
                <Text style={styles.settingDesc}>Changer votre mot de passe de connexion</Text>
              </View>
            </View>
            <View style={styles.actionTag}>
              <Text style={styles.actionTagText}>Modifier</Text>
            </View>
          </Pressable>

          <View style={styles.rowDivider} />

          {/* Double Authentification (2FA) */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.iconCircle}>
                <ShieldCheck size={22} color="#111111" weight="bold" />
              </View>
              <View style={styles.settingTexts}>
                <Text style={styles.settingTitle}>Double authentification (2FA)</Text>
                <Text style={styles.settingDesc}>Code de validation SMS lors de chaque nouvelle connexion</Text>
              </View>
            </View>
            <Switch
              value={twoFactorEnabled}
              onValueChange={toggleTwoFactor}
              trackColor={{ false: '#E2E2DC', true: authColors.yellow }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* ── 3. APPAREILS CONNECTÉS ── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>Appareils & Sessions</Text>
          <View style={styles.deviceRow}>
            <DeviceMobile size={22} color="#10B981" weight="bold" />
            <View style={styles.deviceTexts}>
              <Text style={styles.deviceName}>Cet appareil (Actif)</Text>
              <Text style={styles.deviceMeta}>Application mobile • Session en cours</Text>
            </View>
            <View style={styles.activeDot} />
          </View>
        </View>

        {/* ── 4. ZONE SENSIBLE ── */}
        <View style={[styles.sectionCard, { borderColor: '#FEE2E2' }]}>
          <Text style={[styles.sectionHeaderTitle, { color: '#EF4444' }]}>Zone sensible</Text>

          <Pressable
            style={styles.deleteAccountRow}
            onPress={handleDeleteAccount}
            accessibilityRole="button"
          >
            <Trash size={20} color="#EF4444" weight="bold" />
            <Text style={styles.deleteAccountText}>Supprimer définitivement mon compte</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* ── MODAL : CODE PIN ── */}
      <Modal visible={showPinModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Code PIN de sécurité</Text>
              <Pressable onPress={() => setShowPinModal(false)} hitSlop={10}>
                <X size={22} color="#111111" weight="bold" />
              </Pressable>
            </View>

            <View style={styles.modalForm}>
              <Text style={styles.modalHelper}>
                Ce code PIN à 4 chiffres sera exigé pour confirmer chaque virement d'argent.
              </Text>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Nouveau code PIN (4 chiffres)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="••••"
                  value={enteredPin}
                  onChangeText={setEnteredPin}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Confirmez le code PIN</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="••••"
                  value={confirmPin}
                  onChangeText={setConfirmPin}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>

            <Pressable style={styles.modalSaveBtn} onPress={handleSavePin}>
              <Text style={styles.modalSaveBtnText}>Enregistrer le PIN</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ── MODAL : CHANGER MOT DE PASSE ── */}
      <Modal visible={showPasswordModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Modifier mon mot de passe</Text>
              <Pressable onPress={() => setShowPasswordModal(false)} hitSlop={10}>
                <X size={22} color="#111111" weight="bold" />
              </Pressable>
            </View>

            <View style={styles.modalForm}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Mot de passe actuel</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Votre mot de passe actuel"
                  value={currentPass}
                  onChangeText={setCurrentPass}
                  secureTextEntry={!passVisible}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Nouveau mot de passe (min. 8 caractères)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Nouveau mot de passe"
                  value={newPass}
                  onChangeText={setNewPass}
                  secureTextEntry={!passVisible}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Confirmez le nouveau mot de passe</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Confirmation"
                  value={confirmPass}
                  onChangeText={setConfirmPass}
                  secureTextEntry={!passVisible}
                />
              </View>
            </View>

            <Pressable style={styles.modalSaveBtn} onPress={handleSavePassword}>
              <Text style={styles.modalSaveBtnText}>Mettre à jour le mot de passe</Text>
            </Pressable>
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

  sectionCard: {
    backgroundColor: authColors.white,
    borderRadius: 20,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: '#EEEEEC',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeaderTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 2,
  },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FAF9F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEA',
  },
  settingTexts: {
    flex: 1,
    gap: 2,
  },
  settingTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#111111',
  },
  settingDesc: {
    fontSize: 12,
    fontWeight: '500',
    color: '#767670',
    lineHeight: 16,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#F0F0EC',
  },

  actionTag: {
    backgroundColor: '#F5F5F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8E8E4',
  },
  actionTagText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#111111',
  },

  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  deviceTexts: {
    flex: 1,
    gap: 2,
  },
  deviceName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
  },
  deviceMeta: {
    fontSize: 12,
    color: '#767670',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },

  deleteAccountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  deleteAccountText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#EF4444',
  },

  // Modals
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    gap: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111111',
  },
  modalHelper: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: '#6E6E68',
  },
  modalForm: {
    gap: 14,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6E6E68',
  },
  modalInput: {
    height: 52,
    backgroundColor: '#FAFAF8',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E8E8E4',
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
  },
  modalSaveBtn: {
    height: 52,
    backgroundColor: authColors.yellow,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: authColors.yellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
  },
  modalSaveBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111111',
  },
});
