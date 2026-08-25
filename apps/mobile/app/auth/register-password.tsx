import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Check, Eye, EyeSlash, LockKey, ShieldCheck } from 'phosphor-react-native';
import { AuthPage, authColors, Field, PrimaryAction, TextLink } from '../../src/components/auth/AuthUi';
import { useRegistrationStore } from '../../src/stores/registration';

export default function RegisterPasswordScreen() {
  const draft = useRegistrationStore();
  const [confirmation, setConfirmation] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const pwd = draft.password || '';
  const hasMinLength = pwd.length >= 8;
  const hasUppercase = /[A-Z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecial = /[^A-Za-z0-9]/.test(pwd) || /[a-z]/.test(pwd);

  const remainingChars = Math.max(0, 8 - pwd.length);

  // Score de 1 à 4
  const strengthScore = [hasMinLength, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;
  
  const isPasswordValid = hasMinLength && hasUppercase && hasNumber;
  const matches = confirmation.length > 0 && confirmation === pwd;

  const finish = () => {
    setSubmitted(true);
    if (!isPasswordValid || !matches) return;
    router.push('/auth/otp-choice');
  };

  const getStrengthData = () => {
    if (pwd.length === 0) return { percent: 0, text: '', color: '#E4E4E0' };
    if (strengthScore <= 1) return { percent: 25, text: 'Très faible', color: '#C82127' };
    if (strengthScore === 2) return { percent: 50, text: 'Faible', color: '#E67E22' };
    if (strengthScore === 3) return { percent: 75, text: 'Moyen', color: '#3B82F6' };
    return { percent: 100, text: 'Fort et sécurisé', color: '#10B981' };
  };

  const strength = getStrengthData();

  return (
    <AuthPage
      title="Protégez votre compte"
      description="Choisissez un mot de passe que vous seul connaissez."
      onBack={() => router.back()}
      action={<TextLink title="Passer" onPress={() => router.push('/auth/otp-choice')} />}
      step={3}
      totalSteps={3}
      footer={<PrimaryAction title="Continuer" onPress={finish} disabled={pwd.length > 0 && (!isPasswordValid || !matches)} />}
    >
      <Field
        label="Mot de passe"
        placeholder="8 caractères minimum"
        value={draft.password}
        onChangeText={(password) => draft.update({ password })}
        secureTextEntry={!passwordVisible}
        autoComplete="new-password"
        returnKeyType="next"
        icon={<LockKey size={19} color="#65655F" weight="regular" />}
        right={<VisibilityToggle visible={passwordVisible} onPress={() => setPasswordVisible((v) => !v)} />}
        error={submitted && !isPasswordValid ? 'Le mot de passe doit respecter toutes les exigences.' : undefined}
      />

      {/* ── Affichage de sécurité UNIQUEMENT dès que l'utilisateur commence à écrire, SANS fond gris, avec une SEULE barre continue ── */}
      {pwd.length > 0 && (
        <View style={styles.liveStrengthBlock}>
          {/* Titre & Statut */}
          <View style={styles.strengthHeader}>
            <Text style={styles.strengthTitle}>Niveau de sécurité</Text>
            <Text style={[styles.strengthBadge, { color: strength.color }]}>{strength.text}</Text>
          </View>

          {/* Une seule barre continue qui se remplit au fur et à mesure */}
          <View style={styles.singleBarTrack}>
            <View
              style={[
                styles.singleBarFill,
                {
                  width: `${strength.percent}%`,
                  backgroundColor: strength.color,
                },
              ]}
            />
          </View>

          {/* Liste dynamique d'exigences en temps réel */}
          <View style={styles.requirementsList}>
            <RequirementItem
              met={hasMinLength}
              text={
                hasMinLength
                  ? '8 caractères minimum'
                  : `Encore ${remainingChars} caractère${remainingChars > 1 ? 's' : ''} minimum`
              }
            />
            <RequirementItem
              met={hasUppercase}
              text={hasUppercase ? 'Au moins une majuscule' : 'Encore une majuscule (A-Z)'}
            />
            <RequirementItem
              met={hasNumber}
              text={hasNumber ? 'Au moins un chiffre' : 'Encore un chiffre (0-9)'}
            />
            <RequirementItem
              met={hasSpecial}
              text={hasSpecial ? 'Caractère spécial ou minuscule' : 'Encore un symbole (@, #, $) ou minuscule'}
            />
          </View>
        </View>
      )}

      <Field
        label="Confirmer le mot de passe"
        placeholder="Saisissez-le à nouveau"
        value={confirmation}
        onChangeText={setConfirmation}
        secureTextEntry={!confirmationVisible}
        autoComplete="new-password"
        returnKeyType="done"
        onSubmitEditing={finish}
        icon={<LockKey size={19} color="#65655F" weight="regular" />}
        right={<VisibilityToggle visible={confirmationVisible} onPress={() => setConfirmationVisible((v) => !v)} />}
        error={submitted && !matches ? 'Les deux mots de passe ne correspondent pas.' : undefined}
        helper={matches ? '✓ Les mots de passe correspondent.' : undefined}
      />

      <View style={styles.securityBox}>
        <ShieldCheck size={21} color={authColors.ink} weight="fill" />
        <View style={styles.securityCopy}>
          <Text style={styles.securityTitle}>Simple et sécurisé</Text>
          <Text style={styles.securityText}>
            Utilisez une phrase facile à retenir. Nous ne vous demanderons jamais votre mot de passe par message.
          </Text>
        </View>
      </View>
    </AuthPage>
  );
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  const textColor = met ? '#1B7A4B' : '#6A6A64';

  return (
    <View style={styles.reqItem}>
      <View style={[styles.reqIconCircle, met && styles.reqIconCircleMet]}>
        {met ? (
          <Check size={11} color="#FFFFFF" weight="bold" />
        ) : (
          <View style={styles.reqDot} />
        )}
      </View>
      <Text style={[styles.reqText, { color: textColor }, met && styles.reqTextMet]}>{text}</Text>
    </View>
  );
}

function VisibilityToggle({ visible, onPress }: { visible: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.visibility}
      accessibilityLabel={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
    >
      {visible ? <EyeSlash size={20} color="#5F5F59" /> : <Eye size={20} color="#5F5F59" />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  visibility: { width: 38, height: 38, justifyContent: 'center', alignItems: 'center' },
  // Aucun fond gris, padding épuré
  liveStrengthBlock: {
    gap: 10,
    marginTop: -2,
    marginBottom: 4,
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  strengthTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: authColors.ink,
  },
  strengthBadge: {
    fontSize: 14,
    fontWeight: '700',
  },
  // Une seule barre continue
  singleBarTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: '#EBEBE8',
    width: '100%',
    overflow: 'hidden',
  },
  singleBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  requirementsList: {
    gap: 8,
    paddingTop: 4,
  },
  reqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reqIconCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reqIconCircleMet: {
    backgroundColor: '#10B981',
  },
  reqDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#9E9E98',
  },
  reqText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
  },
  reqTextMet: {
    fontWeight: '600',
  },
  securityBox: {
    marginTop: 6,
    padding: 16,
    backgroundColor: '#FAFAF8',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  securityCopy: { flex: 1, gap: 3 },
  securityTitle: { color: authColors.ink, fontSize: 15, fontWeight: '800' },
  securityText: { color: authColors.muted, fontSize: 14, lineHeight: 20 },
});
