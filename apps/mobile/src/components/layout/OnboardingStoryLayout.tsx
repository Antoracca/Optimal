import React from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CaretLeft } from 'phosphor-react-native';
import { colors, radii, spacing, typography } from '../../theme';
import { ProgressBar } from '../ui/ProgressBar';

interface OnboardingStoryLayoutProps {
  source: any;
  step: number;
  title: string;
  body: string;
  onBack: () => void;
  onSkip?: () => void;
  children: React.ReactNode;
  /** Style appliqué directement à l'image (ex: { top: -40 } pour dézoomer) */
  imageStyle?: object;
  /** 'cover' par défaut — 'contain' pour voir l'image en entier sans recadrage */
  imageResizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  /** Couleur de fond visible quand l'image ne remplit pas tout l'écran */
  imageBgColor?: string;
}

/** Les photos occupent tout l'écran ; le contenu reste lisible dans un panneau fixe. */
export const OnboardingStoryLayout: React.FC<OnboardingStoryLayoutProps> = ({
  source,
  step,
  title,
  body,
  onBack,
  onSkip,
  children,
  imageStyle,
  imageResizeMode = 'cover',
  imageBgColor = colors.bgPrimary,
}) => {
  return (
    <View style={[styles.root, { backgroundColor: imageBgColor }]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      {/* ── Fond Photo HD Préchargé avec expo-image ── */}
      <Image
        source={source}
        style={[StyleSheet.absoluteFill, imageStyle]}
        contentFit={imageResizeMode === 'stretch' || imageResizeMode === 'center' ? 'cover' : imageResizeMode}
        transition={150}
        cachePolicy="memory-disk"
      />
      <View style={[StyleSheet.absoluteFill, styles.photoShade]} pointerEvents="none" />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retour"
            style={({ pressed }) => [styles.navButton, pressed && styles.navButtonPressed]}
            onPress={onBack}
          >
            <CaretLeft size={20} color={colors.textPrimary} weight="bold" />
          </Pressable>

          <View style={styles.progressBarWrap}>
            <ProgressBar currentStep={step} totalSteps={6} />
          </View>

          {onSkip ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Passer la présentation"
              style={({ pressed }) => [styles.navButton, pressed && styles.navButtonPressed]}
              onPress={onSkip}
            >
              <Text style={styles.skipText}>Passer</Text>
            </Pressable>
          ) : (
            <View style={styles.navButtonPlaceholder} />
          )}
        </View>
      </SafeAreaView>

      <View style={styles.bottomCard}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
        <View style={styles.actions}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'space-between',
  },
  safeArea: {
    flex: 1,
  },
  photoShade: {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    gap: spacing.sm,
  },
  navButton: {
    minWidth: 44,
    minHeight: 44,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  navButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  navButtonPlaceholder: {
    width: 44,
    height: 44,
  },
  progressBarWrap: {
    flex: 1,
    maxWidth: 180,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  bottomCard: {
    backgroundColor: colors.bgPrimary,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    ...typography.title1,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  body: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  actions: {
    gap: spacing.sm,
  },
});
