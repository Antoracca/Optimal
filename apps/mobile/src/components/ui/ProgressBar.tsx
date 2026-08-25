import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radii } from '../../theme';

interface ProgressBarProps {
  totalSteps: number;
  currentStep: number; // 1-indexé (ex: 1, 2, 3, 4)
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ totalSteps, currentStep }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index < currentStep;
        const isCurrent = index === currentStep - 1;
        return (
          <View
            key={index}
            style={[
              styles.segment,
              isActive && styles.activeSegment,
              isCurrent && styles.currentSegment,
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 6,
    height: 4,
    width: '100%',
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: radii.full,
    backgroundColor: colors.border,
  },
  activeSegment: {
    backgroundColor: colors.primary,
  },
  currentSegment: {
    backgroundColor: colors.primary,
  },
});
