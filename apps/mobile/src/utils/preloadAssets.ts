import { Asset } from 'expo-asset';
import { Image as ExpoImage } from 'expo-image';

/**
 * Catalogue centralisé de TOUS les assets critiques de l'application.
 * Ils sont chargés en mémoire vive pendant le Splash Screen pour garantir
 * un affichage à 0 milliseconde sans aucun clignotement ni écran blanc.
 */
export const CRITICAL_ASSETS = [
  // ── 1. Vidéos Fondamentales ──
  require('../../assets/ScreenWelcome.mp4'),
  require('../../assets/welcome-vertical.mp4'),

  // ── 2. Logos Banques Officielles ──
  require('../../assets/banks/cashplus.png'),
  require('../../assets/banks/attijariwafa.jpg'),
  require('../../assets/banks/cih.png'),
  require('../../assets/banks/wafacash.jpg'),
  require('../../assets/banks/banquepopulaire.jpg'),
  require('../../assets/banks/creditagricole.png'),
  require('../../assets/banks/bankofafrica.png'),
  require('../../assets/banks/bmci.jpg'),

  // ── 3. Logos Opérateurs Mobile Money ──
  require('../../assets/operators/mtn.png'),
  require('../../assets/operators/orange.png'),
  require('../../assets/operators/airtel.png'),
  require('../../assets/operators/moov.png'),
  require('../../assets/mtn_cropped.png'),
  require('../../assets/moov_cropped.png'),
  require('../../assets/orangemonneyRca_cropped.png'),
  require('../../assets/orangemonney3_cropped.png'),
  require('../../assets/orangep_cropped.png'),
  require('../../assets/orange_app_qr.png'),

  // ── 4. Photos Plein Écran Onboarding ──
  require('../../assets/onboarding-send.jpg'),
  require('../../assets/onboarding-track.jpg'),
  require('../../assets/onboarding-security.jpg'),
  require('../../assets/onboarding-conclusion.jpg'),
  require('../../assets/onboarding-mosque.jpg'),

  // ── 5. Visuels Header & Branding ──
  require('../../assets/IMAGETAP.jpg'),
  require('../../assets/favicon.jpg'),
  require('../../assets/favicon2.png'),
  require('../../assets/favicon.png'),
];

export const REMOTE_IMAGE_PRELOADS = [
  'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=1200&auto=format&fit=crop',
];

/**
 * Charge tous les assets en parallèle dans le cache mémoire & disque natif.
 */
export async function preloadAllAppAssets(): Promise<void> {
  try {
    await Promise.all([
      // 1. Précharger tous les assets locaux (Images & Vidéos)
      Asset.loadAsync(CRITICAL_ASSETS),

      // 2. Pré-mettre en cache les images distantes clés via SDWebImage/Glide
      ExpoImage.prefetch(REMOTE_IMAGE_PRELOADS, 'memory-disk'),
    ]);
  } catch (error) {
    console.warn('[Asset Preload] Avertissement lors du préchargement des assets:', error);
  }
}
