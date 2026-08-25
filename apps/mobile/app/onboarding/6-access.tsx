import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'phosphor-react-native';
import { authColors } from '../../src/components/auth/AuthUi';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function AccessScreen() {
  const insets = useSafeAreaInsets();

  const handleRegister = () => {
    router.push('/auth/register-profile');
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleSkip = () => {
    router.replace('/(tabs)/');
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* ── 1. FOND SUPÉRIEUR JAUNE OPTIMAL AVEC TYPOGRAPHIE IMPACTANTE ── */}
      <View style={[styles.yellowHeader, { paddingTop: Math.max(insets.top, 16) }]}>
        {/* Top bar avec bouton Fermer / Passer */}
        <View style={styles.topBar}>
          <View style={{ flex: 1 }} />
          <Pressable
            style={({ pressed }) => [styles.closeButton, pressed && { opacity: 0.7 }]}
            onPress={handleSkip}
            accessibilityLabel="Passer"
            hitSlop={12}
          >
            <X size={20} color="#111111" weight="bold" />
          </Pressable>
        </View>

        {/* Grand Titre Percutant */}
        <View style={styles.headerTextWrap}>
          <Text style={styles.headline}>
            Vous êtes sur le point de découvrir les avantages d'Optimal.
          </Text>

          <Text style={styles.subheadline}>
            Échangez votre argent entre le Maroc et la zone CEMAC, rapidement et en toute fiabilité.
          </Text>
        </View>

        {/* Découpe courbe élégante de transition vers la photo */}
        <View style={styles.curveOverlay} />
      </View>

      {/* ── 2. SECTION CENTRALE : PHOTO IMMERSIVE AVEC SMARTPHONE OPTIMAL ── */}
      <View style={styles.visualContainer}>
        <Image
          source={require('../../assets/IMAGETAP.jpg')}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />

        {/* Voile sombre subtil pour faire ressortir les boutons en bas */}
        <View style={styles.bottomGradient} pointerEvents="none" />

        {/* Carte/Smartphone stylisé Optimal au centre */}
        <View style={styles.phoneBadgeContainer}>
          <View style={styles.phoneMockup}>
            <View style={styles.phoneScreen}>
              <Image
                source={require('../../assets/favicon.jpg')}
                style={styles.brandEmblem}
                contentFit="contain"
              />
              <Text style={styles.brandTitle}>OPTIMAL</Text>
              <Text style={styles.brandTagline}>Mobile Exchange</Text>
            </View>
          </View>
        </View>

        {/* ── 3. DOUBLE BOUTON ACTIONS D'ACCÈS (S'INSCRIRE | SE CONNECTER) ── */}
        <View style={[styles.actionsContainer, { paddingBottom: Math.max(insets.bottom, 20) + 12 }]}>
          <View style={styles.buttonsRow}>
            {/* Bouton S'inscrire */}
            <Pressable
              style={({ pressed }) => [
                styles.actionBtn,
                styles.registerBtn,
                pressed && styles.btnPressed,
              ]}
              onPress={handleRegister}
              accessibilityRole="button"
              accessibilityLabel="S'inscrire"
            >
              <Text style={styles.registerBtnText}>Inscrivez-vous</Text>
            </Pressable>

            {/* Bouton Se connecter */}
            <Pressable
              style={({ pressed }) => [
                styles.actionBtn,
                styles.loginBtn,
                pressed && styles.btnPressed,
              ]}
              onPress={handleLogin}
              accessibilityRole="button"
              accessibilityLabel="Se connecter"
            >
              <Text style={styles.loginBtnText}>Se connecter</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },

  // Header Jaune
  yellowHeader: {
    backgroundColor: authColors.yellow,
    paddingHorizontal: 24,
    paddingBottom: 42,
    position: 'relative',
    zIndex: 2,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 44,
    marginBottom: 6,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: {
    gap: 14,
    paddingTop: 4,
    paddingBottom: 10,
  },
  headline: {
    fontSize: 27,
    lineHeight: 33,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -0.6,
  },
  subheadline: {
    fontSize: 14.5,
    lineHeight: 21,
    fontWeight: '600',
    color: '#2A2A2A',
  },
  curveOverlay: {
    position: 'absolute',
    bottom: -24,
    left: 0,
    right: 0,
    height: 25,
    backgroundColor: authColors.yellow,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },

  // Section Visuelle
  visualContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#1E1E1E',
    justifyContent: 'flex-end',
  },
  bottomGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },

  // Badge / Mockup Smartphone Optimal (décalé vers la droite pour valoriser la photo d'ambiance)
  phoneBadgeContainer: {
    position: 'absolute',
    top: '14%',
    right: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneMockup: {
    width: 175,
    height: 238,
    borderRadius: 28,
    backgroundColor: '#111111',
    borderWidth: 3,
    borderColor: '#333333',
    padding: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 10,
    transform: [{ rotate: '-4deg' }],
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: authColors.yellow,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  brandEmblem: {
    width: 58,
    height: 58,
    marginBottom: 6,
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: 0.8,
  },
  brandTagline: {
    fontSize: 10,
    fontWeight: '700',
    color: '#333330',
    letterSpacing: 0.4,
    marginTop: 1,
  },

  // Actions Inférieures
  actionsContainer: {
    paddingHorizontal: 20,
    zIndex: 10,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  actionBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  registerBtn: {
    backgroundColor: '#000000',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  registerBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  loginBtn: {
    backgroundColor: '#000000',
    borderWidth: 1.5,
    borderColor: authColors.yellow,
  },
  loginBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: authColors.yellow,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
});
