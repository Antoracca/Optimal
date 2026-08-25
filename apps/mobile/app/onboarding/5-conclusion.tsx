import React from 'react';
import { router } from 'expo-router';
import { OnboardingStoryLayout } from '../../src/components/layout/OnboardingStoryLayout';
import { PrimaryButton } from '../../src/components/ui/PrimaryButton';
import { SecondaryButton } from '../../src/components/ui/SecondaryButton';

export default function ConclusionPresentationScreen() {
  return (
    <OnboardingStoryLayout
      source={require('../../assets/onboarding-conclusion.jpg')}
      step={4}
      title="Prêt à faire mieux avec votre argent ?"
      body="Rejoignez Optimal et commencez vos échanges en toute simplicité."
      onBack={() => router.back()}
    >
      {/* → Inscription */}
      <PrimaryButton
        title="Commencer"
        onPress={() => router.push('/auth/register-profile')}
      />
      {/* → Connexion */}
      <SecondaryButton
        title="J'ai déjà un compte"
        variant="ghost"
        onPress={() => router.push('/auth/login')}
      />
    </OnboardingStoryLayout>
  );
}
