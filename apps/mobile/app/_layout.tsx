import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { preloadAllAppAssets } from '../src/utils/preloadAssets';

// Maintain native splash screen until all critical assets and videos are in memory
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await preloadAllAppAssets();
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#FFFFFF' },
        }}
      >
        {/* ── Splash & Welcome Intro ── */}
        <Stack.Screen name="index" />

        {/* ── Onboarding de présentation (Phase 1) ── */}
        <Stack.Screen name="onboarding/1-welcome" options={{ animation: 'fade' }} />
        <Stack.Screen name="onboarding/2-send" />
        <Stack.Screen name="onboarding/3-track" />
        <Stack.Screen name="onboarding/4-security" />
        <Stack.Screen name="onboarding/5-conclusion" />
        <Stack.Screen name="onboarding/6-access" options={{ animation: 'fade' }} />

        {/* ── Auth — Connexion ── */}
        <Stack.Screen name="auth/login" />

        {/* ── Auth — Inscription (étapes) ── */}
        <Stack.Screen name="auth/register-profile" />
        <Stack.Screen name="auth/register-contact" />
        <Stack.Screen name="auth/register-password" />

        {/* ── Auth — OTP & Succès ── */}
        <Stack.Screen name="auth/otp-choice" />
        <Stack.Screen name="auth/otp-verify" />
        <Stack.Screen name="auth/register-success" options={{ animation: 'fade', gestureEnabled: false }} />

        {/* ── Application Principale (Tabs & Transfert) ── */}
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="transfer/flow" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="transfer/recipient" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="transfer/review" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="transfer/payment-checkout" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="transfer/success" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="transfer/operators" options={{ animation: 'slide_from_bottom' }} />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
