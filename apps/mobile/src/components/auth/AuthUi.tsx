import type { PropsWithChildren, ReactNode } from 'react';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'phosphor-react-native';

export const authColors = {
  ink: '#111111',
  muted: '#5F5F59',
  subtle: '#F5F5F3',
  border: '#E4E4E0',
  yellow: '#FFE500',
  red: '#C82127',
  white: '#FFFFFF',
  green: '#1B7A4B',
};

type AuthPageProps = PropsWithChildren<{
  title: string;
  description: string;
  onBack?: () => void;
  action?: ReactNode;
  step?: number;
  totalSteps?: number;
  footer?: ReactNode;
  showLogo?: boolean;
}>;

export function AuthPage({
  title,
  description,
  onBack,
  action,
  step,
  totalSteps,
  footer,
  showLogo = true,
  children,
}: AuthPageProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            {onBack ? (
              <Pressable accessibilityRole="button" accessibilityLabel="Retour" onPress={onBack} style={styles.backButton} hitSlop={10}>
                <ArrowLeft size={22} color={authColors.ink} weight="bold" />
              </Pressable>
            ) : <View style={styles.headerSpacer} />}
            {action}
          </View>

          {/* ── Logo Favicon Optimal Centré (Cercle noir & point jaune) ── */}
          {showLogo ? (
            <View style={styles.centerLogoWrap}>
              <View style={styles.centerLogoCircle}>
                <Image
                  source={require('../../../assets/favicon.jpg')}
                  style={styles.centerLogoImage}
                  contentFit="contain"
                  transition={150}
                  cachePolicy="memory-disk"
                />
              </View>
            </View>
          ) : null}

          {step && totalSteps ? <ProgressIndicator step={step} total={totalSteps} /> : null}

          <View style={[styles.heading, showLogo && styles.headingWithLogo]}>
            {step && totalSteps ? <Text style={styles.stepLabel}>ÉTAPE {step} SUR {totalSteps}</Text> : null}
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>

          <View style={styles.body}>{children}</View>
        </ScrollView>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function ProgressIndicator({ step, total }: { step: number; total: number }) {
  return (
    <View style={styles.progressWrap} accessibilityLabel={`Étape ${step} sur ${total}`}>
      {Array.from({ length: total }, (_, index) => (
        <View key={index} style={[styles.progressSegment, index < step && styles.progressSegmentActive]} />
      ))}
    </View>
  );
}

type FieldProps = TextInputProps & {
  label: string;
  error?: string;
  helper?: string;
  icon?: ReactNode;
  right?: ReactNode;
};

export function Field({ label, error, helper, icon, right, style, ...inputProps }: FieldProps) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.inputShell, error ? styles.inputError : undefined]}>
        {icon ? <View style={styles.inputIcon}>{icon}</View> : null}
        <TextInput
          {...inputProps}
          style={[styles.input, icon ? styles.inputWithIcon : undefined, right ? styles.inputWithRight : undefined, style]}
          placeholderTextColor="#92928E"
        />
        {right ? <View style={styles.inputRight}>{right}</View> : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : helper ? <Text style={styles.helperText}>{helper}</Text> : null}
    </View>
  );
}

export function PrimaryAction({ title, onPress, disabled = false }: { title: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.primaryAction, disabled && styles.primaryActionDisabled, pressed && !disabled && styles.pressed]}
    >
      <Text style={[styles.primaryActionText, disabled && styles.primaryActionTextDisabled]}>{title}</Text>
    </Pressable>
  );
}

export function TextLink({ title, onPress }: { title: string; onPress: () => void }) {
  return <Pressable accessibilityRole="link" onPress={onPress}><Text style={styles.textLink}>{title}</Text></Pressable>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: authColors.white },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 24 },
  header: { minHeight: 52, paddingTop: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerSpacer: { width: 42, height: 42 },
  backButton: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 21, backgroundColor: authColors.subtle, borderWidth: 1, borderColor: authColors.border },
  
  // Logo Favicon Centré
  centerLogoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  centerLogoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ECECE8',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  centerLogoImage: {
    width: 52,
    height: 52,
  },

  progressWrap: { flexDirection: 'row', gap: 6, marginTop: 8, marginBottom: 24 },
  progressSegment: { height: 4, borderRadius: 4, flex: 1, backgroundColor: '#E8E8E5' },
  progressSegmentActive: { backgroundColor: authColors.yellow },
  heading: { gap: 8, marginBottom: 24 },
  headingWithLogo: { alignItems: 'center', textAlign: 'center' },
  stepLabel: { fontSize: 13, lineHeight: 18, fontWeight: '800', letterSpacing: 1.2, color: '#595953', textAlign: 'center' },
  title: { color: authColors.ink, fontSize: 28, lineHeight: 34, letterSpacing: -0.6, fontWeight: '900', textAlign: 'center' },
  description: { color: authColors.muted, fontSize: 15.5, lineHeight: 22, textAlign: 'center', paddingHorizontal: 12 },
  body: { gap: 18, flexGrow: 1 },
  fieldWrap: { gap: 6 },
  fieldLabel: { color: '#222220', fontSize: 14, lineHeight: 19, fontWeight: '700' },
  inputShell: { minHeight: 56, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1.25, borderColor: '#E4E4E0', flexDirection: 'row', alignItems: 'center' },
  inputError: { borderColor: authColors.red, backgroundColor: '#FFFFFF' },
  input: { minHeight: 54, flex: 1, paddingHorizontal: 16, color: authColors.ink, fontSize: 16.5, lineHeight: 22, fontWeight: '500' },
  inputWithIcon: { paddingLeft: 0 },
  inputWithRight: { paddingRight: 0 },
  inputIcon: { paddingLeft: 16, paddingRight: 12 },
  inputRight: { paddingRight: 12 },
  helperText: { color: authColors.muted, fontSize: 13, lineHeight: 18 },
  errorText: { color: authColors.red, fontSize: 13, lineHeight: 18, fontWeight: '600' },
  footer: { paddingHorizontal: 24, paddingTop: 14, paddingBottom: 20, borderTopWidth: 1, borderColor: '#EEEEEA', backgroundColor: authColors.white, gap: 12 },
  primaryAction: { minHeight: 54, alignItems: 'center', justifyContent: 'center', borderRadius: 27, backgroundColor: authColors.yellow, shadowColor: authColors.yellow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 3 },
  primaryActionDisabled: { backgroundColor: '#ECEBE6', shadowOpacity: 0, elevation: 0 },
  primaryActionText: { color: authColors.ink, fontSize: 17, fontWeight: '900', letterSpacing: 0.2 },
  primaryActionTextDisabled: { color: '#92928E' },
  pressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
  textLink: { color: authColors.ink, fontSize: 15, lineHeight: 20, fontWeight: '700', textDecorationLine: 'underline' },
});
