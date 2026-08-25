import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Check, ShieldCheck, Lightning, GlobeHemisphereWest } from 'phosphor-react-native';
import { AuthPage, authColors, PrimaryAction, TextLink } from '../../src/components/auth/AuthUi';
import { useRegistrationStore } from '../../src/stores/registration';

export default function RegisterSuccessScreen() {
  const draft = useRegistrationStore();
  const name = draft.firstName.trim();
  const animationRef = useRef<LottieView>(null);

  const handleAccessAccount = () => {
    // Redirige directement vers le tableau de bord principal
    router.replace('/(tabs)/');
  };

  return (
    <AuthPage
      title="Votre compte est prêt"
      description={`Merci ${name ? name + '. ' : ''}Votre compte a bien été confirmé.`}
      action={<TextLink title="Passer" onPress={handleAccessAccount} />}
      footer={
        <View style={styles.footerContainer}>
          <PrimaryAction title="Accéder à mon compte" onPress={handleAccessAccount} />
        </View>
      }
    >
      {/* ── 1. Animation dotLottie centrée (vitesse 0.5x) ── */}
      <View style={styles.centerWrap}>
        <View style={styles.animationContainer}>
          <LottieView
            ref={animationRef}
            source={require('../../assets/register.lottie')}
            autoPlay
            loop={false}
            speed={1.0}
            style={styles.lottie}
          />
        </View>
      </View>

      {/* ── 2. Message d'accompagnement (SANS fond gris) ── */}
      <View style={styles.headlineWrap}>
        <Text style={styles.headlineTitle}>Une inscription simple, la suite aussi.</Text>
        <Text style={styles.headlineSubtitle}>
          Votre espace est configuré et prêt pour votre premier échange.
        </Text>
      </View>

      {/* ── 3. Section « Profitez de nos services » (Propre, sans emojis bizarres, textes grands) ── */}
      <View style={styles.servicesSection}>
        <Text style={styles.sectionHeader}>Profitez de nos services</Text>

        <View style={styles.servicesList}>
          {/* Ligne 1 : Vitesse */}
          <View style={styles.serviceRow}>
            <View style={styles.serviceIconWrap}>
              <Lightning size={22} color={authColors.ink} weight="fill" />
            </View>
            <View style={styles.serviceCopy}>
              <Text style={styles.serviceTitle}>Échanges instantanés</Text>
              <Text style={styles.serviceDescription}>
                Échangez et recevez des fonds en quelques secondes dans toute la zone CEMAC et au Maroc.
              </Text>
            </View>
          </View>

          {/* Ligne 2 : Transparence */}
          <View style={styles.serviceRow}>
            <View style={styles.serviceIconWrap}>
              <GlobeHemisphereWest size={22} color={authColors.ink} weight="bold" />
            </View>
            <View style={styles.serviceCopy}>
              <Text style={styles.serviceTitle}>Taux en temps réel</Text>
              <Text style={styles.serviceDescription}>
                Des frais clairs et transparents affichés avant chaque validation.
              </Text>
            </View>
          </View>

          {/* Ligne 3 : Sécurité */}
          <View style={styles.serviceRow}>
            <View style={styles.serviceIconWrap}>
              <ShieldCheck size={22} color={authColors.ink} weight="fill" />
            </View>
            <View style={styles.serviceCopy}>
              <Text style={styles.serviceTitle}>Sécurité bancaire maximale</Text>
              <Text style={styles.serviceDescription}>
                Chaque opération est chiffrée de bout en bout et protégée par authentification forte.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </AuthPage>
  );
}

const styles = StyleSheet.create({
  centerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  animationContainer: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },

  // Titres propres SANS fond gris
  headlineWrap: {
    gap: 6,
    paddingVertical: 6,
    alignItems: 'flex-start',
  },
  headlineTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: authColors.ink,
    letterSpacing: -0.3,
  },
  headlineSubtitle: {
    fontSize: 16,
    lineHeight: 23,
    color: authColors.muted,
  },

  // Section Services
  servicesSection: {
    marginTop: 14,
    gap: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: authColors.ink,
    letterSpacing: -0.2,
  },
  servicesList: {
    gap: 18,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  serviceIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F5F5F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  serviceCopy: {
    flex: 1,
    gap: 3,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: authColors.ink,
  },
  serviceDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: authColors.muted,
  },

  footerContainer: {
    paddingVertical: 8,
  },
});
