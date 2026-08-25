import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Bell, ArrowRight } from 'phosphor-react-native';
import { authColors } from '../auth/AuthUi';

export function HomeHeroHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 14) }]}>
      {/* ── 1. Fond Supérieur : Image coupée en diagonale transversale ── */}
      <View style={styles.diagonalImageContainer}>
        <Image
          source={require('../../../assets/IMAGETAP.jpg')}
          style={styles.diagonalImage}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />
        {/* Bande diagonale jaune qui coupe parallèlement le bas de l'image */}
        <View style={styles.diagonalCutter} />
      </View>

      {/* ── 2. Top Bar : Cloche à GAUCHE | Gros Favicon à DROITE ── */}
      <View style={styles.topBar}>
        <Pressable
          style={styles.notifButton}
          onPress={() => router.push('/notifications')}
          accessibilityLabel="Notifications"
          hitSlop={10}
        >
          <Bell size={24} color="#111111" weight="bold" />
          <View style={styles.notifDot} />
        </Pressable>

        {/* Gros Cercle Favicon Agrandit à DROITE */}
        <View style={styles.largeFaviconCircle}>
          <Image
            source={require('../../../assets/favicon.jpg')}
            style={styles.largeFaviconImage}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
          />
        </View>
      </View>

      {/* ── 3. Salutation « Bonjour. » ── */}
      <View style={styles.greetingWrap}>
        <Text style={styles.greetingText}>Bonjour.</Text>
      </View>

      {/* ── 4. Carte Promo Noire Épurée ── */}
      <View style={styles.promoCard}>
        <Text style={styles.promoHeadline}>
          Échanger de l'argent entre la zone CEMAC et le Maroc n'a jamais été aussi simple, libre et rapide.
        </Text>

        <Pressable style={styles.ratePill}>
          <Text style={styles.ratePillText}>Taux garanti : 60 XAF = 1 MAD</Text>
          <ArrowRight size={13} color="#111111" weight="bold" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: authColors.yellow,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    position: 'relative',
    overflow: 'hidden',
  },

  // Conteneur de l'image supérieure en diagonale
  diagonalImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 190,
    overflow: 'hidden',
    zIndex: 1,
  },
  diagonalImage: {
    width: '100%',
    height: 220,
  },
  diagonalCutter: {
    position: 'absolute',
    bottom: -60,
    left: -40,
    right: -40,
    height: 120,
    backgroundColor: authColors.yellow,
    transform: [{ rotate: '-8deg' }],
  },

  // Top Bar : Cloche à gauche, Favicon à droite
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    zIndex: 10,
  },

  // Bouton cloche (à gauche)
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

  // Gros cercle Favicon (à droite)
  largeFaviconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 7,
  },
  largeFaviconImage: {
    width: 56,
    height: 56,
  },

  // Salutation
  greetingWrap: {
    marginTop: 22,
    marginBottom: 16,
    zIndex: 10,
  },
  greetingText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -0.6,
  },

  // Carte Promo Fond Noir Pur
  promoCard: {
    backgroundColor: '#0F0F0F',
    borderRadius: 22,
    padding: 18,
    gap: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 10,
  },
  promoHeadline: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  ratePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: authColors.yellow,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  ratePillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111111',
  },
});
