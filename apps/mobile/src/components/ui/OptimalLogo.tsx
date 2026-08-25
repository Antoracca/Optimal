import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { colors } from '../../theme';

interface OptimalLogoProps {
  size?: 'sm' | 'md' | 'lg';
  withGlow?: boolean;
}

export const OptimalLogo: React.FC<OptimalLogoProps> = ({ size = 'md', withGlow = false }) => {
  const dimensions = {
    sm: { ring: 36, stroke: 5, fontSizeTitle: 16, fontSizeSub: 7 },
    md: { ring: 54, stroke: 7, fontSizeTitle: 24, fontSizeSub: 9 },
    lg: { ring: 76, stroke: 9, fontSizeTitle: 32, fontSizeSub: 11 },
  }[size];

  return (
    <View style={styles.container}>
      {/* Anneau Jaune Optimal avec Halo lumineux optionnel */}
      <View style={styles.ringWrapper}>
        {withGlow && (
          <Svg
            height={dimensions.ring + 40}
            width={dimensions.ring + 40}
            style={StyleSheet.absoluteFill}
          >
            <Defs>
              <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor="#FFE500" stopOpacity="0.45" />
                <Stop offset="100%" stopColor="#FFE500" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle
              cx={(dimensions.ring + 40) / 2}
              cy={(dimensions.ring + 40) / 2}
              r={(dimensions.ring + 30) / 2}
              fill="url(#glow)"
            />
          </Svg>
        )}
        <Svg height={dimensions.ring} width={dimensions.ring}>
          <Circle
            cx={dimensions.ring / 2}
            cy={dimensions.ring / 2}
            r={(dimensions.ring - dimensions.stroke) / 2}
            stroke={colors.primary}
            strokeWidth={dimensions.stroke}
            fill="none"
          />
        </Svg>
      </View>

      {/* Typographie de Marque : OPTIMAL - WEB EXCHANGE COMPANY */}
      <View style={styles.textContainer}>
        <Text style={[styles.title, { fontSize: dimensions.fontSizeTitle }]}>OPTIMAL</Text>
        <View style={styles.subContainer}>
          <Text style={[styles.subRed, { fontSize: dimensions.fontSizeSub }]}>WEB EXCHANGE </Text>
          <Text style={[styles.subBlack, { fontSize: dimensions.fontSizeSub }]}>COMPANY</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: 3.5,
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  subRed: {
    fontWeight: '800',
    color: colors.accentRed,
    letterSpacing: 1.2,
  },
  subBlack: {
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 1.2,
  },
});
