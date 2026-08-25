/**
 * HistoryScreen — Histórico de Registros de Ciclo
 * Minha Saúde Feminina
 *
 * Lista cronológica de todos os ciclos registrados com:
 *  - Data de início e término de cada ciclo
 *  - Duração da menstruação e do ciclo
 *  - Estatísticas agregadas (média de ciclo e período)
 *  - Opção de deletar registros individuais
 */

import React, { useCallback } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Typography, BorderRadius } from '../../theme';
import { useCycleData } from '../../hooks/useCycleData';
import { CycleRecord } from '../../data/cycleStorage';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateBR(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  const dateA = new Date(ay, am - 1, ad);
  const dateB = new Date(by, bm - 1, bd);
  return Math.round((dateB.getTime() - dateA.getTime()) / 86_400_000);
}

// ─── Main component ───────────────────────────────────────────────────────────

const HistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const {
    records,
    averageCycleLength,
    averagePeriodLength,
    deleteCycle,
  } = useCycleData();

  const handleDelete = useCallback((record: CycleRecord) => {
    Alert.alert(
      'Excluir Registro',
      `Deseja excluir o registro de ${formatDateBR(record.startDate)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteCycle(record.id),
        },
      ],
    );
  }, [deleteCycle]);

  const renderRecord = useCallback(({ item, index }: { item: CycleRecord; index: number }) => {
    const periodDays = item.endDate
      ? daysBetween(item.startDate, item.endDate) + 1
      : null;

    // Duração do ciclo: dias entre este início e o próximo início
    // records vem ordenado por mais recente primeiro
    const nextRecord = index < records.length - 1 ? records[index + 1] : null;
    let cycleDays: number | null = null;
    if (nextRecord) {
      cycleDays = daysBetween(nextRecord.startDate, item.startDate);
    }

    const isActive = item.endDate === null;

    return (
      <View style={[s.recordCard, isActive && s.recordCardActive]}>
        <View style={s.recordHeader}>
          <View style={s.recordBadge}>
            <Ionicons
              name={isActive ? 'water' : 'checkmark-circle'}
              size={18}
              color={isActive ? Colors.primary : '#4CAF50'}
            />
            <Text style={[s.recordBadgeText, isActive && { color: Colors.primary }]}>
              {isActive ? 'Em andamento' : 'Finalizado'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDelete(item)}
            style={s.deleteBtn}
            accessibilityRole="button"
            accessibilityLabel={`Excluir registro de ${formatDateBR(item.startDate)}`}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={18} color={Colors.error} />
          </TouchableOpacity>
        </View>

        <View style={s.recordBody}>
          <View style={s.recordDateRow}>
            <View style={s.recordDateItem}>
              <Text style={s.recordDateLabel}>Início</Text>
              <Text style={s.recordDateValue}>{formatDateBR(item.startDate)}</Text>
            </View>
            <Ionicons name="arrow-forward" size={16} color={Colors.textDisabled} />
            <View style={s.recordDateItem}>
              <Text style={s.recordDateLabel}>Término</Text>
              <Text style={[s.recordDateValue, !item.endDate && s.recordDatePending]}>
                {item.endDate ? formatDateBR(item.endDate) : '—'}
              </Text>
            </View>
          </View>

          <View style={s.recordStats}>
            {periodDays !== null && (
              <View style={s.recordStatItem}>
                <Ionicons name="water-outline" size={14} color={Colors.primary} />
                <Text style={s.recordStatText}>{periodDays} dia{periodDays > 1 ? 's' : ''} de menstruação</Text>
              </View>
            )}
            {cycleDays !== null && (
              <View style={s.recordStatItem}>
                <Ionicons name="sync-outline" size={14} color={Colors.primary} />
                <Text style={s.recordStatText}>{cycleDays} dias de ciclo</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }, [records, handleDelete]);

  const renderHeader = useCallback(() => (
    <View style={s.statsCard}>
      <Text style={s.statsTitle}>Resumo do Histórico</Text>
      <View style={s.statsRow}>
        <View style={s.statsItem}>
          <Text style={s.statsValue}>{records.length}</Text>
          <Text style={s.statsLabel}>Registros</Text>
        </View>
        <View style={s.statsSeparator} />
        <View style={s.statsItem}>
          <Text style={s.statsValue}>{averageCycleLength}</Text>
          <Text style={s.statsLabel}>Ciclo médio (dias)</Text>
        </View>
        <View style={s.statsSeparator} />
        <View style={s.statsItem}>
          <Text style={s.statsValue}>{averagePeriodLength}</Text>
          <Text style={s.statsLabel}>Período médio (dias)</Text>
        </View>
      </View>
    </View>
  ), [records.length, averageCycleLength, averagePeriodLength]);

  const renderEmpty = useCallback(() => (
    <View style={s.emptyCard}>
      <Ionicons name="document-text-outline" size={48} color={Colors.textDisabled} />
      <Text style={s.emptyTitle}>Nenhum registro encontrado</Text>
      <Text style={s.emptyText}>
        Registre seus ciclos na tela principal para vê-los aqui.
      </Text>
    </View>
  ), []);

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={s.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Histórico de Registros</Text>
        <View style={s.headerRight} />
      </View>

      {/* ── List ───────────────────────────────────────────────────── */}
      <FlatList
        data={records}
        renderItem={renderRecord}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={records.length > 0 ? renderHeader : undefined}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40, height: 40,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    flex: 1, textAlign: 'center',
    fontSize: Typography.fontSizeMediumTitle, fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textPrimary,
  },
  headerRight: { width: 40 },

  // List
  listContent: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },

  // Stats card
  statsCard: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.card,
    padding: Spacing.base, marginBottom: Spacing.base,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
    borderLeftWidth: 4, borderLeftColor: Colors.primary,
  },
  statsTitle: {
    fontSize: Typography.fontSizeBody, fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textPrimary, marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.background, borderRadius: BorderRadius.button,
    paddingVertical: Spacing.md,
  },
  statsItem: { flex: 1, alignItems: 'center' },
  statsValue: {
    fontSize: Typography.fontSizeLargeTitle, fontWeight: Typography.fontWeightBold,
    color: Colors.primary,
  },
  statsLabel: {
    fontSize: 10, color: Colors.textSecondary, marginTop: 2, textAlign: 'center',
  },
  statsSeparator: {
    width: 1, height: 32, backgroundColor: Colors.border,
  },

  // Record card
  recordCard: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.card,
    padding: Spacing.base, marginBottom: Spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  recordCardActive: {
    borderLeftWidth: 3, borderLeftColor: Colors.primary,
  },
  recordHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  recordBadge: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    backgroundColor: Colors.background, borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
  },
  recordBadgeText: {
    fontSize: Typography.fontSizeCaption, fontWeight: Typography.fontWeightMedium,
    color: '#4CAF50',
  },
  deleteBtn: {
    width: 36, height: 36,
    alignItems: 'center', justifyContent: 'center',
    borderRadius: BorderRadius.circle,
  },
  recordBody: {},
  recordDateRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    gap: Spacing.md, marginBottom: Spacing.md,
  },
  recordDateItem: { flex: 1 },
  recordDateLabel: {
    fontSize: Typography.fontSizeCaption, color: Colors.textSecondary,
    marginBottom: 2,
  },
  recordDateValue: {
    fontSize: Typography.fontSizeBody, fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textPrimary,
  },
  recordDatePending: { color: Colors.textDisabled },
  recordStats: { gap: Spacing.xs },
  recordStatItem: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
  },
  recordStatText: {
    fontSize: Typography.fontSizeCaption, color: Colors.textSecondary,
  },

  // Empty state
  emptyCard: {
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.surface, borderRadius: BorderRadius.card,
    padding: Spacing.xxl, marginTop: Spacing.xxl,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  emptyTitle: {
    fontSize: Typography.fontSizeMediumTitle, fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textPrimary, marginTop: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.fontSizeCaption, color: Colors.textSecondary,
    textAlign: 'center', marginTop: Spacing.sm, lineHeight: Typography.lineHeightCaption + 4,
  },
});

export default HistoryScreen;
