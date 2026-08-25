import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import { ArrowLeft, BellSimpleSlash } from 'phosphor-react-native';
import { authColors } from '../src/components/auth/AuthUi';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const animationRef = useRef<LottieView>(null);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/');
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 14) }]}>
      {/* ── 1. Header Simple & Propre ── */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={handleBack}
          accessibilityLabel="Retour"
          hitSlop={10}
        >
          <ArrowLeft size={22} color="#111111" weight="bold" />
        </Pressable>

        <Text style={styles.headerTitle}>Notifications</Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* ── 2. Contenu État Vide avec SearchProcessing.lottie ── */}
      <View style={styles.content}>
        <View style={styles.lottieWrap}>
          <LottieView
            ref={animationRef}
            source={require('../assets/SearchProcessing.lottie')}
            autoPlay
            loop
            speed={1.0}
            style={styles.lottie}
          />
        </View>

        <View style={styles.textWrap}>
          <Text style={styles.headline}>Vous n'avez aucune notification</Text>
          <Text style={styles.subtext}>
            Toutes les mises à jour concernant vos échanges, vos reçus et les alertes de taux de change apparaîtront ici.
          </Text>
        </View>
      </View>

      {/* ── 3. Bouton Retour en bas ── */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <Pressable
          style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
          onPress={handleBack}
        >
          <Text style={styles.actionBtnText}>Retour à l'accueil</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F3',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111111',
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 20,
  },
  lottieWrap: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  textWrap: {
    alignItems: 'center',
    gap: 10,
  },
  headline: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111111',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtext: {
    fontSize: 15,
    lineHeight: 22,
    color: '#7A7A74',
    textAlign: 'center',
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  actionBtn: {
    backgroundColor: authColors.yellow,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A89400',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  actionBtnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  actionBtnText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#000000',
  },
});
