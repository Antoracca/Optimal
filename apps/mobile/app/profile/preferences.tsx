import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  CurrencyCircleDollar,
  Globe,
  FileText,
  ShieldCheck,
  TrendUp,
  Tag,
} from 'phosphor-react-native';
import { authColors } from '../../src/components/auth/AuthUi';
import { useUserSettingsStore } from '../../src/stores/userSettingsStore';

export default function PreferencesScreen() {
  const insets = useSafeAreaInsets();
  const {
    notifications,
    toggleNotification,
    preferredCurrency,
    setPreferredCurrency,
  } = useUserSettingsStore();

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
          <Text style={styles.headerTitle}>Préférences & Notifications</Text>
          <View style={{ width: 42 }} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. NOTIFICATIONS PUSH & SMS ── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>Notifications & Alertes</Text>

          {/* Transferts */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.iconCircle}>
                <Bell size={20} color="#111111" weight="bold" />
              </View>
              <View style={styles.settingTexts}>
                <Text style={styles.settingTitle}>Statut des échanges</Text>
                <Text style={styles.settingDesc}>Recevez un SMS et un push dès que l'argent est disponible</Text>
              </View>
            </View>
            <Switch
              value={notifications.transfers}
              onValueChange={() => toggleNotification('transfers')}
              trackColor={{ false: '#E2E2DC', true: authColors.yellow }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.rowDivider} />

          {/* Taux de Change */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.iconCircle}>
                <TrendUp size={20} color="#111111" weight="bold" />
              </View>
              <View style={styles.settingTexts}>
                <Text style={styles.settingTitle}>Alertes de taux de change</Text>
                <Text style={styles.settingDesc}>Soyez prévenu des meilleures opportunités MAD ↔ XAF</Text>
              </View>
            </View>
            <Switch
              value={notifications.exchangeRates}
              onValueChange={() => toggleNotification('exchangeRates')}
              trackColor={{ false: '#E2E2DC', true: authColors.yellow }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.rowDivider} />

          {/* Promotions */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.iconCircle}>
                <Tag size={20} color="#111111" weight="bold" />
              </View>
              <View style={styles.settingTexts}>
                <Text style={styles.settingTitle}>Offres & Réductions</Text>
                <Text style={styles.settingDesc}>Codes promos et bonus de parrainage</Text>
              </View>
            </View>
            <Switch
              value={notifications.promotions}
              onValueChange={() => toggleNotification('promotions')}
              trackColor={{ false: '#E2E2DC', true: authColors.yellow }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* ── 2. DEVISE & LANGUE ── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>Langue & Affichage</Text>

          {/* Devise préférée */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.iconCircle}>
                <CurrencyCircleDollar size={20} color="#111111" weight="bold" />
              </View>
              <View style={styles.settingTexts}>
                <Text style={styles.settingTitle}>Devise d'affichage</Text>
                <Text style={styles.settingDesc}>Devise par défaut pour le calculateur</Text>
              </View>
            </View>
            <View style={styles.currencyToggleWrap}>
              <Pressable
                style={[styles.currBtn, preferredCurrency === 'MAD' && styles.currBtnActive]}
                onPress={() => setPreferredCurrency('MAD')}
              >
                <Text style={[styles.currText, preferredCurrency === 'MAD' && styles.currTextActive]}>MAD</Text>
              </Pressable>
              <Pressable
                style={[styles.currBtn, preferredCurrency === 'XAF' && styles.currBtnActive]}
                onPress={() => setPreferredCurrency('XAF')}
              >
                <Text style={[styles.currText, preferredCurrency === 'XAF' && styles.currTextActive]}>XAF</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.rowDivider} />

          {/* Langue */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.iconCircle}>
                <Globe size={20} color="#111111" weight="bold" />
              </View>
              <View style={styles.settingTexts}>
                <Text style={styles.settingTitle}>Langue</Text>
                <Text style={styles.settingDesc}>Français (Par défaut)</Text>
              </View>
            </View>
            <View style={styles.tagPill}>
              <Text style={styles.tagPillText}>Français</Text>
            </View>
          </View>
        </View>

        {/* ── 3. DOCUMENTS LÉGAUX ── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>Informations Légales</Text>

          <Pressable style={styles.legalRow}>
            <FileText size={18} color="#7E7E78" />
            <Text style={styles.legalText}>Conditions Générales d'Utilisation</Text>
          </Pressable>

          <View style={styles.rowDivider} />

          <Pressable style={styles.legalRow}>
            <ShieldCheck size={18} color="#7E7E78" />
            <Text style={styles.legalText}>Politique de Confidentialité & RGPD</Text>
          </Pressable>
        </View>
      </ScrollView>
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
    paddingBottom: 14,
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

  currencyToggleWrap: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F3',
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: '#E8E8E4',
  },
  currBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9,
  },
  currBtnActive: {
    backgroundColor: authColors.yellow,
  },
  currText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#7E7E78',
  },
  currTextActive: {
    color: '#111111',
    fontWeight: '900',
  },

  tagPill: {
    backgroundColor: '#F5F5F3',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  tagPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111111',
  },

  legalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  legalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
  },
});
