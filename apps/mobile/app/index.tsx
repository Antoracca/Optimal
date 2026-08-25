import React, { useEffect, useRef } from 'react';
import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as SplashScreen from 'expo-splash-screen';
import { colors, radii, spacing, typography } from '../src/theme';

const SCREEN_WELCOME_VIDEO = require('../assets/ScreenWelcome.mp4');

export default function WelcomeIntroScreen() {
  const hasNavigated = useRef(false);

  const navigateToOnboarding = () => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;
    router.replace('/onboarding/1-welcome');
  };

  const player = useVideoPlayer(SCREEN_WELCOME_VIDEO, (videoPlayer) => {
    videoPlayer.loop = false;
    videoPlayer.muted = false;
    videoPlayer.volume = 1.0;
    videoPlayer.play();
  });

  useEffect(() => {
    // Hide native splash screen immediately when this intro screen mounts
    SplashScreen.hideAsync().catch(() => {});

    // Listen to video end to seamlessly transition to onboarding
    const subscription = player.addListener('playToEnd', () => {
      navigateToOnboarding();
    });

    return () => {
      subscription?.remove?.();
    };
  }, [player]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── Fullscreen Welcome Video ── */}
      <VideoView
        style={StyleSheet.absoluteFill}
        player={player}
        contentFit="cover"
        nativeControls={false}
        surfaceType="textureView"
      />

      {/* ── Top Bar with Skip Button ── */}
      <SafeAreaView style={styles.overlay} edges={['top']}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Passer l'introduction"
            style={({ pressed }) => [styles.skipButton, pressed && styles.skipButtonPressed]}
            onPress={navigateToOnboarding}
          >
            <Text style={styles.skipText}>Passer</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  skipButton: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: radii.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  skipButtonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.96 }],
  },
  skipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
