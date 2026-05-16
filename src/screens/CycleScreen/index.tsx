/**
 * CycleScreen — Tela do Ciclo Menstrual
 * Minha Saúde Feminina
 *
 * Calendário limpo com:
 *  - Seleção do dia de início da menstruação pelo toque
 *  - Cálculo automático das fases (menstruação, fértil, ovulação, lútea)
 *  - Legenda visual simples
 *  - Card com informações da fase atual
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/Header';
import MenuDrawer from '../../components/common/MenuDrawer';
import { Colors, Spacing, Typography, BorderRadius } from '../../theme';
import { MOCK_CYCLE_DATA } from '../../data/mockData';

// ─── Constants ────────────────────────────────────────────────────────────────

const SCREEN_WIDTH = Dimensions.get('window').width;
const CELL_SIZE = Math.floor((SCREEN_WIDTH - Spacing.base * 2 - Spacing.base * 2) / 7);

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const MENSTRUATION_DAYS = 5;
const FERTILE_WINDOW = 5; // days before ovulation

// ─── Types ────────────────────────────────────────────────────────────────────

type DayPhase = 'menstruation' | 'fertile' | 'ovulation' | 'luteal' | 'follicular' | 'none';

interface DayInfo {
  date: Date;
  day: number;
  phase: DayPhase;
  isToday: boolean;
  isCurrentMonth: boolean;
}

// ─── Phase config ─────────────────────────────────────────────────────────────

const PHASE_STYLE: Record<DayPhase, { bg: string; dot: string; label: string }> = {
  menstruation: { bg: Colors.primary,    dot: Colors.primary,    label: 'Menstruação' },
  fertile:      { bg: '#4CAF50',         dot: '#4CAF50',         label: 'Período Fértil' },
  ovulation:    { bg: '#2E7D32',         dot: '#2E7D32',         label: 'Ovulação' },
  luteal:       { bg: '#9C27B0',         dot: '#9C27B0',         label: 'Fase Lútea' },
  follicular:   { bg: Colors.accent,     dot: Colors.accent,     label: 'Fase Folicular' },
  none:         { bg: 'transparent',     dot: 'transparent',     label: '' },
};

// ─── Phase info cards ─────────────────────────────────────────────────────────

const PHASE_INFO = {
  'FASE MENSTRUAL': {
    icon: 'water' as const,
    color: Colors.primary,
    title: 'Fase Menstrual',
    tip: 'Compressas mornas aliviam cólicas. Mantenha hidratação e alimentação leve.',
  },
  'FASE FOLICULAR': {
    icon: 'leaf' as const,
    color: '#4CAF50',
    title: 'Fase Folicular',
    tip: 'Energia em alta! Ótimo momento para atividades físicas e novos projetos.',
  },
  'FASE OVULATÓRIA': {
    icon: 'sunny' as const,
    color: '#2E7D32',
    title: 'Fase Ovulatória',
    tip: 'Período de maior fertilidade. O muco vaginal fica mais elástico e transparente.',
  },
  'FASE LÚTEA': {
    icon: 'moon' as const,
    color: '#9C27B0',
    title: 'Fase Lútea',
    tip: 'Podem surgir sintomas de TPM. Priorize descanso, alimentação equilibrada e autocuidado.',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPhase(date: Date, cycleStart: Date, cycleLength: number): DayPhase {
  const msDay = 86400000;
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const s = new Date(cycleStart.getFullYear(), cycleStart.getMonth(), cycleStart.getDate()).getTime();
  const diff = Math.floor((d - s) / msDay);
  const pos = ((diff % cycleLength) + cycleLength) % cycleLength + 1; // 1-indexed

  const ovDay = cycleLength - 14;
  if (pos >= 1 && pos <= MENSTRUATION_DAYS) return 'menstruation';
  if (pos === ovDay) return 'ovulation';
  if (pos >= ovDay - FERTILE_WINDOW + 1 && pos < ovDay) return 'fertile';
  if (pos > ovDay) return 'luteal';
  return 'follicular';
}

function buildMonth(year: number, month: number, cycleStart: Date, cycleLength: number): DayInfo[] {
  const todayMs = new Date(
    new Date().getFullYear(), new Date().getMonth(), new Date().getDate()
  ).getTime();

  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days: DayInfo[] = [];

  // Leading padding from previous month
  for (let i = first.getDay() - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({ date: d, day: d.getDate(), phase: getPhase(d, cycleStart, cycleLength), isToday: false, isCurrentMonth: false });
  }

  // Current month
  for (let n = 1; n <= last.getDate(); n++) {
    const d = new Date(year, month, n);
    const dMs = d.getTime();
    days.push({ date: d, day: n, phase: getPhase(d, cycleStart, cycleLength), isToday: dMs === todayMs, isCurrentMonth: true });
  }

  // Trailing padding
  const trail = 6 - last.getDay();
  for (let i = 1; i <= trail; i++) {
    const d = new Date(year, month + 1, i);
    days.push({ date: d, day: d.getDate(), phase: getPhase(d, cycleStart, cycleLength), isToday: false, isCurrentMonth: false });
  }

  return days;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const LegendRow: React.FC = () => (
  <View style={s.legendRow}>
    {(Object.entries(PHASE_STYLE) as [DayPhase, typeof PHASE_STYLE[DayPhase]][])
      .filter(([, v]) => v.label)
      .map(([key, val]) => (
        <View key={key} style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: val.dot }]} />
          <Text style={s.legendText}>{val.label}</Text>
        </View>
      ))}
  </View>
);

// ─── Main component ───────────────────────────────────────────────────────────

const CycleScreen: React.FC = () => {
  const today = new Date();

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [cycleStart, setCycleStart] = useState<Date>(
    new Date(MOCK_CYCLE_DATA.startDate)
  );
  const [cycleLength] = useState(MOCK_CYCLE_DATA.cycleLength);
  const [selectMode, setSelectMode] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const days = useMemo(
    () => buildMonth(viewYear, viewMonth, cycleStart, cycleLength),
    [viewYear, viewMonth, cycleStart, cycleLength]
  );

  const currentPhase = MOCK_CYCLE_DATA.phase;
  const phaseInfo = PHASE_INFO[currentPhase];

  // Compute cycle day relative to today
  const todayMs = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const startMs = new Date(cycleStart.getFullYear(), cycleStart.getMonth(), cycleStart.getDate()).getTime();
  const rawDiff = Math.floor((todayMs - startMs) / 86400000);
  const cycleDay = ((rawDiff % cycleLength) + cycleLength) % cycleLength + 1;

  const prevMonth = useCallback(() => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }, [viewMonth]);

  const nextMonth = useCallback(() => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }, [viewMonth]);

  const handleDayPress = useCallback((info: DayInfo) => {
    if (!selectMode || !info.isCurrentMonth) return;
    setCycleStart(new Date(info.date.getFullYear(), info.date.getMonth(), info.date.getDate()));
    setSelectMode(false);
  }, [selectMode]);

  const handleMenuPress = () => setMenuVisible(true);

  return (
    <SafeAreaView style={s.container} edges={['bottom']}>
      <Header onMenuPress={handleMenuPress} />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Phase banner ─────────────────────────────────────────── */}
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
          style={s.banner}
        >
          <View style={s.bannerRow}>
            <View style={s.bannerDayBlock}>
              <Text style={s.bannerDayLabel}>DIA DO CICLO</Text>
              <Text style={s.bannerDayNumber}>{cycleDay}</Text>
            </View>
            <View style={s.bannerDivider} />
            <View style={s.bannerPhaseBlock}>
              <Text style={s.bannerPhaseLabel}>FASE ATUAL</Text>
              <Text style={s.bannerPhase}>{currentPhase}</Text>
              <Text style={s.bannerCycleLen}>Ciclo de {cycleLength} dias</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── Phase tip card ───────────────────────────────────────── */}
        {phaseInfo && (
          <View style={s.tipCard}>
            <View style={[s.tipIconWrap, { backgroundColor: phaseInfo.color + '20' }]}>
              <Ionicons name={phaseInfo.icon} size={22} color={phaseInfo.color} />
            </View>
            <View style={s.tipBody}>
              <Text style={s.tipTitle}>{phaseInfo.title}</Text>
              <Text style={s.tipText}>{phaseInfo.tip}</Text>
            </View>
          </View>
        )}

        {/* ── Calendar card ────────────────────────────────────────── */}
        <View style={s.calCard}>

          {/* Month nav */}
          <View style={s.monthNav}>
            <TouchableOpacity onPress={prevMonth} style={s.navBtn} accessibilityRole="button" accessibilityLabel="Mês anterior">
              <Ionicons name="chevron-back" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={s.monthTitle}>{MONTHS[viewMonth]} {viewYear}</Text>
            <TouchableOpacity onPress={nextMonth} style={s.navBtn} accessibilityRole="button" accessibilityLabel="Próximo mês">
              <Ionicons name="chevron-forward" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Select mode hint */}
          {selectMode && (
            <View style={s.selectHint}>
              <Ionicons name="finger-print-outline" size={16} color={Colors.primary} />
              <Text style={s.selectHintText}>Toque no dia em que sua menstruação começou</Text>
            </View>
          )}

          {/* Weekday headers */}
          <View style={s.weekRow}>
            {WEEKDAYS.map((wd, i) => (
              <Text key={i} style={s.weekDay}>{wd}</Text>
            ))}
          </View>

          {/* Day grid */}
          <View style={s.grid}>
            {days.map((info, idx) => {
              const ps = PHASE_STYLE[info.phase];
              const hasBg = info.phase !== 'none' && info.isCurrentMonth;
              const isStart =
                info.date.getFullYear() === cycleStart.getFullYear() &&
                info.date.getMonth() === cycleStart.getMonth() &&
                info.date.getDate() === cycleStart.getDate();

              return (
                <TouchableOpacity
                  key={idx}
                  style={s.cell}
                  onPress={() => handleDayPress(info)}
                  activeOpacity={selectMode && info.isCurrentMonth ? 0.6 : 1}
                  accessibilityRole="button"
                  accessibilityLabel={`${info.day} de ${MONTHS[info.date.getMonth()]}`}
                >
                  <View style={[
                    s.dayCircle,
                    hasBg && { backgroundColor: ps.bg },
                    info.isToday && s.todayRing,
                    isStart && s.startRing,
                    !info.isCurrentMonth && s.otherMonth,
                  ]}>
                    <Text style={[
                      s.dayText,
                      hasBg && { color: '#fff' },
                      !info.isCurrentMonth && s.otherMonthText,
                      info.isToday && !hasBg && { color: Colors.primary, fontWeight: Typography.fontWeightBold },
                    ]}>
                      {info.day}
                    </Text>
                  </View>
                  {/* Dot indicator for today without bg */}
                  {info.isToday && !hasBg && <View style={s.todayDot} />}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Set start date button */}
          <TouchableOpacity
            style={[s.setStartBtn, selectMode && s.setStartBtnActive]}
            onPress={() => setSelectMode(v => !v)}
            accessibilityRole="button"
            accessibilityLabel="Marcar início da menstruação"
          >
            <Ionicons
              name={selectMode ? 'close-circle-outline' : 'add-circle-outline'}
              size={18}
              color={selectMode ? Colors.error : Colors.primary}
            />
            <Text style={[s.setStartBtnText, selectMode && { color: Colors.error }]}>
              {selectMode ? 'Cancelar seleção' : 'Marcar início da menstruação'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Legend ───────────────────────────────────────────────── */}
        <View style={s.legendCard}>
          <Text style={s.legendTitle}>Legenda</Text>
          <LegendRow />
        </View>

        {/* ── Cycle info ───────────────────────────────────────────── */}
        <View style={s.infoCard}>
          <View style={s.infoRow}>
            <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
            <Text style={s.infoText}>
              Início do ciclo atual:{' '}
              <Text style={s.infoValue}>{cycleStart.toLocaleDateString('pt-BR')}</Text>
            </Text>
          </View>
          <View style={s.infoRow}>
            <Ionicons name="sync-outline" size={16} color={Colors.primary} />
            <Text style={s.infoText}>
              Duração do ciclo:{' '}
              <Text style={s.infoValue}>{cycleLength} dias</Text>
            </Text>
          </View>
          <View style={[s.infoRow, s.warningRow]}>
            <Ionicons name="warning-outline" size={14} color={Colors.warning} />
            <Text style={s.warningText}>
              As previsões são estimativas. Consulte sempre sua UBS para acompanhamento.
            </Text>
          </View>
        </View>

      </ScrollView>

      {/* ── Menu Drawer ──────────────────────────────────────────────── */}
      <MenuDrawer
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        activeScreen="Ciclo"
      />
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Banner
  banner: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg },
  bannerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  bannerDayBlock: {},
  bannerDayLabel: { fontSize: Typography.fontSizeCaption, fontWeight: Typography.fontWeightSemiBold, color: '#fff', opacity: 0.8, letterSpacing: 0.5 },
  bannerDayNumber: { fontSize: 52, fontWeight: Typography.fontWeightBold, color: '#fff', lineHeight: 60 },
  bannerDivider: { width: 1, height: 52, backgroundColor: 'rgba(255,255,255,0.35)' },
  bannerPhaseBlock: { flex: 1 },
  bannerPhaseLabel: { fontSize: Typography.fontSizeCaption, fontWeight: Typography.fontWeightSemiBold, color: '#fff', opacity: 0.8, letterSpacing: 0.5, marginBottom: 2 },
  bannerPhase: { fontSize: Typography.fontSizeMediumTitle, fontWeight: Typography.fontWeightBold, color: '#fff', lineHeight: Typography.lineHeightMediumTitle },
  bannerCycleLen: { fontSize: Typography.fontSizeCaption, color: '#fff', opacity: 0.75, marginTop: 2 },

  // Tip card
  tipCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md,
    backgroundColor: Colors.surface, marginHorizontal: Spacing.base, marginTop: Spacing.base,
    borderRadius: BorderRadius.card, padding: Spacing.base,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  tipIconWrap: { width: 44, height: 44, borderRadius: BorderRadius.circle, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  tipBody: { flex: 1 },
  tipTitle: { fontSize: Typography.fontSizeBody, fontWeight: Typography.fontWeightSemiBold, color: Colors.textPrimary, marginBottom: 4 },
  tipText: { fontSize: Typography.fontSizeCaption, fontWeight: Typography.fontWeightRegular, color: Colors.textSecondary, lineHeight: Typography.lineHeightCaption + 2 },

  // Calendar card
  calCard: {
    backgroundColor: Colors.surface, marginHorizontal: Spacing.base, marginTop: Spacing.base,
    borderRadius: BorderRadius.card, padding: Spacing.base,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },

  // Month nav
  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.base },
  navBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  monthTitle: { fontSize: Typography.fontSizeMediumTitle, fontWeight: Typography.fontWeightSemiBold, color: Colors.textPrimary },

  // Select hint
  selectHint: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    backgroundColor: Colors.surfacePink, borderRadius: BorderRadius.button,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, marginBottom: Spacing.sm,
  },
  selectHintText: { flex: 1, fontSize: Typography.fontSizeCaption, color: Colors.primary, fontWeight: Typography.fontWeightMedium },

  // Weekday row
  weekRow: { flexDirection: 'row', marginBottom: Spacing.xs },
  weekDay: { width: CELL_SIZE, textAlign: 'center', fontSize: Typography.fontSizeCaption, fontWeight: Typography.fontWeightSemiBold, color: Colors.textSecondary },

  // Day grid
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: CELL_SIZE, height: CELL_SIZE, alignItems: 'center', justifyContent: 'center' },
  dayCircle: { width: CELL_SIZE - 6, height: CELL_SIZE - 6, borderRadius: BorderRadius.circle, alignItems: 'center', justifyContent: 'center' },
  dayText: { fontSize: 13, fontWeight: Typography.fontWeightMedium, color: Colors.textPrimary },
  todayRing: { borderWidth: 2, borderColor: Colors.primary },
  startRing: { borderWidth: 2.5, borderColor: Colors.primaryDark },
  otherMonth: { opacity: 0 }, // hide other-month days cleanly
  otherMonthText: { color: Colors.textDisabled },
  todayDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.primary, position: 'absolute', bottom: 2 },

  // Set start button
  setStartBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs,
    marginTop: Spacing.base, paddingVertical: Spacing.sm, borderRadius: BorderRadius.button,
    borderWidth: 1, borderColor: Colors.primary,
  },
  setStartBtnActive: { borderColor: Colors.error, backgroundColor: '#FFF0F0' },
  setStartBtnText: { fontSize: Typography.fontSizeBody, fontWeight: Typography.fontWeightMedium, color: Colors.primary },

  // Legend
  legendCard: {
    backgroundColor: Colors.surface, marginHorizontal: Spacing.base, marginTop: Spacing.base,
    borderRadius: BorderRadius.card, padding: Spacing.base,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  legendTitle: { fontSize: Typography.fontSizeBody, fontWeight: Typography.fontWeightSemiBold, color: Colors.textPrimary, marginBottom: Spacing.md },
  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, width: '47%' },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: Typography.fontSizeCaption, color: Colors.textSecondary },

  // Info card
  infoCard: {
    backgroundColor: Colors.surface, marginHorizontal: Spacing.base, marginTop: Spacing.base, marginBottom: Spacing.xl,
    borderRadius: BorderRadius.card, padding: Spacing.base,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  infoText: { fontSize: Typography.fontSizeBody, color: Colors.textPrimary },
  infoValue: { fontWeight: Typography.fontWeightSemiBold, color: Colors.primary },
  warningRow: { marginTop: Spacing.xs, alignItems: 'flex-start' },
  warningText: { flex: 1, fontSize: Typography.fontSizeCaption, color: Colors.textSecondary, lineHeight: Typography.lineHeightCaption + 2 },
});

export default CycleScreen;
