import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Eye, EyeSlash, LockKey, EnvelopeSimple, AppleLogo } from 'phosphor-react-native';
import Svg, { Path } from 'react-native-svg';
import { AuthPage, authColors, Field, PrimaryAction, TextLink } from '../../src/components/auth/AuthUi';

// ── Logo Google Officiel Multicolore ──
function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </Svg>
  );
}

// ── Logo Apple Officiel ──
function AppleIcon({ size = 22, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return <AppleLogo size={size} color={color} weight="fill" />;
}

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isIOS = Platform.OS === 'ios';
  const canContinue = /^\S+@\S+\.\S+$/.test(email.trim()) && password.length > 0;

  const submit = () => {
    setSubmitted(true);
    if (!canContinue) return;
    router.replace('/(tabs)/');
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    router.replace('/(tabs)/');
  };

  const handleAppleLogin = () => {
    console.log('Apple login clicked');
    router.replace('/(tabs)/');
  };

  return (
    <AuthPage
      title="Bon retour"
      description="Connectez-vous pour retrouver votre espace Optimal."
      onBack={() => router.back()}
      action={<TextLink title="Passer" onPress={() => router.replace('/(tabs)/')} />}
      showLogo={true}
      footer={
        <>
          <PrimaryAction title="Se connecter" onPress={submit} />
          <View style={styles.footerLine}>
            <Text style={styles.footerText}>Vous découvrez Optimal ?</Text>
            <TextLink title="Créer un compte" onPress={() => router.push('/auth/register-profile')} />
          </View>
        </>
      }
    >
      {/* ── Champ E-mail ── */}
      <Field
        label="Adresse e-mail"
        placeholder="vous@exemple.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        autoComplete="email"
        returnKeyType="next"
        icon={<EnvelopeSimple size={20} color="#65655F" weight="bold" />}
        error={submitted && !/^\S+@\S+\.\S+$/.test(email.trim()) ? 'Saisissez une adresse e-mail valide.' : undefined}
      />

      {/* ── Champ Mot de passe ── */}
      <Field
        label="Mot de passe"
        placeholder="Votre mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!passwordVisible}
        autoComplete="current-password"
        returnKeyType="done"
        onSubmitEditing={submit}
        icon={<LockKey size={20} color="#65655F" weight="bold" />}
        right={
          <Pressable
            onPress={() => setPasswordVisible((visible) => !visible)}
            style={styles.visibility}
            accessibilityLabel={passwordVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            hitSlop={10}
          >
            {passwordVisible ? <EyeSlash size={20} color="#111111" weight="bold" /> : <Eye size={20} color="#7E7E78" weight="bold" />}
          </Pressable>
        }
        error={submitted && !password ? 'Saisissez votre mot de passe.' : undefined}
      />

      {/* ── Lien Mot de passe oublié ── */}
      <View style={styles.forgotWrap}>
        <TextLink title="Mot de passe oublié ?" onPress={() => undefined} />
      </View>

      {/* ── Séparateur "ou continuer avec" ── */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>ou continuer avec</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* ── Boutons Réseaux Sociaux (Apple uniquement sur iOS) ── */}
      {isIOS ? (
        <View style={styles.socialButtonsRow}>
          {/* Bouton Google */}
          <Pressable
            style={({ pressed }) => [styles.socialBtn, styles.googleBtn, pressed && styles.socialPressed]}
            onPress={handleGoogleLogin}
            accessibilityRole="button"
            accessibilityLabel="Continuer avec Google"
          >
            <GoogleIcon size={22} />
            <Text style={styles.googleBtnText}>Google</Text>
          </Pressable>

          {/* Bouton Apple (Exclusif iOS / iPhone) */}
          <Pressable
            style={({ pressed }) => [styles.socialBtn, styles.appleBtn, pressed && styles.socialPressed]}
            onPress={handleAppleLogin}
            accessibilityRole="button"
            accessibilityLabel="Continuer avec Apple"
          >
            <AppleIcon size={22} color="#FFFFFF" />
            <Text style={styles.appleBtnText}>Apple</Text>
          </Pressable>
        </View>
      ) : (
        /* Sur Android : Bouton Google pleine largeur élégant */
        <Pressable
          style={({ pressed }) => [styles.socialBtn, styles.googleBtn, styles.fullWidthBtn, pressed && styles.socialPressed]}
          onPress={handleGoogleLogin}
          accessibilityRole="button"
          accessibilityLabel="Continuer avec Google"
        >
          <GoogleIcon size={22} />
          <Text style={styles.googleBtnText}>Continuer avec Google</Text>
        </Pressable>
      )}
    </AuthPage>
  );
}

const styles = StyleSheet.create({
  visibility: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotWrap: {
    alignItems: 'flex-end',
    marginTop: -4,
  },

  // Séparateur
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EAEAEA',
  },
  dividerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8A8A84',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Boutons Réseaux
  socialButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  socialBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  fullWidthBtn: {
    flex: undefined,
    width: '100%',
  },
  googleBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.25,
    borderColor: '#E2E2DC',
  },
  googleBtnText: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#1F1F1F',
  },
  appleBtn: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#111111',
  },
  appleBtnText: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  socialPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  footerLine: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
  },
  footerText: {
    color: '#6E6E68',
    fontSize: 15,
    fontWeight: '500',
  },
});
