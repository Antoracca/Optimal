import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Check, DeviceMobile, EnvelopeSimple, ShieldCheck } from 'phosphor-react-native';
import { AuthPage, authColors, PrimaryAction, TextLink } from '../../src/components/auth/AuthUi';
import { useRegistrationStore, type VerificationChannel } from '../../src/stores/registration';

function maskEmail(email: string) {
  const [local, domain] = email.split('@');
  if (!local || !domain) return 'votre adresse e-mail';
  return `${local.slice(0, 1)}•••@${domain}`;
}

function maskPhone(dialCode: string, phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return 'votre numéro de téléphone';
  return `${dialCode} ••• •• ${digits.slice(-2)}`;
}

export default function OtpChoiceScreen() {
  const draft = useRegistrationStore();
  const choose = (verificationChannel: VerificationChannel) => draft.update({ verificationChannel });
  const isEmail = draft.verificationChannel === 'email';

  return (
    <AuthPage
      title="Choisissez une vérification"
      description="Nous enverrons un code à usage unique sur le canal de votre choix."
      onBack={() => router.back()}
      action={<TextLink title="Passer" onPress={() => router.push('/auth/otp-verify')} />}
      footer={
        <PrimaryAction
          title={isEmail ? 'Envoyer le code par e-mail' : 'Envoyer le code par SMS'}
          onPress={() => router.push('/auth/otp-verify')}
        />
      }
    >
      <ChannelCard
        title="Par e-mail"
        detail={maskEmail(draft.email)}
        icon={<EnvelopeSimple size={22} color={authColors.ink} weight="regular" />}
        selected={isEmail}
        onPress={() => choose('email')}
      />
      <ChannelCard
        title="Par SMS"
        detail={maskPhone(draft.dialCode, draft.phone)}
        icon={<DeviceMobile size={22} color={authColors.ink} weight="regular" />}
        selected={!isEmail}
        onPress={() => choose('sms')}
      />
      <View style={styles.note}>
        <ShieldCheck size={21} color={authColors.ink} weight="fill" />
        <Text style={styles.noteText}>
          Ne communiquez jamais ce code. Optimal ne vous le demandera jamais par appel ou message.
        </Text>
      </View>
    </AuthPage>
  );
}

function ChannelCard({
  title,
  detail,
  icon,
  selected,
  onPress,
}: {
  title: string;
  detail: string;
  icon: React.ReactNode;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, selected && styles.cardSelected]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <View style={styles.cardLeft}>
        <View style={[styles.iconBox, selected && styles.iconBoxSelected]}>{icon}</View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDetail}>{detail}</Text>
        </View>
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <Check size={14} color="#10B981" weight="bold" /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 82,
    borderRadius: 17,
    borderWidth: 1.25,
    borderColor: authColors.border,
    backgroundColor: authColors.white,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // Aucun halo jaune : bordure nette et sobre
  cardSelected: {
    borderColor: '#111111',
    borderWidth: 1.75,
    backgroundColor: authColors.white,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    flex: 1,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#F5F5F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxSelected: {
    backgroundColor: '#F0F0ED',
  },
  cardText: {
    gap: 4,
    flex: 1,
  },
  cardTitle: {
    color: authColors.ink,
    fontSize: 18,
    fontWeight: '800',
  },
  cardDetail: {
    color: authColors.muted,
    fontSize: 15,
  },
  radio: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#C4C4BE',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: authColors.white,
  },
  // Flèche / coche en vert, aucun halo jaune
  radioSelected: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  note: {
    marginTop: 10,
    backgroundColor: '#FAFAF8',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  noteText: {
    flex: 1,
    color: authColors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
});
