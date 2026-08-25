import React, { useRef, useState, useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowClockwise, CheckCircle, ShieldCheck } from 'phosphor-react-native';
import { AuthPage, authColors, PrimaryAction, TextLink } from '../../src/components/auth/AuthUi';
import { useRegistrationStore } from '../../src/stores/registration';

const CODE_LENGTH = 6;

export default function OtpVerifyScreen() {
  const draft = useRegistrationStore();
  const [code, setCode] = useState(Array<string>(CODE_LENGTH).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);
  const isEmail = draft.verificationChannel === 'email';
  const complete = code.every(Boolean);

  const updateDigit = (value: string, index: number) => {
    if (isVerifying) return;
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);

    if (digit && index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  // Détection automatique dès que les 6 chiffres sont saisis
  useEffect(() => {
    if (complete && !isVerifying) {
      triggerVerification();
    }
  }, [code]);

  const triggerVerification = () => {
    setIsVerifying(true);
    // Loader de simulation de 2.8 secondes
    setTimeout(() => {
      router.replace('/auth/register-success');
    }, 2800);
  };

  return (
    <AuthPage
      title="Saisissez votre code"
      description={
        isEmail
          ? `Un code a été envoyé à ${maskEmail(draft.email)}.`
          : `Un code a été envoyé par SMS au ${maskPhone(draft.dialCode, draft.phone)}.`
      }
      onBack={() => router.back()}
      action={<TextLink title="Passer" onPress={() => router.replace('/auth/register-success')} />}
      footer={
        <PrimaryAction
          title={isVerifying ? 'Vérification en cours...' : 'Vérifier le code'}
          onPress={triggerVerification}
          disabled={!complete || isVerifying}
        />
      }
    >
      {/* Rangée des 6 cases de code OTP */}
      <View style={styles.codeRow} accessibilityLabel="Code de vérification à six chiffres">
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(input) => {
              inputs.current[index] = input;
            }}
            editable={!isVerifying}
            style={[
              styles.codeInput,
              digit ? styles.codeInputFilled : undefined,
              isVerifying ? styles.codeInputVerifying : undefined,
            ]}
            value={digit}
            onChangeText={(value) => updateDigit(value, index)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && !code[index] && index > 0 && !isVerifying) {
                inputs.current[index - 1]?.focus();
              }
            }}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            autoFocus={index === 0}
            accessibilityLabel={`Chiffre ${index + 1} du code`}
          />
        ))}
      </View>

      {/* État de chargement automatique simulé */}
      {isVerifying ? (
        <View style={styles.verifyingContainer}>
          <ActivityIndicator size="small" color="#10B981" />
          <Text style={styles.verifyingText}>Vérification en cours...</Text>
        </View>
      ) : (
        <View style={styles.resendWrap}>
          <Text style={styles.resendText}>Vous n’avez rien reçu ?</Text>
          <TextLink
            title="Renvoyer le code"
            onPress={() => {
              setCode(Array<string>(CODE_LENGTH).fill(''));
              inputs.current[0]?.focus();
            }}
          />
        </View>
      )}

      <View style={styles.securityBox}>
        <ShieldCheck size={21} color={authColors.ink} weight="fill" />
        <Text style={styles.securityText}>
          Le code est personnel et temporaire. Ne le partagez avec personne.
        </Text>
      </View>

      {!isVerifying && (
        <Pressable style={styles.changeChannel} onPress={() => router.back()}>
          <ArrowClockwise size={16} color={authColors.ink} weight="bold" />
          <Text style={styles.changeChannelText}>Utiliser un autre canal</Text>
        </Pressable>
      )}
    </AuthPage>
  );
}

function maskEmail(email: string) {
  const [local, domain] = email.split('@');
  return local && domain ? `${local.slice(0, 1)}•••@${domain}` : 'votre adresse e-mail';
}

function maskPhone(dialCode: string, phone: string) {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 4 ? `${dialCode} ••• •• ${digits.slice(-2)}` : 'votre numéro';
}

const styles = StyleSheet.create({
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 7,
  },
  codeInput: {
    flex: 1,
    maxWidth: 48,
    height: 58,
    borderRadius: 14,
    borderWidth: 1.25,
    borderColor: authColors.border,
    backgroundColor: authColors.white,
    textAlign: 'center',
    fontSize: 22,
    color: authColors.ink,
    fontWeight: '800',
  },
  // Rempli en vert doux au lieu du jaune
  codeInputFilled: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.06)',
    color: '#111111',
  },
  codeInputVerifying: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    opacity: 0.9,
  },
  verifyingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderRadius: 12,
  },
  verifyingText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '700',
  },
  resendWrap: {
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  resendText: {
    color: authColors.muted,
    fontSize: 15,
  },
  securityBox: {
    marginTop: 22,
    backgroundColor: '#FAFAF8',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  securityText: {
    flex: 1,
    color: authColors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  changeChannel: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  changeChannelText: {
    color: authColors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
});
