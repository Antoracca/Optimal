import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { HomeHeroHeader } from '../../src/components/home/HomeHeroHeader';
import { TransferCard } from '../../src/components/home/TransferCard';
import { SecondaryPromoCard } from '../../src/components/home/SecondaryPromoCard';
import { TrackTransferCard } from '../../src/components/home/TrackTransferCard';
import { RelayPointsCard } from '../../src/components/home/RelayPointsCard';
import { RecentRecipients } from '../../src/components/home/RecentRecipients';
import { RecentActivity } from '../../src/components/home/RecentActivity';

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        {/* ── 1. Header Jaune avec Favicon & Carte Promo ── */}
        <HomeHeroHeader />

        {/* ── 2. Corps de la page (Cartes superposées) ── */}
        <View style={styles.body}>
          {/* Carte Principale de Transfert */}
          <TransferCard />

          {/* Carte 1 : Changer la façon dont vous pouvez recevoir l'argent (Barre Cyan) */}
          <SecondaryPromoCard />

          {/* Carte 2 : Suivre vos transferts lors de vos déplacements (Barre Bleue) */}
          <TrackTransferCard />

          {/* Carte 3 : Rechercher une agence partenaire (Barre Jaune) */}
          <RelayPointsCard />

          {/* Bénéficiaires */}
          <RecentRecipients />

          {/* Derniers Transferts */}
          <RecentActivity />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F3',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 36,
  },
  body: {
    paddingHorizontal: 16,
    marginTop: -12,
    gap: 16,
  },
});
