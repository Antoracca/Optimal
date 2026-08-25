import React from 'react';
import { Tabs } from 'expo-router';
import { OptimalTabBar } from '../../src/components/tabbar/OptimalTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <OptimalTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="index"
    >
      {/* ── 1. Gauche 1 : Points Relais ── */}
      <Tabs.Screen
        name="relay"
        options={{
          title: 'Points Relais',
        }}
      />

      {/* ── 2. Gauche 2 : Bénéficiaires ── */}
      <Tabs.Screen
        name="recipients"
        options={{
          title: 'Bénéficiaires',
        }}
      />

      {/* ── 3. Milieu (Bouton surélevé Favicon) : Envoyer / Accueil ── */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Envoyer',
        }}
      />

      {/* ── 4. Droite 1 : Historique ── */}
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historique',
        }}
      />

      {/* ── 5. Droite 2 : Manager ── */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Manager',
        }}
      />
    </Tabs>
  );
}
