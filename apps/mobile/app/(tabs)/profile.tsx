import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Bell,
  User,
  CreditCard,
  MapPin,
  ShieldCheck,
  LockKey,
  Gift,
  Question,
  SignOut,
  CaretRight,
  Infinity as InfinityIcon,
  Fingerprint,
  SlidersHorizontal,
  Sparkle,
} from 'phosphor-react-native';
import { authColors } from '../../src/components/auth/AuthUi';
import { useRegistrationStore } from '../../src/stores/registration';
import { useUserSettingsStore } from '../../src/stores/userSettingsStore';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const regStore = useRegistrationStore();
  const {
    profile,
    kycStatus,
    transferLimit,
    savedCards,
    savedMobileMoney,
    favoriteRelayIds,
  } = useUserSettingsStore();

  const firstName = profile.firstName || regStore.firstName || 'Mon Compte';
  const lastName = profile.lastName || regStore.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim();
  const phone = profile.phone || regStore.phone || 'Non renseigné';
  const initial = firstName.slice(0, 1).toUpperCase() || 'O';

  const isKycVerified = kycStatus === 'verified';
  const totalPaymentMethods = savedCards.length + savedMobileMoney.length;

  const handleLogout = () => {
    router.replace('/auth/login');
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ── 1. HEADER JAUNE OPTIMAL AVEC FAVICON ── */}
        <View style={[styles.yellowHeader, { paddingTop: Math.max(insets.top, 14) }]}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <Pressable
              style={styles.notifButton}
              onPress={() => router.push('/profile/preferences')}
              accessibilityLabel="Notifications"
              hitSlop={10}
            >
              <Bell size={24} color="#111111" weight="bold" />
              <View style={styles.notifDot} />
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
            <Text style={styles.headerTitle}>Manager</Text>
            <Text style={styles.headerSubtitle}>
              Gérez votre profil, vos méthodes et votre sécurité.
            </Text>
          </View>
        </View>

        {/* ── 2. CORPS SUPERPOSÉ ── */}
        <View style={styles.body}>
          {/* ── Carte Profil & Plafond Illimité ── */}
          <Pressable
            style={({ pressed }) => [styles.profileCard, pressed && styles.cardPressed]}
            onPress={() => router.push('/profile/personal-info')}
          >
            <View style={styles.profileTopRow}>
              <View style={styles.avatarWrap}>
                <Text style={styles.avatarLetter}>{initial}</Text>
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.profileFullName}>{fullName}</Text>
                <Text style={styles.profilePhone}>{phone}</Text>
              </View>

              <View style={[styles.verifiedPill, !isKycVerified && styles.unverifiedPill]}>
                <ShieldCheck size={14} color={isKycVerified ? '#10B981' : '#D97706'} weight="fill" />
                <Text style={[styles.verifiedPillText, !isKycVerified && styles.unverifiedPillText]}>
                  {isKycVerified ? 'Vérifié' : 'Niveau 1'}
                </Text>
              </View>
            </View>

            <View style={styles.profileDivider} />

            {/* Plafond d’échange Illimité */}
            <Pressable
              style={styles.profileBottomRow}
              onPress={() => router.push('/profile/kyc')}
            >
              <View style={styles.limitMetaLeft}>
                <InfinityIcon size={18} color="#111111" weight="bold" />
                <Text style={styles.profileMetaLabel}>Plafond d’échange</Text>
              </View>
              <View style={styles.limitValueWrap}>
                <Text style={styles.profileMetaValue}>{transferLimit}</Text>
                <CaretRight size={14} color="#111111" weight="bold" />
              </View>
            </Pressable>
          </Pressable>

          {/* ── BANNIÈRE KYC SHAREID (Épurée & Institutionnelle) ── */}
          {!isKycVerified && (
            <Pressable
              style={({ pressed }) => [styles.kycPromoBanner, pressed && styles.cardPressed]}
              onPress={() => router.push('/profile/kyc')}
            >
              <View style={styles.kycPromoLeft}>
                <View style={styles.kycPromoIconBox}>
                  <Image
                    source={require('../../assets/shareid_logo.png')}
                    style={styles.shareIdLogoImage}
                    contentFit="contain"
                    transition={150}
                    cachePolicy="memory-disk"
                  />
                </View>
                <View style={styles.kycPromoTexts}>
                  <Text style={styles.kycPromoTitle}>Vérification d’identité</Text>
                  <Text style={styles.kycPromoDesc}>
                    Certifiez votre compte avec ShareID pour sécuriser vos échanges.
                  </Text>
                </View>
              </View>
              <CaretRight size={18} color="#111111" weight="bold" />
            </Pressable>
          )}

          {/* ── GROUPE 1 : COMPTE & MOYENS DE PAIEMENT ── */}
          <View style={styles.sectionWrap}>
            <Text style={styles.sectionHeader}>Compte & Moyens de paiement</Text>

            <View style={styles.menuGroup}>
              {/* Informations personnelles */}
              <Pressable
                style={({ pressed }) => [styles.menuRow, pressed && styles.menuRowPressed]}
                onPress={() => router.push('/profile/personal-info')}
              >
                <View style={styles.menuRowLeft}>
                  <View style={styles.menuIconCircle}>
                    <User size={20} color="#111111" weight="bold" />
                  </View>
                  <View style={styles.menuTextWrap}>
                    <Text style={styles.menuItemTitle}>Informations personnelles</Text>
                    <Text style={styles.menuItemSubtitle}>Identité, coordonnées et adresse légale</Text>
                  </View>
                </View>
                <CaretRight size={18} color="#9E9E98" weight="bold" />
              </Pressable>

              {/* Moyens de paiement */}
              <Pressable
                style={({ pressed }) => [styles.menuRow, pressed && styles.menuRowPressed]}
                onPress={() => router.push('/profile/payment-methods')}
              >
                <View style={styles.menuRowLeft}>
                  <View style={styles.menuIconCircle}>
                    <CreditCard size={20} color="#111111" weight="bold" />
                  </View>
                  <View style={styles.menuTextWrap}>
                    <Text style={styles.menuItemTitle}>Moyens de paiement enregistrés</Text>
                    <Text style={styles.menuItemSubtitle}>
                      {totalPaymentMethods > 0
                        ? `${totalPaymentMethods} moyen(s) enregistré(s)`
                        : 'Cartes bancaires, comptes Mobile Money'}
                    </Text>
                  </View>
                </View>
                <CaretRight size={18} color="#9E9E98" weight="bold" />
              </Pressable>

              {/* Points de relais favoris */}
              <Pressable
                style={({ pressed }) => [styles.menuRow, styles.menuRowLast, pressed && styles.menuRowPressed]}
                onPress={() => router.push('/profile/favorite-relays')}
              >
                <View style={styles.menuRowLeft}>
                  <View style={styles.menuIconCircle}>
                    <MapPin size={20} color="#111111" weight="bold" />
                  </View>
                  <View style={styles.menuTextWrap}>
                    <Text style={styles.menuItemTitle}>Points de relais favoris</Text>
                    <Text style={styles.menuItemSubtitle}>
                      {favoriteRelayIds.length > 0
                        ? `${favoriteRelayIds.length} agence(s) favorite(s)`
                        : 'Agences de retrait et dépôt partenaires'}
                    </Text>
                  </View>
                </View>
                <CaretRight size={18} color="#9E9E98" weight="bold" />
              </Pressable>
            </View>
          </View>

          {/* ── GROUPE 2 : SÉCURITÉ & PRÉFÉRENCES ── */}
          <View style={styles.sectionWrap}>
            <Text style={styles.sectionHeader}>Sécurité & Préférences</Text>

            <View style={styles.menuGroup}>
              {/* Sécurité & Biométrie */}
              <Pressable
                style={({ pressed }) => [styles.menuRow, pressed && styles.menuRowPressed]}
                onPress={() => router.push('/profile/security')}
              >
                <View style={styles.menuRowLeft}>
                  <View style={styles.menuIconCircle}>
                    <Fingerprint size={20} color="#111111" weight="bold" />
                  </View>
                  <View style={styles.menuTextWrap}>
                    <Text style={styles.menuItemTitle}>Biométrie & Code PIN</Text>
                    <Text style={styles.menuItemSubtitle}>Face ID, code secret et mot de passe</Text>
                  </View>
                </View>
                <CaretRight size={18} color="#9E9E98" weight="bold" />
              </Pressable>

              {/* Préférences & Notifications */}
              <Pressable
                style={({ pressed }) => [styles.menuRow, pressed && styles.menuRowPressed]}
                onPress={() => router.push('/profile/preferences')}
              >
                <View style={styles.menuRowLeft}>
                  <View style={styles.menuIconCircle}>
                    <SlidersHorizontal size={20} color="#111111" weight="bold" />
                  </View>
                  <View style={styles.menuTextWrap}>
                    <Text style={styles.menuItemTitle}>Préférences & Notifications</Text>
                    <Text style={styles.menuItemSubtitle}>Alertes d’échanges, taux de change et devises</Text>
                  </View>
                </View>
                <CaretRight size={18} color="#9E9E98" weight="bold" />
              </Pressable>

              {/* Déconnexion */}
              <Pressable
                style={({ pressed }) => [styles.menuRow, styles.menuRowLast, pressed && styles.menuRowPressed]}
                onPress={handleLogout}
              >
                <View style={styles.menuRowLeft}>
                  <View style={[styles.menuIconCircle, { backgroundColor: '#FEF2F2' }]}>
                    <SignOut size={20} color="#EF4444" weight="bold" />
                  </View>
                  <View style={styles.menuTextWrap}>
                    <Text style={[styles.menuItemTitle, { color: '#EF4444' }]}>Se déconnecter</Text>
                    <Text style={styles.menuItemSubtitle}>Fermer la session actuelle</Text>
                  </View>
                </View>
              </Pressable>
            </View>
          </View>

          {/* Footer de version */}
          <View style={styles.versionFooter}>
            <Text style={styles.versionText}>Optimal Mobile v1.0.0 (Build 57)</Text>
            <Text style={styles.legalText}>Échange garanti entre la Zone CEMAC et le Maroc</Text>
          </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 36,
  },

  // Header Jaune
  yellowHeader: {
    backgroundColor: authColors.yellow,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  notifButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  notifDot: {
    position: 'absolute',
    top: 13,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C82127',
  },
  largeFaviconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
    overflow: 'hidden',
  },
  largeFaviconImage: {
    width: 54,
    height: 54,
  },
  headerTitleWrap: {
    marginTop: 18,
    gap: 4,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -0.6,
  },
  headerSubtitle: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#333330',
  },

  // Corps
  body: {
    paddingHorizontal: 16,
    gap: 16,
    marginTop: 16,
  },

  // Carte Profil
  profileCard: {
    backgroundColor: authColors.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EEEEEC',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    gap: 14,
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 22,
    fontWeight: '900',
    color: authColors.yellow,
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  profileFullName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111111',
  },
  profilePhone: {
    fontSize: 13,
    fontWeight: '500',
    color: '#767670',
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  verifiedPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  unverifiedPill: {
    backgroundColor: '#FEF3C7',
  },
  unverifiedPillText: {
    color: '#D97706',
  },
  profileDivider: {
    height: 1,
    backgroundColor: '#F0F0EC',
  },
  profileBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  limitMetaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileMetaLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6E6E68',
  },
  limitValueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profileMetaValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111111',
  },

  // Bannière KYC ShareID Épurée
  kycPromoBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.25,
    borderColor: '#EEEEEC',
    gap: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  kycPromoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  kycPromoIconBox: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  shareIdLogoImage: {
    width: '100%',
    height: '100%',
  },
  kycPromoTexts: {
    flex: 1,
    gap: 2,
  },
  kycPromoTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#111111',
  },
  kycPromoDesc: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: '#6E6E68',
  },

  // Sections
  sectionWrap: {
    gap: 8,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#767670',
    paddingHorizontal: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  menuGroup: {
    backgroundColor: authColors.white,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEEEEC',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2EE',
  },
  menuRowLast: {
    borderBottomWidth: 0,
  },
  menuRowPressed: {
    backgroundColor: '#F8F8F6',
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  menuIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FAF9F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextWrap: {
    flex: 1,
    gap: 2,
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
  },
  menuItemSubtitle: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#7E7E78',
  },

  versionFooter: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 14,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8E87',
  },
  legalText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#A0A09A',
  },
});
