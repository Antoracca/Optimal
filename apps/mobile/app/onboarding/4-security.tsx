import React from 'react';
import { router } from 'expo-router';
import { OnboardingStoryLayout } from '../../src/components/layout/OnboardingStoryLayout';
import { PrimaryButton } from '../../src/components/ui/PrimaryButton';

export default function SecurityPresentationScreen() {
  return (
    <OnboardingStoryLayout
      source={require('../../assets/onboarding-security.jpg')}
      step={3}
      title="Simple, rapide et sécurisé"
      body="Vos échanges et vos informations sont protégés à chaque étape."
      onBack={() => router.back()}
      onSkip={() => router.push('/onboarding/6-access')}
    >
      <PrimaryButton title="Suivant" onPress={() => router.push('/onboarding/5-conclusion')} />
    </OnboardingStoryLayout>
  );
}
