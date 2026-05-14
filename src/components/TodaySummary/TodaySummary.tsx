/**
 * TodaySummary — Resumo de Hoje
 * Minha Saúde Feminina
 *
 * Displays a horizontal scrollable row of three SummaryCards:
 *   1. Próxima Menstruação  (calendar-outline)
 *   2. Humor                (happy-outline)
 *   3. Dica do Dia          (bulb-outline, primary accent border)
 *
 * Fallbacks when data is absent:
 *   - nextPeriodDays === undefined → "—"
 *   - mood === undefined           → "Não registrado"
 *   - dailyTip === undefined       → "Nenhuma dica disponível hoje"
 *
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10
 */

import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../theme';
import SummaryCard from './SummaryCard';
import { styles } from './TodaySummary.styles';

// ─── Public interfaces ────────────────────────────────────────────────────────

export interface TodaySummaryData {
  /** Days until next period; undefined when cycle data is unavailable — Req 4.9 */
  nextPeriodDays?: number;
  /** Mood registered by the user today; undefined when not yet logged — Req 4.8 */
  mood?: string;
  /** Daily health tip; undefined when no tip is available — Req 4.10 */
  dailyTip?: string;
}

export interface TodaySummaryProps {
  data: TodaySummaryData;
  /** Callback for the "Ver todos" link — Requirement 4.2 */
  onViewAll?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const TodaySummary: React.FC<TodaySummaryProps> = ({ data, onViewAll }) => {
  const { nextPeriodDays, mood, dailyTip } = data;

  // ── Derived display values with fallbacks ──────────────────────────────────

  /** Req 4.4, 4.9 */
  const periodValue =
    nextPeriodDays !== undefined ? `em ${nextPeriodDays} dias` : '—';

  /** Req 4.5, 4.8 */
  const moodValue = mood !== undefined ? mood : 'Não registrado';

  /** Req 4.6, 4.10 */
  const tipValue =
    dailyTip !== undefined ? dailyTip : 'Nenhuma dica disponível hoje';

  return (
    <View style={styles.container}>
      {/* ── Section header — Req 4.1, 4.2 ─────────────────────────────────── */}
      <View style={styles.header}>
        <Text
          style={styles.sectionTitle}
          allowFontScaling
          maxFontSizeMultiplier={2}
        >
          Resumo de Hoje
        </Text>

        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={onViewAll}
          accessibilityRole="button"
          accessibilityLabel="Ver todos os resumos do dia"
          activeOpacity={0.7}
        >
          <Text
            style={styles.viewAllText}
            allowFontScaling
            maxFontSizeMultiplier={2}
          >
            Ver todos
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Horizontal scroll of cards — Req 4.7 ───────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Card 1 — Próxima Menstruação — Req 4.4, 4.9 */}
        <SummaryCard
          icon="calendar-outline"
          title="Próxima Menstruação"
          value={periodValue}
          accessibilityLabel={`Próxima Menstruação: ${periodValue}`}
        />

        {/* Card 2 — Humor — Req 4.5, 4.8 */}
        <SummaryCard
          icon="happy-outline"
          title="Humor"
          value={moodValue}
          accessibilityLabel={`Humor: ${moodValue}`}
        />

        {/* Card 3 — Dica do Dia — Req 4.6, 4.10 */}
        <SummaryCard
          icon="bulb-outline"
          title="Dica do Dia"
          value={tipValue}
          accentColor={Colors.primary}
          accessibilityLabel={`Dica do Dia: ${tipValue}`}
        />
      </ScrollView>
    </View>
  );
};

export default TodaySummary;
