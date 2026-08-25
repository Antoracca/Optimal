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
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 14) }]}>
        <View style={styles.topRow}>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
            onPress={() => router.back()}
            accessibilityLabel="Retour"
            hitSlop={10}
          >
            <ArrowLeft size={22} color="#111111" weight="bold" />
          </Pressable>
          <Text style={styles.headerTitle}>Moyens de paiement</Text>
          <View style={{ width: 42 }} />
        </View>

        {/* ── Onglets Filtrage ── */}
        <View style={styles.tabsRow}>
          <Pressable
            style={[styles.tabBtn, activeTab === 'cards' && styles.tabBtnActive]}
            onPress={() => setActiveTab('cards')}
          >
            <CreditCard size={17} color={activeTab === 'cards' ? '#111111' : '#7E7E78'} weight={activeTab === 'cards' ? 'bold' : 'regular'} />
            <Text style={[styles.tabText, activeTab === 'cards' && styles.tabTextActive]}>
              Cartes ({savedCards.length})
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabBtn, activeTab === 'momo' && styles.tabBtnActive]}
            onPress={() => setActiveTab('momo')}
          >
            <DeviceMobile size={17} color={activeTab === 'momo' ? '#111111' : '#7E7E78'} weight={activeTab === 'momo' ? 'bold' : 'regular'} />
            <Text style={[styles.tabText, activeTab === 'momo' && styles.tabTextActive]}>
              Mobile Money ({savedMobileMoney.length})
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabBtn, activeTab === 'bank' && styles.tabBtnActive]}
            onPress={() => setActiveTab('bank')}
          >
            <Bank size={17} color={activeTab === 'bank' ? '#111111' : '#7E7E78'} weight={activeTab === 'bank' ? 'bold' : 'regular'} />
            <Text style={[styles.tabText, activeTab === 'bank' && styles.tabTextActive]}>
              Banque ({savedBankAccounts.length})
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
                  value={cardNum}
                  onChangeText={setCardNum}
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Nom sur la carte</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="NOM PRÉNOM"
                  value={cardHolder}
                  onChangeText={setCardHolder}
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.rowTwoFields}>
                <View style={[styles.fieldGroup, { flex: 1 }]}>
                  <Text style={styles.fieldLabel}>Date d'expiration</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="MM/AA"
                    value={cardExpiry}
                    onChangeText={setCardExpiry}
                    maxLength={5}
                  />
                </View>
                <View style={[styles.fieldGroup, { flex: 1 }]}>
                  <Text style={styles.fieldLabel}>CVV</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="123"
                    value={cardCvv}
                    onChangeText={setCardCvv}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>

            <Pressable style={styles.modalSaveBtn} onPress={handleSaveCard}>
              <Text style={styles.modalSaveBtnText}>Enregistrer la carte</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ── MODAL : LIER MOBILE MONEY ── */}
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
              {/* Choix Opérateur */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Opérateur réseau</Text>
                <View style={styles.operatorRow}>
                  {(['airtel', 'moov', 'mtn', 'orange'] as const).map((op) => (
                    <Pressable
                      key={op}
                      style={[
                        styles.operatorSelectBtn,
                        momoOperator === op && styles.operatorSelectBtnActive,
                      ]}
                      onPress={() => setMomoOperator(op)}
                    >
                      <OperatorLogo id={op} size={28} />
                      <Text style={styles.operatorSelectText}>{op.toUpperCase()}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Numéro de téléphone Mobile Money</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="+241 062 12 34 56"
                  value={momoPhone}
                  onChangeText={setMomoPhone}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Nom complet du titulaire</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Nom complet tel qu'enregistré chez l'opérateur"
                  value={momoName}
                  onChangeText={setMomoName}
                />
              </View>
            </View>

            <Pressable style={styles.modalSaveBtn} onPress={handleSaveMomo}>
              <Text style={styles.modalSaveBtnText}>Lier le compte</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ── MODAL : AJOUT COMPTE BANCAIRE ── */}
      <Modal visible={showAddBankModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouveau compte bancaire</Text>
              <Pressable onPress={() => setShowAddBankModal(false)} hitSlop={10}>
                <X size={22} color="#111111" weight="bold" />
              </Pressable>
            </View>

            <View style={styles.modalForm}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Nom de la Banque</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Ex: Attijariwafa Bank, BGFIBank, CIH..."
                  value={bankName}
                  onChangeText={setBankName}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Numéro de compte / RIB / IBAN</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="MA64 0077 8800 •••• ••••"
                  value={iban}
                  onChangeText={setIban}
                  autoCapitalize="characters"
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
  header: {
    backgroundColor: authColors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEC',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F5F5F3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E4',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
  },
  btnPressed: {
    opacity: 0.84,
    transform: [{ scale: 0.98 }],
  },

  tabsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F5F5F3',
    borderWidth: 1,
    borderColor: '#E8E8E4',
  },
  tabBtnActive: {
    backgroundColor: authColors.yellow,
    borderColor: authColors.yellow,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7E7E78',
  },
  tabTextActive: {
    color: '#111111',
    fontWeight: '800',
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  tabContent: {
    gap: 16,
  },

  emptyCard: {
    backgroundColor: authColors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#EEEEEC',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginTop: 20,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F5F5F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111111',
  },
  emptyDesc: {
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: '500',
    color: '#7E7E78',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  addPrimaryBtn: {
    backgroundColor: authColors.yellow,
    borderRadius: 24,
    height: 48,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    shadowColor: authColors.yellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
  },
  addPrimaryBtnText: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#111111',
  },

  itemsList: {
    gap: 12,
  },
  itemCard: {
    backgroundColor: authColors.white,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EEEEEC',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  cardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FAF9F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEA',
  },
  itemTexts: {
    flex: 1,
    gap: 3,
  },
  itemTitle: {
    fontSize: 15.5,
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
    borderRadius: 18,
    height: 50,
    borderWidth: 1.5,
    borderColor: '#E8E8E4',
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  addSecondaryBtnText: {
    fontSize: 14.5,
    fontWeight: '800',
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
    fontSize: 15,
    fontWeight: '600',
    color: '#111111',
  },
  rowTwoFields: {
    flexDirection: 'row',
    gap: 12,
  },
  operatorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  operatorSelectBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FAFAF8',
    borderWidth: 1.5,
    borderColor: '#E8E8E4',
    gap: 4,
  },
  operatorSelectBtnActive: {
    borderColor: '#111111',
    backgroundColor: '#FFFFFF',
  },
  operatorSelectText: {
    fontSize: 10,
    fontWeight: '800',
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
