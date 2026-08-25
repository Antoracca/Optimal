import React, { useCallback } from 'react';
import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Question } from 'phosphor-react-native';
import { colors, radii, spacing, typography } from '../../src/theme';

// Version mobile compatible avec l'émulateur Android : 720 × 1280, H.264 Main.
const WELCOME_VIDEO = require('../../assets/welcome-vertical.mp4');

export default function WelcomeVideoScreen() {
  const player = useVideoPlayer(WELCOME_VIDEO, (videoPlayer) => {
    // La vidéo continue de tourner tant que l'utilisateur reste sur Welcome.
    videoPlayer.loop = true;
    videoPlayer.muted = true;
    videoPlayer.play();
  });

  // L'écran reste monté dans la pile de navigation. En revenant en arrière,
  // on relance donc explicitement la lecture au lieu de laisser une image blanche.
  useFocusEffect(
    useCallback(() => {
      try {
        player.play();
      } catch {}
      return () => {
        try {
          player.pause();
        } catch {}
      };
    }, [player]),
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <VideoView
        style={StyleSheet.absoluteFill}
        player={player}
        contentFit="cover"
        nativeControls={false}
        surfaceType="textureView"
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.utilityRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Centre d'aide"
            style={({ pressed }) => [styles.utilityButton, pressed && styles.utilityButtonPressed]}
            onPress={() => console.log('Centre d’aide')}
          >
            <Question size={18} color="#111111" weight="bold" />
            <Text style={styles.utilityText}>Aide</Text>
          </Pressable>
        </View>

        <View style={styles.bottomSheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.copy}>
            <Text style={styles.title}>
              L’argent <Text style={styles.titleAccent}>vous rapproche.</Text>
            </Text>
            <Text style={styles.subtitle}>
              Échangez de l’argent de la CEMAC vers le Maroc, simplement et en toute confiance.
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
            onPress={() => router.push('/onboarding/2-send')}
            android_ripple={{ color: 'rgba(0,0,0,0.14)', borderless: false }}
          >
            <Text style={styles.ctaText}>Commencer</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgPrimary },
  safeArea: { ...StyleSheet.absoluteFill, justifyContent: 'space-between' },
  utilityRow: {
    flexDirection: 'row', justifyContent: 'flex-start', gap: spacing.sm,
    paddingHorizontal: spacing.md, paddingTop: spacing.sm,
  },
  utilityButton: {
    height: 40, paddingHorizontal: 14, borderRadius: radii.full, flexDirection: 'row',
    alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.94)',
    shadowColor: '#000000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.14,
    shadowRadius: 8, elevation: 4,
  },
  utilityButtonPressed: { transform: [{ scale: 0.96 }] },
  utilityText: { fontSize: 13, lineHeight: 16, fontWeight: '700', color: colors.textPrimary },
  bottomSheet: {
    backgroundColor: colors.bgPrimary, borderTopLeftRadius: 32, borderTopRightRadius: 32,
    paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: 38, gap: spacing.md,
    shadowColor: '#000000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.12,
    shadowRadius: 24, elevation: 14,
  },
  sheetHandle: { width: 38, height: 4, borderRadius: radii.full, backgroundColor: colors.border, alignSelf: 'center' },
  copy: { gap: spacing.sm, paddingTop: spacing.xs, paddingBottom: spacing.xs },
  title: { ...typography.display, color: colors.textPrimary, fontSize: 31, lineHeight: 38, fontWeight: '800', letterSpacing: -0.9 },
  titleAccent: { color: '#B89C00' },
  subtitle: { ...typography.bodyLarge, color: colors.textSecondary, fontSize: 17, lineHeight: 25 },
  ctaButton: {
    backgroundColor: colors.textPrimary, height: 60, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
    width: '100%', shadowColor: '#000000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.24,
    shadowRadius: 14, elevation: 6,
  },
  ctaButtonPressed: { backgroundColor: '#252525', transform: [{ scale: 0.98 }] },
  ctaText: { color: colors.primary, fontSize: 17, fontWeight: '800', letterSpacing: 0.2 },
});
