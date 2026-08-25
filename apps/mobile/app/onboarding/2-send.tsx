import React from 'react';
import { router } from 'expo-router';
import { OnboardingStoryLayout } from '../../src/components/layout/OnboardingStoryLayout';
import { PrimaryButton } from '../../src/components/ui/PrimaryButton';

export default function SendPresentationScreen() {
  return (
    <OnboardingStoryLayout
      source={require('../../assets/onboarding-send.jpg')}
      step={1}
      title="Échangez de l’argent simplement"
      body="Effectuez vos échanges en quelques instants, en toute confiance."
      onBack={() => router.back()}
      onSkip={() => router.push('/onboarding/6-access')}
    >
      <PrimaryButton title="Suivant" onPress={() => router.push('/onboarding/3-track')} />
    </OnboardingStoryLayout>
  );
}
