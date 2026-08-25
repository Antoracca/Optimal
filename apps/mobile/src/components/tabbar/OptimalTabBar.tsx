import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  MapPin,
  Users,
  ClockCounterClockwise,
  SquaresFour,
} from 'phosphor-react-native';
import { authColors } from '../auth/AuthUi';

type TabBarProps = {
  state: {
    index: number;
    routes: Array<{ key: string; name: string; params?: object }>;
  };
  descriptors: Record<string, any>;
  navigation: any;
};

export function OptimalTabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();

  const getIcon = (routeName: string, isFocused: boolean) => {
    const color = isFocused ? '#111111' : '#8E8E87';
    const weight = isFocused ? 'fill' : 'regular';
    const size = 23;

    switch (routeName) {
      case 'relay':
        return <MapPin size={size} color={color} weight={weight} />;
      case 'recipients':
        return <Users size={size} color={color} weight={weight} />;
      case 'history':
        return <ClockCounterClockwise size={size} color={color} weight={weight} />;
      case 'profile':
      case 'manage':
        return <SquaresFour size={size} color={color} weight={weight} />;
      default:
        return <MapPin size={size} color={color} weight={weight} />;
    }
  };

  const getLabel = (routeName: string) => {
    switch (routeName) {
      case 'relay':
        return 'Points Relais';
      case 'recipients':
        return 'Bénéficiaires';
      case 'send':
      case 'index':
        return 'Échanger';
      case 'history':
        return 'Historique';
      case 'profile':
      case 'manage':
        return 'Manager';
      default:
        return routeName;
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.bar}>
        {state.routes.map((route: { key: string; name: string; params?: object }, index: number) => {
          const isFocused = state.index === index;
          const isSendButton = route.name === 'send' || route.name === 'index';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          // ── Bouton Central surélevé sur FOND BLANC épuré (Accueil / Envoyer) ──
          if (isSendButton) {
            return (
              <View key={route.key} style={styles.sendButtonWrap}>
                <Pressable
                  onPress={onPress}
                  style={({ pressed }) => [
                    styles.sendButton,
                    pressed && styles.sendButtonPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Envoyer de l'argent"
                >
                  <Image
                    source={require('../../../assets/favicon.jpg')}
                    style={styles.faviconIcon}
                    contentFit="contain"
                    transition={150}
                    cachePolicy="memory-disk"
                  />
                </Pressable>
                <Text style={styles.sendButtonLabel} numberOfLines={1}>Envoyer</Text>
              </View>
            );
          }

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
            >
              <View style={styles.iconContainer}>{getIcon(route.name, isFocused)}</View>
              <Text
                style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {getLabel(route.name)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: authColors.white,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEC',
    paddingTop: 6,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  tabItem: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 2,
    gap: 3,
  },
  iconContainer: {
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#8E8E87',
    textAlign: 'center',
    letterSpacing: -0.2,
    height: 14,
    lineHeight: 14,
  },
  tabLabelFocused: {
    color: '#111111',
    fontWeight: '800',
  },

  // Bouton central surélevé FOND BLANC PUR (Favicon agrandi)
  sendButtonWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
    paddingHorizontal: 2,
    width: 68,
  },
  sendButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E2DC',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  faviconIcon: {
    width: 44,
    height: 44,
  },
  sendButtonPressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.85,
  },
  sendButtonLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#111111',
    marginTop: 3,
    height: 14,
    lineHeight: 14,
    textAlign: 'center',
  },
});
