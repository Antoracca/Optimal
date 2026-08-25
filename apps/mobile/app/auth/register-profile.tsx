import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { CalendarBlank, User } from 'phosphor-react-native';
import { AuthPage, authColors, Field, PrimaryAction, TextLink } from '../../src/components/auth/AuthUi';
import { useRegistrationStore } from '../../src/stores/registration';

function normaliseDate(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function isAdult(date: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(date);
  if (!match) return false;
  const [, dayValue, monthValue, yearValue] = match;
  const day = Number(dayValue);
  const month = Number(monthValue);
  const year = Number(yearValue);
  const parsed = new Date(year, month - 1, day);
  if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) return false;
  const today = new Date();
  const limit = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  return parsed <= limit;
}

export default function RegisterProfileScreen() {
  const draft = useRegistrationStore();
  const [submitted, setSubmitted] = useState(false);

  const nameError = submitted && draft.firstName.trim().length < 2 ? 'Indiquez votre prénom.' : undefined;
  const lastNameError = submitted && draft.lastName.trim().length < 2 ? 'Indiquez votre nom.' : undefined;
  const dateError = submitted && !isAdult(draft.birthDate)
    ? 'Saisissez une date valide. Vous devez avoir au moins 18 ans.'
    : undefined;

  const continueRegistration = () => {
    setSubmitted(true);
    if (draft.firstName.trim().length < 2 || draft.lastName.trim().length < 2 || !isAdult(draft.birthDate)) return;
    router.push('/auth/register-contact');
  };

  return (
    <AuthPage
      title="Créons votre profil"
      description="Ces informations nous permettent de préparer votre inscription."
      onBack={() => router.back()}
      action={<TextLink title="Passer" onPress={() => router.push('/auth/register-contact')} />}
      step={1}
      totalSteps={3}
      footer={
        <>
          <PrimaryAction title="Continuer" onPress={continueRegistration} />
          <View style={styles.footerLine}>
            <Text style={styles.footerText}>Vous avez déjà un compte ?</Text>
            <TextLink title="Se connecter" onPress={() => router.replace('/auth/login')} />
          </View>
        </>
      }
    >
      <Field
        label="Prénom"
        placeholder="Votre prénom"
        value={draft.firstName}
        onChangeText={(firstName) => draft.update({ firstName })}
        autoCapitalize="words"
        autoComplete="given-name"
        returnKeyType="next"
        icon={<User size={19} color="#65655F" weight="regular" />}
        error={nameError}
      />
      <Field
        label="Nom"
        placeholder="Votre nom"
        value={draft.lastName}
        onChangeText={(lastName) => draft.update({ lastName })}
        autoCapitalize="words"
        autoComplete="family-name"
        returnKeyType="next"
        icon={<User size={19} color="#65655F" weight="regular" />}
        error={lastNameError}
      />
      <Field
        label="Date de naissance"
        placeholder="JJ/MM/AAAA"
        value={draft.birthDate}
        onChangeText={(value) => draft.update({ birthDate: normaliseDate(value) })}
        keyboardType="number-pad"
        autoComplete="birthdate-full"
        returnKeyType="done"
        icon={<CalendarBlank size={19} color="#65655F" weight="regular" />}
        helper="Vous devez avoir au moins 18 ans pour créer un compte."
        error={dateError}
      />
    </AuthPage>
  );
}

const styles = StyleSheet.create({
  footerLine: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, paddingTop: 4 },
  footerText: { color: authColors.muted, fontSize: 16 },
});
