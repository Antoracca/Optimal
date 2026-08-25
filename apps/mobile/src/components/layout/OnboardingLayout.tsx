import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CaretLeft } from 'phosphor-react-native';
import { ProgressBar } from '../ui/ProgressBar';
import { colors, radii, spacing, typography } from '../../theme';

interface OnboardingLayoutProps {
  step: number;
  totalSteps?: number;
  onBack?: () => void;
  onSkip?: () => void;
  children: React.ReactNode;
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  step,
  totalSteps = 4,
  onBack,
  onSkip,
  children,
}) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bgPrimary} />
      
      {/* Header avec Navigation & Indicateur de progression */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          {onBack ? (
            <TouchableOpacity
              onPress={onBack}
              style={styles.backButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <CaretLeft size={24} color={colors.textPrimary} weight="bold" />
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
          )}

          {onSkip ? (
            <TouchableOpacity
              onPress={onSkip}
              style={styles.skipButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.skipText}>Passer</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>

        {/* Barre de progression segmentée */}
        <ProgressBar totalSteps={totalSteps} currentStep={step} />
      </View>

      {/* Corps de l'écran */}
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    height: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButton: {
    minHeight: 40,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
    backgroundColor: colors.bgSecondary,
    justifyContent: 'center',
  },
  skipText: {
    ...typography.buttonText,
    fontSize: 14,
    color: colors.textSecondary,
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
    paddingBottom: spacing.lg,
  },
});
