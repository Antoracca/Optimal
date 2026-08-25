import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  ShieldCheck,
  Infinity as InfinityIcon,
  IdentificationCard,
  Camera,
  CheckCircle,
  Clock,
  LockKey,
  ShieldChevron,
  CaretRight,
} from 'phosphor-react-native';
import { authColors } from '../../src/components/auth/AuthUi';
import { useUserSettingsStore } from '../../src/stores/userSettingsStore';

export default function KycVerificationScreen() {
  const insets = useSafeAreaInsets();
  const { kycStatus, documentType, transferLimit, submitKyc } = useUserSettingsStore();
  const [selectedDoc, setSelectedDoc] = useState<'passport' | 'cni' | 'residence_permit'>('passport');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationDone, setVerificationDone] = useState(kycStatus === 'verified');

  const handleStartShareId = () => {
    setIsVerifying(true);
    // Simulation du flux ShareID IA (qui sera connecté au SDK ShareID)
    setTimeout(() => {
      setIsVerifying(false);
      submitKyc(selectedDoc);
      setVerificationDone(true);
      Alert.alert(
        'Vérification ShareID Réussie',
        'Votre pièce d’identité a été analysée avec succès. Votre compte bénéficie désormais d’un plafond d’échange Illimité !',
      );
    }, 2500);
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
          <Text style={styles.headerTitle}>Vérification d’identité</Text>
          <View style={{ width: 42 }} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. CARTE PRESTIGE : PLAFOND ILLIMITÉ ── */}
        <View style={styles.limitHeroCard}>
          <View style={styles.limitHeaderRow}>
            <View style={styles.limitIconCircle}>
              <InfinityIcon size={26} color="#111111" weight="bold" />
            </View>
            <View style={styles.limitTextWrap}>
              <Text style={styles.limitPretitle}>PLAFOND D’ÉCHANGE</Text>
              <Text style={styles.limitMainTitle}>Illimité</Text>
            </View>
          </View>

          <Text style={styles.limitDescription}>
            Échangez sans restriction de montant entre le Maroc et l'ensemble de la zone CEMAC.
          </Text>

          <View style={styles.statusPillRow}>
            {verificationDone ? (
              <View style={styles.statusVerifiedPill}>
                <ShieldCheck size={16} color="#059669" weight="fill" />
                <Text style={styles.statusVerifiedText}>Identité validée avec ShareID</Text>
              </View>
            ) : (
              <View style={styles.statusPendingPill}>
                <Clock size={16} color="#D97706" weight="fill" />
                <Text style={styles.statusPendingText}>Vérification requise pour débloquer</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── 2. BANDEAU OFFICIEL PARTENAIRE SHAREID (Épuré & Institutionnel) ── */}
        <View style={styles.shareIdBanner}>
          <View style={styles.shareIdTopRow}>
            <Image
              source={require('../../assets/shareid.png')}
              style={styles.shareIdLogoHeader}
              contentFit="contain"
              transition={150}
              cachePolicy="memory-disk"
            />
            <View style={styles.shareIdPill}>
              <Text style={styles.shareIdPillText}>CERTIFICATION IA</Text>
            </View>
          </View>
          <Text style={styles.shareIdTitle}>Vérification sécurisée par ShareID</Text>
          <Text style={styles.shareIdDesc}>
            Optimal s’associe à la technologie certifiée de <Text style={{ fontWeight: '800', color: '#111111' }}>ShareID</Text> pour authentifier vos documents officiels en toute sécurité et sans conservation de vos données biométriques.
          </Text>
        </View>

        {/* ── 3. CHOIX DU DOCUMENT OFFICIEL ── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Choisissez votre document officiel</Text>
          <Text style={styles.sectionSubtitle}>
            Sélectionnez la pièce d'identité en cours de validité que vous souhaitez numériser :
          </Text>

          <View style={styles.docsList}>
            {/* Passeport */}
            <Pressable
              style={[
                styles.docOptionCard,
                selectedDoc === 'passport' && styles.docOptionCardActive,
              ]}
              onPress={() => setSelectedDoc('passport')}
            >
              <View style={styles.docOptionLeft}>
                <View
                  style={[
                    styles.docIconWrap,
                    selectedDoc === 'passport' && styles.docIconWrapActive,
                  ]}
                >
                  <IdentificationCard size={22} color={selectedDoc === 'passport' ? '#111111' : '#7E7E78'} weight="bold" />
                </View>
                <View style={styles.docTextWrap}>
                  <Text style={styles.docName}>Passeport International</Text>
                  <Text style={styles.docHint}>Recommandé pour tous les corridors</Text>
                </View>
              </View>
              <View style={[styles.radioCircle, selectedDoc === 'passport' && styles.radioActive]}>
                {selectedDoc === 'passport' && <View style={styles.radioDot} />}
              </View>
            </Pressable>

            {/* Carte Nationale d'Identité */}
            <Pressable
              style={[
                styles.docOptionCard,
                selectedDoc === 'cni' && styles.docOptionCardActive,
              ]}
              onPress={() => setSelectedDoc('cni')}
            >
              <View style={styles.docOptionLeft}>
                <View
                  style={[
                    styles.docIconWrap,
                    selectedDoc === 'cni' && styles.docIconWrapActive,
                  ]}
                >
                  <IdentificationCard size={22} color={selectedDoc === 'cni' ? '#111111' : '#7E7E78'} weight="bold" />
                </View>
                <View style={styles.docTextWrap}>
                  <Text style={styles.docName}>Carte Nationale d'Identité (CNI)</Text>
                  <Text style={styles.docHint}>CNI CEMAC ou Carte d’identité marocaine</Text>
                </View>
              </View>
              <View style={[styles.radioCircle, selectedDoc === 'cni' && styles.radioActive]}>
                {selectedDoc === 'cni' && <View style={styles.radioDot} />}
              </View>
            </Pressable>

            {/* Titre de Séjour */}
            <Pressable
              style={[
                styles.docOptionCard,
                selectedDoc === 'residence_permit' && styles.docOptionCardActive,
              ]}
              onPress={() => setSelectedDoc('residence_permit')}
            >
              <View style={styles.docOptionLeft}>
                <View
                  style={[
                    styles.docIconWrap,
                    selectedDoc === 'residence_permit' && styles.docIconWrapActive,
                  ]}
                >
                  <IdentificationCard size={22} color={selectedDoc === 'residence_permit' ? '#111111' : '#7E7E78'} weight="bold" />
                </View>
                <View style={styles.docTextWrap}>
                  <Text style={styles.docName}>Titre de séjour / Carte de résident</Text>
                  <Text style={styles.docHint}>Valable pour les résidents étrangers</Text>
                </View>
              </View>
              <View style={[styles.radioCircle, selectedDoc === 'residence_permit' && styles.radioActive]}>
                {selectedDoc === 'residence_permit' && <View style={styles.radioDot} />}
              </View>
            </Pressable>
          </View>
        </View>

        {/* ── 4. COMMENT SE DÉROULE LA VÉRIFICATION SHAREID ── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Étapes de vérification</Text>

          <View style={styles.stepsWrap}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepTextWrap}>
                <Text style={styles.stepTitle}>Photo de votre document</Text>
                <Text style={styles.stepDesc}>Placez votre document dans le cadre sans reflet ni flash.</Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepTextWrap}>
                <Text style={styles.stepTitle}>Selfie vidéo 3D (Liveness)</Text>
                <Text style={styles.stepDesc}>Une vérification faciale rapide pour confirmer que vous êtes bien le titulaire.</Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={[styles.stepNumberBadge, { backgroundColor: '#ECFDF5' }]}>
                <CheckCircle size={18} color="#059669" weight="fill" />
              </View>
              <View style={styles.stepTextWrap}>
                <Text style={styles.stepTitle}>Validation instantanée</Text>
                <Text style={styles.stepDesc}>Activation immédiate de vos plafonds illimités.</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── 5. GARANTIES DE SÉCURITÉ ── */}
        <View style={styles.securityFooterBox}>
          <ShieldChevron size={22} color="#6E6E68" weight="bold" />
          <Text style={styles.securityFooterText}>
            Vos données d'identité sont chiffrées selon les normes bancaires et conformes aux réglementations financières internationales.
          </Text>
        </View>

        {/* ── CTA PRINCIPAL DE VÉRIFICATION ── */}
        <Pressable
          style={({ pressed }) => [
            styles.verifyBtn,
            isVerifying && styles.verifyBtnDisabled,
            pressed && styles.btnPressed,
          ]}
          onPress={handleStartShareId}
          disabled={isVerifying}
          accessibilityRole="button"
        >
          {isVerifying ? (
            <ActivityIndicator color="#111111" size="small" />
          ) : (
            <>
              <Camera size={20} color="#111111" weight="bold" />
              <Text style={styles.verifyBtnText}>
                {verificationDone ? 'Mettre à jour mon document' : 'Démarrer la vérification ShareID'}
              </Text>
            </>
          )}
        </Pressable>
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

  // Hero Plafond Illimité
  limitHeroCard: {
    backgroundColor: authColors.yellow,
    borderRadius: 22,
    padding: 20,
    gap: 12,
    shadowColor: authColors.yellow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  limitHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  limitIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  limitTextWrap: {
    gap: 1,
  },
  limitPretitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#333330',
    letterSpacing: 0.8,
  },
  limitMainTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -0.5,
  },
  limitDescription: {
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: '600',
    color: '#222220',
  },
  statusPillRow: {
    marginTop: 4,
  },
  statusVerifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusVerifiedText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#059669',
  },
  statusPendingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusPendingText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#D97706',
  },

  // ShareID Banner Épuré
  shareIdBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    gap: 10,
    borderWidth: 1.25,
    borderColor: '#EEEEEC',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  shareIdTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shareIdLogoHeader: {
    width: 110,
    height: 30,
  },
  shareIdPill: {
    backgroundColor: '#F5F5F3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E6E6E2',
  },
  shareIdPillText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: 0.5,
  },
  shareIdTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#111111',
  },
  shareIdDesc: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: '#6E6E68',
  },

  // Sections
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
  },
  sectionSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: '#767670',
    marginTop: -6,
  },

  docsList: {
    gap: 10,
  },
  docOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#EFEFEA',
    backgroundColor: '#FAFAF8',
  },
  docOptionCardActive: {
    borderColor: '#111111',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  docOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  docIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EFEFEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docIconWrapActive: {
    backgroundColor: 'rgba(255, 229, 0, 0.35)',
  },
  docTextWrap: {
    flex: 1,
    gap: 2,
  },
  docName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
  },
  docHint: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7E7E78',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D4D4D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: '#111111',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#111111',
  },

  stepsWrap: {
    gap: 14,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5F5F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#111111',
  },
  stepTextWrap: {
    flex: 1,
    gap: 2,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
  },
  stepDesc: {
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '500',
    color: '#6E6E68',
  },

  securityFooterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 8,
  },
  securityFooterText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: '#8E8E87',
  },

  verifyBtn: {
    height: 54,
    backgroundColor: authColors.yellow,
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: authColors.yellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 3,
    marginTop: 6,
  },
  verifyBtnDisabled: {
    opacity: 0.7,
  },
  verifyBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111111',
  },
});
