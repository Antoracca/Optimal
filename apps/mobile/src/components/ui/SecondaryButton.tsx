import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radii, typography } from '../../theme';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'outline' | 'filled' | 'ghost';
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  variant = 'outline',
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'outline' && styles.outline,
        variant === 'filled' && styles.filled,
        variant === 'ghost' && styles.ghost,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.text,
          variant === 'filled' && styles.textFilled,
          variant === 'ghost' && styles.textGhost,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  outline: {
    backgroundColor: colors.bgPrimary,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  filled: {
    backgroundColor: colors.bgSecondary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  text: {
    ...typography.buttonText,
    color: colors.textPrimary,
  },
  textFilled: {
    color: colors.textPrimary,
  },
  textGhost: {
    color: colors.textSecondary,
  },
});
