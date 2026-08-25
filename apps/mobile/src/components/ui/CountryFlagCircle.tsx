import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Rect, Polygon, Path, G, ClipPath, Defs } from 'react-native-svg';

type CountryFlagCircleProps = {
  iso: string;
  size?: number;
};

/**
 * Drapeaux nationaux vectoriels ultra-nets encadrés dans un cercle parfait.
 * Élimine les emojis bruts et assure un rendu premium identique à Western Union.
 */
export function CountryFlagCircle({ iso, size = 32 }: CountryFlagCircleProps) {
  const normalizedIso = (iso || '').toUpperCase();
  const radius = size / 2;
  const clipId = `clip-flag-${normalizedIso}-${size}`;

  const renderFlagContent = () => {
    switch (normalizedIso) {
      // ── MAROC (MA) : Rouge vif avec étoile pentagramme verte émeraude ──
      case 'MA':
        return (
          <G>
            <Rect width={size} height={size} fill="#C1272D" />
            <Polygon
              points={`
                ${radius},${radius - size * 0.28}
                ${radius + size * 0.08},${radius - size * 0.08}
                ${radius + size * 0.3},${radius - size * 0.08}
                ${radius + size * 0.12},${radius + size * 0.06}
                ${radius + size * 0.18},${radius + size * 0.28}
                ${radius},${radius + size * 0.14}
                ${radius - size * 0.18},${radius + size * 0.28}
                ${radius - size * 0.12},${radius + size * 0.06}
                ${radius - size * 0.3},${radius - size * 0.08}
                ${radius - size * 0.08},${radius - size * 0.08}
              `}
              fill="none"
              stroke="#006233"
              strokeWidth={size * 0.045}
            />
          </G>
        );

      // ── CAMEROUN (CM) : Vert, Rouge avec étoile jaune, Jaune ──
      case 'CM':
        return (
          <G>
            <Rect x={0} y={0} width={size / 3} height={size} fill="#007A5E" />
            <Rect x={size / 3} y={0} width={size / 3} height={size} fill="#CE1126" />
            <Rect x={(size * 2) / 3} y={0} width={size / 3} height={size} fill="#FCD116" />
            {/* Étoile jaune dorée au centre */}
            <Polygon
              points={`
                ${radius},${radius - size * 0.13}
                ${radius + size * 0.04},${radius - size * 0.03}
                ${radius + size * 0.13},${radius - size * 0.03}
                ${radius + size * 0.055},${radius + size * 0.03}
                ${radius + size * 0.085},${radius + size * 0.13}
                ${radius},${radius + size * 0.07}
                ${radius - size * 0.085},${radius + size * 0.13}
                ${radius - size * 0.055},${radius + size * 0.03}
                ${radius - size * 0.13},${radius - size * 0.03}
                ${radius - size * 0.04},${radius - size * 0.03}
              `}
              fill="#FCD116"
            />
          </G>
        );

      // ── GABON (GA) : Vert, Jaune, Bleu horizontal ──
      case 'GA':
        return (
          <G>
            <Rect x={0} y={0} width={size} height={size / 3} fill="#009E60" />
            <Rect x={0} y={size / 3} width={size} height={size / 3} fill="#FCD116" />
            <Rect x={0} y={(size * 2) / 3} width={size} height={size / 3} fill="#3A75C4" />
          </G>
        );

      // ── CONGO (CG) : Bandes diagonales Vert, Jaune, Rouge ──
      case 'CG':
        return (
          <G>
            <Rect width={size} height={size} fill="#009543" />
            <Polygon points={`0,${size} ${size * 0.4},${size} ${size},${size * 0.4} ${size},0 ${size * 0.6},0 0,${size * 0.6}`} fill="#FBDE4A" />
            <Polygon points={`${size * 0.4},${size} ${size},${size} ${size},${size * 0.4}`} fill="#DC241F" />
          </G>
        );

      // ── RÉPUBLIQUE CENTRAFRICAINE (CF) ──
      case 'CF':
        return (
          <G>
            <Rect x={0} y={0} width={size} height={size / 4} fill="#002A8F" />
            <Rect x={0} y={size / 4} width={size} height={size / 4} fill="#FFFFFF" />
            <Rect x={0} y={size / 2} width={size} height={size / 4} fill="#289728" />
            <Rect x={0} y={(size * 3) / 4} width={size} height={size / 4} fill="#FFCE00" />
            {/* Barre verticale rouge */}
            <Rect x={size * 0.38} y={0} width={size * 0.24} height={size} fill="#D21034" />
            {/* Étoile jaune en haut à gauche */}
            <Polygon
              points={`
                ${size * 0.16},${size * 0.04}
                ${size * 0.19},${size * 0.08}
                ${size * 0.24},${size * 0.08}
                ${size * 0.20},${size * 0.12}
                ${size * 0.22},${size * 0.17}
                ${size * 0.16},${size * 0.14}
                ${size * 0.10},${size * 0.17}
                ${size * 0.12},${size * 0.12}
                ${size * 0.08},${size * 0.08}
                ${size * 0.13},${size * 0.08}
              `}
              fill="#FFCE00"
            />
          </G>
        );

      // ── TCHAD (TD) : Bleu, Or, Rouge vertical ──
      case 'TD':
        return (
          <G>
            <Rect x={0} y={0} width={size / 3} height={size} fill="#00205B" />
            <Rect x={size / 3} y={0} width={size / 3} height={size} fill="#FFCD00" />
            <Rect x={(size * 2) / 3} y={0} width={size / 3} height={size} fill="#C8102E" />
          </G>
        );

      // ── GUINÉE ÉQUATORIALE (GQ) ──
      case 'GQ':
        return (
          <G>
            <Rect x={0} y={0} width={size} height={size / 3} fill="#3E9A00" />
            <Rect x={0} y={size / 3} width={size} height={size / 3} fill="#FFFFFF" />
            <Rect x={0} y={(size * 2) / 3} width={size} height={size / 3} fill="#E32118" />
            <Polygon points={`0,0 ${size * 0.4},${radius} 0,${size}`} fill="#0073CE" />
          </G>
        );

      // ── RDC (CD) : Bleu ciel, diagonale rouge bordée de jaune + étoile ──
      case 'CD':
        return (
          <G>
            <Rect width={size} height={size} fill="#007FFF" />
            <Polygon points={`0,${size * 0.75} 0,${size} ${size * 0.25},${size} ${size},${size * 0.25} ${size},0 ${size * 0.75},0`} fill="#FCD116" />
            <Polygon points={`0,${size * 0.85} 0,${size} ${size * 0.15},${size} ${size},${size * 0.15} ${size},0 ${size * 0.85},0`} fill="#CE1021" />
            <Polygon
              points={`
                ${size * 0.22},${size * 0.12}
                ${size * 0.25},${size * 0.18}
                ${size * 0.32},${size * 0.18}
                ${size * 0.27},${size * 0.23}
                ${size * 0.29},${size * 0.30}
                ${size * 0.22},${size * 0.25}
                ${size * 0.15},${size * 0.30}
                ${size * 0.17},${size * 0.23}
                ${size * 0.12},${size * 0.18}
                ${size * 0.19},${size * 0.18}
              `}
              fill="#FCD116"
            />
          </G>
        );

      // ── FRANCE (FR) : Bleu, Blanc, Rouge ──
      case 'FR':
        return (
          <G>
            <Rect x={0} y={0} width={size / 3} height={size} fill="#002395" />
            <Rect x={size / 3} y={0} width={size / 3} height={size} fill="#FFFFFF" />
            <Rect x={(size * 2) / 3} y={0} width={size / 3} height={size} fill="#ED2939" />
          </G>
        );

      // ── ÉTATS-UNIS (US) ──
      case 'US':
        return (
          <G>
            <Rect width={size} height={size} fill="#B22234" />
            {Array.from({ length: 6 }).map((_, i) => (
              <Rect key={i} x={0} y={(i * 2 + 1) * (size / 13)} width={size} height={size / 13} fill="#FFFFFF" />
            ))}
            <Rect x={0} y={0} width={size * 0.5} height={size * 0.54} fill="#3C3B6E" />
          </G>
        );

      // Fallback universel sobre
      default:
        return (
          <G>
            <Rect width={size} height={size} fill="#F0F0ED" />
          </G>
        );
    }
  };

  return (
    <View style={[styles.wrapper, { width: size, height: size, borderRadius: radius }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <ClipPath id={clipId}>
            <Circle cx={radius} cy={radius} r={radius} />
          </ClipPath>
        </Defs>
        <G clipPath={`url(#${clipId})`}>
          {renderFlagContent()}
        </G>
        {/* Bordure de contour fine et esthétique */}
        <Circle
          cx={radius}
          cy={radius}
          r={radius - 0.5}
          fill="none"
          stroke="rgba(0, 0, 0, 0.08)"
          strokeWidth={1}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
});
