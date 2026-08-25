import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Bell,
  Plus,
  ClockCounterClockwise,
} from 'phosphor-react-native';
import { authColors } from '../../src/components/auth/AuthUi';

type Transfer = {
  id: string;
  name: string;
  sentAmount: string;
  date: string;
  time: string;
  status: 'completed' | 'processing' | 'cancelled';
};

// Initialisation à zéro (0 mock data)
const TRANSACTIONS_DATA: Transfer[] = [];

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<'all' | 'completed' | 'processing' | 'cancelled'>('all');

  const filtered = TRANSACTIONS_DATA.filter((tx) => {
    if (activeFilter === 'completed') return tx.status === 'completed';
    if (activeFilter === 'processing') return tx.status === 'processing';
    if (activeFilter === 'cancelled') return tx.status === 'cancelled';
    return true;
  });

  return (
    <View style={styles.screen}>
      {/* ── 1. Header Jaune Optimal ── */}
      <View style={[styles.yellowHeader, { paddingTop: Math.max(insets.top, 14) }]}>
        {/* Top Bar : Cloche à gauche + Gros Favicon à droite */}
        <View style={styles.topBar}>
          <Pressable
            style={styles.notifButton}
            onPress={() => router.push('/notifications')}
            accessibilityLabel="Notifications"
            hitSlop={10}
          >
            <Bell size={24} color="#111111" weight="bold" />
            <View style={styles.notifDot} />
          </Pressable>

          <View style={styles.largeFaviconCircle}>
            <Image
              source={require('../../assets/favicon.jpg')}
              style={styles.largeFaviconImage}
              contentFit="contain"
              transition={150}
              cachePolicy="memory-disk"
            />
          </View>
        </View>

        {/* Titre & Sous-titre */}
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Historique</Text>
          <Text style={styles.headerSubtitle}>
            Suivez l’état de vos échanges en temps réel.
          </Text>
        </View>
      </View>

      {/* ── 2. Corps Déroulant : Raccourci + Filtres + Liste / Empty State ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.controlsHeader}>
            {/* Raccourci Gros Bouton « + Nouvel échange » */}
            <Pressable
              style={({ pressed }) => [
                styles.newTransferButton,
                pressed && styles.newTransferButtonPressed,
              ]}
              onPress={() => router.push('/(tabs)/')}
              accessibilityRole="button"
            >
              <Plus size={20} color="#000000" weight="bold" />
              <Text style={styles.newTransferButtonText}>Nouvel échange</Text>
            </Pressable>

            {/* Filtres de statut épurés */}
            <View style={styles.filterRow}>
              {(
                [
                  { id: 'all', label: 'Tous' },
                  { id: 'completed', label: 'Terminés' },
                  { id: 'processing', label: 'En cours' },
                  { id: 'cancelled', label: 'Annulés' },
                ] as const
              ).map((f) => {
                const isActive = activeFilter === f.id;
                return (
                  <Pressable
                    key={f.id}
                    style={[styles.filterChip, isActive && styles.filterChipActive]}
                    onPress={() => setActiveFilter(f.id)}
                  >
                    <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                      {f.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Titre de section sobre */}
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Échanges récents</Text>
              <Text style={styles.sectionCount}>{filtered.length} {filtered.length <= 1 ? 'échange' : 'échanges'}</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <ClockCounterClockwise size={32} color="#8E8E87" weight="regular" />
            </View>
            <Text style={styles.emptyTitle}>Aucun échange pour le moment</Text>
            <Text style={styles.emptyText}>
              Vos échanges récents et leurs reçus apparaîtront ici dès que vous en effectuerez un.
            </Text>
            <Pressable
              style={({ pressed }) => [styles.emptyActionBtn, pressed && styles.emptyActionBtnPressed]}
              onPress={() => router.push('/(tabs)/')}
            >
              <Text style={styles.emptyActionBtnText}>Échanger de l’argent</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.transactionRow,
              index === filtered.length - 1 && styles.transactionRowLast,
            ]}
          >
            <View style={styles.rowLeft}>
              <View style={styles.initialsCircle}>
                <Text style={styles.initialsText}>
                  {item.name.slice(0, 1).toUpperCase()}
                </Text>
              </View>

              <View style={styles.nameAndDate}>
                <Text style={styles.recipientName}>{item.name}</Text>
                <Text style={styles.dateTimeText}>
                  {item.date} • {item.time}
                </Text>
              </View>
            </View>

            <View style={styles.rowRight}>
              <Text style={styles.amountText}>{item.sentAmount}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F3',
  },

  // 1. Header Jaune Optimal
  yellowHeader: {
    backgroundColor: authColors.yellow,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  notifDot: {
    position: 'absolute',
    top: 11,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  largeFaviconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  largeFaviconImage: {
    width: '100%',
    height: '100%',
  },
  headerTitleWrap: {
    gap: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444440',
    lineHeight: 19,
  },

  // 2. Contrôles & Raccourci
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 36,
  },
  controlsHeader: {
    gap: 14,
    marginBottom: 12,
  },

  newTransferButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#EEEEEC',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  newTransferButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  newTransferButtonText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#111111',
  },

  // Filtres
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEC',
  },
  filterChipActive: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  filterChipText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#6E6E68',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // Titre Section
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111111',
  },
  sectionCount: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#8E8E87',
  },

  // Empty State
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#EEEEEC',
    marginTop: 8,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#767670',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
  emptyActionBtn: {
    backgroundColor: authColors.yellow,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 10,
  },
  emptyActionBtnPressed: {
    opacity: 0.88,
  },
  emptyActionBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
  },

  // Transaction Row
  transactionRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EEEEEC',
    marginBottom: 8,
  },
  transactionRowLast: {
    marginBottom: 0,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  initialsCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECECE8',
  },
  initialsText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
  },
  nameAndDate: {
    gap: 2,
    flex: 1,
  },
  recipientName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#111111',
  },
  dateTimeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E87',
  },
  rowRight: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#111111',
  },
});
