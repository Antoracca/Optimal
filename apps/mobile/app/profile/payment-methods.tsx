import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  CreditCard,
  DeviceMobile,
  Bank,
  Plus,
  Trash,
  CheckCircle,
  X,
  ShieldCheck,
} from 'phosphor-react-native';
import { authColors } from '../../src/components/auth/AuthUi';
import { useUserSettingsStore, PaymentCard, MobileMoneyAccount, BankAccount } from '../../src/stores/userSettingsStore';
import { OperatorLogo } from '../../src/components/transfer/OperatorLogo';

export default function PaymentMethodsScreen() {
  const insets = useSafeAreaInsets();
  const {
    savedCards,
    savedMobileMoney,
    savedBankAccounts,
    addCard,
    removeCard,
    addMobileMoney,
    removeMobileMoney,
    addBankAccount,
    removeBankAccount,
  } = useUserSettingsStore();

  const [activeTab, setActiveTab] = useState<'cards' | 'momo' | 'bank'>('cards');

  // Modals d'ajout
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showAddMomoModal, setShowAddMomoModal] = useState(false);
  const [showAddBankModal, setShowAddBankModal] = useState(false);

  // Formulaire Carte
  const [cardNum, setCardNum] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Formulaire MoMo
  const [momoOperator, setMomoOperator] = useState<'airtel' | 'moov' | 'mtn' | 'orange'>('airtel');
  const [momoPhone, setMomoPhone] = useState('');
  const [momoName, setMomoName] = useState('');

  // Formulaire Banque
  const [bankName, setBankName] = useState('');
  const [iban, setIban] = useState('');
  const [bankHolder, setBankHolder] = useState('');

  // Soumission Carte
  const handleSaveCard = () => {
    if (cardNum.length < 16 || !cardHolder.trim() || !cardExpiry.trim()) {
      Alert.alert('Champs incomplets', 'Veuillez renseigner tous les champs de votre carte bancaire.');
      return;
    }
    const last4 = cardNum.slice(-4);
    const isVisa = cardNum.startsWith('4');
    addCard({
      cardNumber: `•••• •••• •••• ${last4}`,
      cardHolder: cardHolder.toUpperCase(),
      expiry: cardExpiry,
      brand: isVisa ? 'visa' : 'mastercard',
    });
    setCardNum('');
    setCardHolder('');
    setCardExpiry('');
    setCardCvv('');
    setShowAddCardModal(false);
  };

  // Soumission MoMo
  const handleSaveMomo = () => {
    if (!momoPhone.trim() || !momoName.trim()) {
      Alert.alert('Champs incomplets', 'Veuillez saisir votre numéro et le nom du titulaire.');
      return;
    }
    addMobileMoney({
      operator: momoOperator,
      phoneNumber: momoPhone,
      accountName: momoName,
      countryIso: 'GA',
    });
    setMomoPhone('');
    setMomoName('');
    setShowAddMomoModal(false);
  };

  // Soumission Banque
  const handleSaveBank = () => {
    if (!bankName.trim() || !iban.trim() || !bankHolder.trim()) {
      Alert.alert('Champs incomplets', 'Veuillez renseigner le nom de la banque, le RIB/IBAN et le titulaire.');
      return;
    }
    addBankAccount({
      bankName,
      iban,
      accountHolder: bankHolder,
    });
    setBankName('');
    setIban('');
    setBankHolder('');
    setShowAddBankModal(false);
  };

  return (
    <View style={styles.screen}>
      {/* ── 1. HEADER JAUNE OPTIMAL UNIFIÉ ── */}
      <View style={[styles.yellowHeader, { paddingTop: Math.max(insets.top, 14) }]}>
        {/* Top Bar : Bouton retour blanc à gauche + Favicon à droite */}
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

        {/* Titre & Sous-titre */}
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Moyens de paiement</Text>
          <Text style={styles.headerSubtitle}>
            Gérez vos cartes bancaires, comptes et portefeuilles.
          </Text>
        </View>
      </View>

      {/* ── 2. CORPS DÉROULANT : FILTRES ÉPURÉS + CONTENU ── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Filtres de statut épurés (identiques à Historique & Bénéficiaires) */}
        <View style={styles.filterRow}>
          {(
            [
              { id: 'cards', label: `Cartes (${savedCards.length})` },
              { id: 'momo', label: `Mobile Money (${savedMobileMoney.length})` },
              { id: 'bank', label: `Banque (${savedBankAccounts.length})` },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* ── 1. ONGLET CARTES BANCAIRES ── */}
        {activeTab === 'cards' && (
          <View style={styles.tabContent}>
            {savedCards.length === 0 ? (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIconCircle}>
                  <CreditCard size={32} color="#8E8E87" weight="regular" />
                </View>
                <Text style={styles.emptyTitle}>Aucune carte enregistrée</Text>
                <Text style={styles.emptyDesc}>
                  Enregistrez votre carte bancaire Visa ou Mastercard pour des échanges instantanés et sécurisés.
                </Text>
                <Pressable
                  style={({ pressed }) => [styles.addPrimaryBtn, pressed && styles.btnPressed]}
                  onPress={() => setShowAddCardModal(true)}
                >
                  <Plus size={18} color="#111111" weight="bold" />
                  <Text style={styles.addPrimaryBtnText}>Ajouter une carte bancaire</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.itemsList}>
                {savedCards.map((card) => (
                  <View key={card.id} style={styles.itemCard}>
                    <View style={styles.itemLeft}>
                      <View style={styles.cardIconBox}>
                        <CreditCard size={24} color="#111111" weight="bold" />
                      </View>
                      <View style={styles.itemTexts}>
                        <Text style={styles.itemTitle}>{card.cardNumber}</Text>
                        <Text style={styles.itemSubtitle}>{card.cardHolder} • Exp: {card.expiry}</Text>
                      </View>
                    </View>
                    <Pressable
                      style={styles.deleteBtn}
                      onPress={() => removeCard(card.id)}
                      hitSlop={8}
                    >
                      <Trash size={18} color="#EF4444" weight="bold" />
                    </Pressable>
                  </View>
                ))}

                <Pressable
                  style={({ pressed }) => [styles.addSecondaryBtn, pressed && styles.btnPressed]}
                  onPress={() => setShowAddCardModal(true)}
                >
                  <Plus size={18} color="#111111" weight="bold" />
                  <Text style={styles.addSecondaryBtnText}>Ajouter une autre carte</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}

        {/* ── 2. ONGLET MOBILE MONEY ── */}
        {activeTab === 'momo' && (
          <View style={styles.tabContent}>
            {savedMobileMoney.length === 0 ? (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIconCircle}>
                  <DeviceMobile size={32} color="#8E8E87" weight="regular" />
                </View>
                <Text style={styles.emptyTitle}>Aucun compte Mobile Money lié</Text>
                <Text style={styles.emptyDesc}>
                  Associez vos portefeuilles Airtel Money, Moov Money, MTN MoMo ou Orange Money pour vos retraits et dépôts directs.
                </Text>
                <Pressable
                  style={({ pressed }) => [styles.addPrimaryBtn, pressed && styles.btnPressed]}
                  onPress={() => setShowAddMomoModal(true)}
                >
                  <Plus size={18} color="#111111" weight="bold" />
                  <Text style={styles.addPrimaryBtnText}>Lier un compte Mobile Money</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.itemsList}>
                {savedMobileMoney.map((momo) => (
                  <View key={momo.id} style={styles.itemCard}>
                    <View style={styles.itemLeft}>
                      <OperatorLogo id={momo.operator} size={36} />
                      <View style={styles.itemTexts}>
                        <Text style={styles.itemTitle}>{momo.phoneNumber}</Text>
                        <Text style={styles.itemSubtitle}>{momo.accountName} • {momo.operator.toUpperCase()}</Text>
                      </View>
                    </View>
                    <Pressable
                      style={styles.deleteBtn}
                      onPress={() => removeMobileMoney(momo.id)}
                      hitSlop={8}
                    >
                      <Trash size={18} color="#EF4444" weight="bold" />
                    </Pressable>
                  </View>
                ))}

                <Pressable
                  style={({ pressed }) => [styles.addSecondaryBtn, pressed && styles.btnPressed]}
                  onPress={() => setShowAddMomoModal(true)}
                >
                  <Plus size={18} color="#111111" weight="bold" />
                  <Text style={styles.addSecondaryBtnText}>Lier un autre numéro Mobile Money</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}

        {/* ── 3. ONGLET COMPTES BANCAIRES ── */}
        {activeTab === 'bank' && (
          <View style={styles.tabContent}>
            {savedBankAccounts.length === 0 ? (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIconCircle}>
                  <Bank size={32} color="#8E8E87" weight="regular" />
                </View>
                <Text style={styles.emptyTitle}>Aucun compte bancaire</Text>
                <Text style={styles.emptyDesc}>
                  Enregistrez votre RIB / IBAN pour les virements bancaires internationaux vers le Maroc et la zone CEMAC.
                </Text>
                <Pressable
                  style={({ pressed }) => [styles.addPrimaryBtn, pressed && styles.btnPressed]}
                  onPress={() => setShowAddBankModal(true)}
                >
                  <Plus size={18} color="#111111" weight="bold" />
                  <Text style={styles.addPrimaryBtnText}>Ajouter un compte bancaire (RIB)</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.itemsList}>
                {savedBankAccounts.map((bank) => (
                  <View key={bank.id} style={styles.itemCard}>
                    <View style={styles.itemLeft}>
                      <View style={styles.cardIconBox}>
                        <Bank size={24} color="#111111" weight="bold" />
                      </View>
                      <View style={styles.itemTexts}>
                        <Text style={styles.itemTitle}>{bank.bankName}</Text>
                        <Text style={styles.itemSubtitle}>{bank.iban} • {bank.accountHolder}</Text>
                      </View>
                    </View>
                    <Pressable
                      style={styles.deleteBtn}
                      onPress={() => removeBankAccount(bank.id)}
                      hitSlop={8}
                    >
                      <Trash size={18} color="#EF4444" weight="bold" />
                    </Pressable>
                  </View>
                ))}

                <Pressable
                  style={({ pressed }) => [styles.addSecondaryBtn, pressed && styles.btnPressed]}
                  onPress={() => setShowAddBankModal(true)}
                >
                  <Plus size={18} color="#111111" weight="bold" />
                  <Text style={styles.addSecondaryBtnText}>Ajouter un autre compte bancaire</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* ── MODAL : AJOUT CARTE BANCAIRE ── */}
      <Modal visible={showAddCardModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouvelle carte bancaire</Text>
              <Pressable onPress={() => setShowAddCardModal(false)} hitSlop={10}>
                <X size={22} color="#111111" weight="bold" />
              </Pressable>
            </View>

            <View style={styles.modalForm}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Numéro de carte (16 chiffres)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="4532 •••• •••• ••••"
                  keyboardType="numeric"
                  maxLength={19}
                  value={cardNum}
                  onChangeText={setCardNum}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Nom sur la carte</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="EX: MOHAMED ALAMI"
                  autoCapitalize="characters"
                  value={cardHolder}
                  onChangeText={setCardHolder}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.fieldGroup, { flex: 1 }]}>
                  <Text style={styles.fieldLabel}>Expiration (MM/AA)</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="12/28"
                    maxLength={5}
                    value={cardExpiry}
                    onChangeText={setCardExpiry}
                  />
                </View>
                <View style={[styles.fieldGroup, { flex: 1 }]}>
                  <Text style={styles.fieldLabel}>CVV / CVC</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="123"
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                    value={cardCvv}
                    onChangeText={setCardCvv}
                  />
                </View>
              </View>

              <View style={styles.securityNoteRow}>
                <ShieldCheck size={16} color="#10B981" weight="fill" />
                <Text style={styles.securityNoteText}>
                  Données chiffrées de bout en bout et conformes aux normes PCI-DSS.
                </Text>
              </View>
            </View>

            <Pressable style={styles.modalSaveBtn} onPress={handleSaveCard}>
              <Text style={styles.modalSaveBtnText}>Enregistrer la carte</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ── MODAL : AJOUT MOBILE MONEY ── */}
      <Modal visible={showAddMomoModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Lier un compte Mobile Money</Text>
              <Pressable onPress={() => setShowAddMomoModal(false)} hitSlop={10}>
                <X size={22} color="#111111" weight="bold" />
              </Pressable>
            </View>

            <View style={styles.modalForm}>
              <Text style={styles.fieldLabel}>Opérateur</Text>
              <View style={styles.operatorSelectRow}>
                {(['airtel', 'moov', 'mtn', 'orange'] as const).map((op) => (
                  <Pressable
                    key={op}
                    style={[styles.operatorChip, momoOperator === op && styles.operatorChipActive]}
                    onPress={() => setMomoOperator(op)}
                  >
                    <OperatorLogo id={op} size={28} />
                    <Text style={[styles.operatorChipText, momoOperator === op && styles.operatorChipTextActive]}>
                      {op.toUpperCase()}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Numéro de téléphone lié</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="+241 07 00 00 00"
                  keyboardType="phone-pad"
                  value={momoPhone}
                  onChangeText={setMomoPhone}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Nom complet du titulaire</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Nom tel qu'enregistré chez l'opérateur"
                  value={momoName}
                  onChangeText={setMomoName}
                />
              </View>
            </View>

            <Pressable style={styles.modalSaveBtn} onPress={handleSaveMomo}>
              <Text style={styles.modalSaveBtnText}>Lier ce compte</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ── MODAL : AJOUT COMPTE BANCAIRE (RIB) ── */}
      <Modal visible={showAddBankModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ajouter un compte bancaire</Text>
              <Pressable onPress={() => setShowAddBankModal(false)} hitSlop={10}>
                <X size={22} color="#111111" weight="bold" />
              </Pressable>
            </View>

            <View style={styles.modalForm}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Nom de la Banque</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Ex: CIH Bank, Attijariwafa, BGFI, BGFIBank..."
                  value={bankName}
                  onChangeText={setBankName}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Numéro de compte / IBAN / RIB (24 chiffres)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="MA64 0000 0000 0000 0000 0000"
                  autoCapitalize="characters"
                  value={iban}
                  onChangeText={setIban}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Titulaire du compte</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Nom et prénom du titulaire"
                  value={bankHolder}
                  onChangeText={setBankHolder}
                />
              </View>
            </View>

            <Pressable style={styles.modalSaveBtn} onPress={handleSaveBank}>
              <Text style={styles.modalSaveBtnText}>Enregistrer le compte</Text>
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

  // 2. Corps & Filtres
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },

  // Filtres de type Historique
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEC',
  },
  filterChipActive: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6E6E68',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  tabContent: {
    gap: 16,
  },

  // Empty State Card
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#EEEEEC',
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
  },
  emptyDesc: {
    fontSize: 13,
    fontWeight: '500',
    color: '#767670',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 290,
  },
  addPrimaryBtn: {
    backgroundColor: authColors.yellow,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  addPrimaryBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
  },

  // Liste d'éléments enregistrés
  itemsList: {
    gap: 10,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EEEEEC',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  cardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F5F5F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTexts: {
    gap: 2,
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
  },
  itemSubtitle: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#767670',
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSecondaryBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#EEEEEC',
    borderStyle: 'dashed',
    marginTop: 4,
  },
  addSecondaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
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
    paddingBottom: 36,
    gap: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
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
    color: '#333330',
  },
  modalInput: {
    backgroundColor: '#F5F5F3',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14.5,
    fontWeight: '600',
    color: '#111111',
    borderWidth: 1,
    borderColor: '#EEEEEC',
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
  },
  securityNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 12,
  },
  securityNoteText: {
    fontSize: 12,
    color: '#15803D',
    fontWeight: '500',
    flex: 1,
  },
  operatorSelectRow: {
    flexDirection: 'row',
    gap: 8,
  },
  operatorChip: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F5F5F3',
    borderWidth: 1,
    borderColor: '#EEEEEC',
  },
  operatorChipActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#111111',
    borderWidth: 1.5,
  },
  operatorChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#767670',
  },
  operatorChipTextActive: {
    color: '#111111',
    fontWeight: '800',
  },
  modalSaveBtn: {
    backgroundColor: authColors.yellow,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  modalSaveBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
  },
});
