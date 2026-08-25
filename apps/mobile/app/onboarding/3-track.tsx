import React from 'react';
import { router } from 'expo-router';
import { OnboardingStoryLayout } from '../../src/components/layout/OnboardingStoryLayout';
import { PrimaryButton } from '../../src/components/ui/PrimaryButton';

export default function TrackPresentationScreen() {
  return (
    <OnboardingStoryLayout
      source={require('../../assets/onboarding-mosque.jpg')}
      step={2}
      title="Gardez le contrôle"
      body="Suivez vos échanges et restez informé à chaque étape."
      onBack={() => router.back()}
      onSkip={() => router.push('/onboarding/6-access')}
    >
      <PrimaryButton title="Suivant" onPress={() => router.push('/onboarding/4-security')} />
    </OnboardingStoryLayout>
  );
}
