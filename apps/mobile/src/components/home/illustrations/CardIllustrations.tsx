import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Rect, Path, Polygon, G, Line } from 'react-native-svg';

type IllustrationProps = {
  size?: number;
};

/**
 * ── 1. Illustration Enveloppe + Billets + Stylo (Style Western Union Officiel) ──
 */
export function EnvelopePenIllustration({ size = 80 }: IllustrationProps) {
  const radius = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: radius }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Fond Cercle Jaune Vif */}
        <Circle cx="50" cy="50" r="50" fill="#FFD000" />

        <G transform="translate(10, 10)">
          {/* Billets verts émergeant de l'enveloppe */}
          <G transform="rotate(-10 35 45)">
            <Rect x="20" y="20" width="42" height="26" rx="3" fill="#2E9D68" stroke="#1F754B" strokeWidth="1.5" />
            <Circle cx="41" cy="33" r="6" fill="#48BB78" />
            <Circle cx="41" cy="33" r="3" fill="#1F754B" />
          </G>

          {/* Corps de l'enveloppe Kraft / Beige */}
          <Polygon points="12,40 68,40 68,78 12,78" fill="#E8B87D" stroke="#C49359" strokeWidth="1.5" />
          {/* Rabats pliés de l'enveloppe */}
          <Polygon points="12,40 40,60 68,40" fill="#DFA96C" stroke="#C49359" strokeWidth="1.5" />
          <Polygon points="12,78 40,56 68,78" fill="#F4C78F" />

          {/* Stylo Bleu Incliné */}
          <G transform="rotate(35 60 30)">
            {/* Corps du stylo */}
            <Rect x="50" y="10" width="8" height="42" rx="2" fill="#1E3A8A" />
            <Rect x="50" y="18" width="8" height="3" fill="#93C5FD" />
            {/* Pointe du stylo */}
            <Polygon points="50,52 54,64 58,52" fill="#FBBF24" />
            <Polygon points="53,60 54,65 55,60" fill="#111827" />
            {/* Agrafe du capuchon */}
            <Rect x="58" y="14" width="2" height="14" rx="1" fill="#D1D5DB" />
          </G>
        </G>
      </Svg>
    </View>
  );
}

/**
 * ── 2. Illustration Suivi de Transfert : VRAIE CIBLE / RÉTICULE DE SUIVI (Image fournie) ──
 */
export function TrackSearchIllustration({ size = 80 }: IllustrationProps) {
  const radius = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: radius }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Fond Cercle Jaune Vif */}
        <Circle cx="50" cy="50" r="50" fill="#FFD000" />

        {/* Grand Disque Blanc Pur de Contraste */}
        <Circle cx="50" cy="50" r="38" fill="#FFFFFF" />

        {/* ── Cible / Réticule de Suivi Western Union Exact ── */}
        <G stroke="#111111" strokeWidth="4" strokeLinecap="round">
          {/* Cercle Extérieur */}
          <Circle cx="50" cy="50" r="25" fill="none" />

          {/* Cercle Intérieur */}
          <Circle cx="50" cy="50" r="14" fill="none" />

          {/* Réticules : Ligne Verticale (Haut et Bas) */}
          <Line x1="50" y1="18" x2="50" y2="33" />
          <Line x1="50" y1="67" x2="50" y2="82" />

          {/* Réticules : Ligne Horizontale (Gauche et Droite) */}
          <Line x1="18" y1="50" x2="33" y2="50" />
          <Line x1="67" y1="50" x2="82" y2="50" />
        </G>
      </Svg>
    </View>
  );
}

/**
 * ── 3. Illustration Agence / Point de Relais (Lampadaire rehaussé et visible) ──
 */
export function AgencyStoreIllustration({ size = 80 }: IllustrationProps) {
  const radius = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: radius }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Fond Cercle Jaune Vif */}
        <Circle cx="50" cy="50" r="50" fill="#FFD000" />

        <G transform="translate(6, 8)">
          {/* ── Lampadaire de rue noir surélevé et décalé vers la droite ── */}
          <G transform="translate(16, -2)">
            {/* Faisceau lumineux chaleureux */}
            <Polygon points="12,18 -2,56 26,56" fill="rgba(255, 255, 255, 0.4)" />

            {/* Mât du lampadaire */}
            <Path
              d="M 12,68 L 12,14 C 12,6 20,4 24,10"
              fill="none"
              stroke="#111111"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            {/* Lanterne du lampadaire bien haute */}
            <Path d="M 21,10 L 27,10 L 29,17 L 19,17 Z" fill="#111111" />
            <Circle cx="24" cy="18" r="3.5" fill="#FFFBE6" stroke="#FFE500" strokeWidth="1" />
          </G>

          {/* ── Bâtiment Point de Relais / Agence Partenaire ── */}
          <G transform="translate(26, 26)">
            {/* Mur de briques */}
            <Rect x="0" y="8" width="58" height="48" fill="#A05A42" rx="2" />
            {/* Lignes de briques */}
            <Path d="M 0,20 L 58,20 M 0,32 L 58,32 M 0,44 L 58,44" stroke="#7A3D2A" strokeWidth="1" />

            {/* Enseigne Noire avec Bande Jaune Optimal */}
            <Rect x="-2" y="2" width="62" height="14" rx="2" fill="#111111" />
            <Rect x="6" y="6" width="46" height="6" rx="1" fill="#FFE500" />

            {/* Porte vitrée */}
            <Rect x="6" y="22" width="18" height="34" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
            <Rect x="9" y="25" width="12" height="15" fill="#64748B" />

            {/* Fenêtre */}
            <Rect x="30" y="22" width="22" height="22" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
            <Rect x="33" y="25" width="16" height="16" fill="#64748B" />
          </G>
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
});
