import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Check } from 'phosphor-react-native';
import { authColors } from '../auth/AuthUi';

export function SuccessAnimation() {
  const scaleCircle = useRef(new Animated.Value(0)).current;
  const scaleCheck = useRef(new Animated.Value(0)).current;
  const opacityRipple = useRef(new Animated.Value(0.6)).current;
  const scaleRipple = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // 1. Cercle jaune rebondit (Spring physique)
    Animated.spring(scaleCircle, {
      toValue: 1,
      damping: 12,
      stiffness: 160,
      mass: 0.8,
      useNativeDriver: true,
    }).start();

    // 2. Onde de choc / Halo doux qui s'étend
    Animated.parallel([
      Animated.timing(scaleRipple, {
        toValue: 1.5,
        duration: 900,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityRipple, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();

    // 3. Coche noire qui jaillit
    setTimeout(() => {
      Animated.spring(scaleCheck, {
        toValue: 1,
        damping: 10,
        stiffness: 200,
        useNativeDriver: true,
      }).start();
    }, 150);
  }, []);

  return (
    <View style={styles.wrap}>
      {/* Onde lumineuse extérieure */}
      <Animated.View
        style={[
          styles.ripple,
          {
            opacity: opacityRipple,
            transform: [{ scale: scaleRipple }],
          },
        ]}
      />

      {/* Cercle jaune Optimal centré */}
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ scale: scaleCircle }],
          },
        ]}
      >
        <Animated.View style={{ transform: [{ scale: scaleCheck }] }}>
          <Check size={52} color={authColors.ink} weight="bold" />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FFE500',
  },
  circle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FFE500',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFE500',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
});
