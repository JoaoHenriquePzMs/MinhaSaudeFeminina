/**
 * CycleScreen — Tela do Ciclo Menstrual
 * Minha Saúde Feminina
 *
 * Calendário com seleção direta de datas pelo toque:
 *  - Toque no calendário para marcar início/término da menstruação
 *  - Visualização dos períodos menstruais registrados
 *  - Previsão da próxima menstruação
 *  - Card de informações da fase atual
 *  - Acesso ao histórico de registros
 *  - Dados reais persistidos via AsyncStorage
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../../components/Header';
import MenuDrawer from '../../components/common/MenuDrawer';
import { Colors, Spacing, Typography, BorderRadius } from '../../theme';
import { useCycleData } from '../../hooks/useCycleData';
import {
  isDateInPeriod,
  isDateInPrediction,
  todayISO,
  CycleRecord,
} from '../../data/cycleStorage';
import { RootStackParamList } from '../../navigation/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const SCREEN_WIDTH = Dimensions.get('window').width;
const CAL_PADDING = Spacing.base * 2;
const CELL_SIZE = Math.floor((SCREEN_WIDTH - CAL_PADDING - Spacing.base * 2) / 7);

// Ensure CIRCLE_SIZE is an even number to prevent Android border-radius fractional rendering bugs
const RAW_CIRCLE_SIZE = CELL_SIZE - 8;
const CIRCLE_SIZE = RAW_CIRCLE_SIZE % 2 === 0 ? RAW_CIRCLE_SIZE : RAW_CIRCLE_SIZE - 1;
const CIRCLE_RADIUS = CIRCLE_SIZE / 2;

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

// ─── Paleta de cores amigáveis ────────────────────────────────────────────────

const CalColors = {
  /** Rosa suave para dias de menstruação registrada */
  period: '#F4A6B8',
  /** Rosa muito claro para previsão */
  prediction: '#FADCE3',
  /** Texto sobre fundo de período */
  periodText: '#FFFFFF',
  /** Texto sobre fundo de previsão */
  predictionText: '#C2728A',
  /** Anel do dia atual */
  todayBorder: '#E88FA5',
  /** Fundo leve do dia atual (sem período) */
  todayBg: '#FFF0F3',
  /** Texto do dia atual */
  todayText: '#D4637D',
  /** Fundo do dia selecionado no modo seleção */
  selectedBg: '#C43A4A',
  /** Texto do dia selecionado */
  selectedText: '#FFFFFF',
};

// ─── Types ────────────────────────────────────────────────────────────────────

type DayMarking = 'period' | 'prediction' | 'none';

/** Modo de seleção: null = inativo, 'start' = selecionando início, 'end' = selecionando fim */
type SelectionMode = 'start' | 'end' | null;

interface DayInfo {
  date: Date;
  dateISO: string;
  day: number;
  marking: DayMarking;
  isToday: boolean;
  isCurrentMonth: boolean;
  isFuture: boolean;
}

// ─── Phase info cards ─────────────────────────────────────────────────────────

const PHASE_INFO = {
  'FASE MENSTRUAL': {
    icon: 'water' as const,
    color: '#E88FA5',
    title: 'Fase Menstrual',
    tip: 'Compressas mornas aliviam cólicas. Mantenha hidratação e alimentação leve.',
  },
  'FASE FOLICULAR': {
    icon: 'leaf' as const,
    color: '#7BC4A8',
    title: 'Fase Folicular',
    tip: 'Energia em alta! Ótimo momento para atividades físicas e novos projetos.',
  },
  'FASE OVULATÓRIA': {
    icon: 'sunny' as const,
    color: '#F5C26B',
    title: 'Fase Ovulatória',
    tip: 'Período de maior fertilidade. O muco vaginal fica mais elástico e transparente.',
  },
  'FASE LÚTEA': {
    icon: 'moon' as const,
    color: '#B8A9D4',
    title: 'Fase Lútea',
    tip: 'Podem surgir sintomas de TPM. Priorize descanso, alimentação equilibrada e autocuidado.',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function buildMonth(
  year: number,
  month: number,
  records: CycleRecord[],
  todayStr: string,
): DayInfo[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days: DayInfo[] = [];

  const todayParts = todayStr.split('-').map(Number);
  const todayDate = new Date(todayParts[0], todayParts[1] - 1, todayParts[2]);

  const addDay = (d: Date, isCurrentMonth: boolean) => {
    const iso = toISO(d);
    const isToday = iso === todayStr;
    const isFuture = d.getTime() > todayDate.getTime();
    let marking: DayMarking = 'none';

    if (isDateInPeriod(iso, records)) {
      marking = 'period';
    } else if (isDateInPrediction(iso, records)) {
      marking = 'prediction';
    }

    days.push({
      date: d,
      dateISO: iso,
      day: d.getDate(),
      marking,
      isToday,
      isCurrentMonth,
      isFuture,
    });
  };

  // Leading padding
  for (let i = first.getDay() - 1; i >= 0; i--) {
    addDay(new Date(year, month, -i), false);
  }

  // Current month
  for (let n = 1; n <= last.getDate(); n++) {
    addDay(new Date(year, month, n), true);
  }

  // Trailing padding
  const trail = 6 - last.getDay();
  for (let i = 1; i <= trail; i++) {
    addDay(new Date(year, month + 1, i), false);
  }

  return days;
}

function formatDateBR(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

// ─── Legend ───────────────────────────────────────────────────────────────────

const LEGEND_ITEMS = [
  { color: CalColors.period, label: 'Menstruação', type: 'fill' as const },
  { color: CalColors.prediction, label: 'Previsão', type: 'fill' as const },
  { color: CalColors.todayBorder, label: 'Hoje', type: 'ring' as const },
];

const LegendRow: React.FC = () => (
  <View style={s.legendRow}>
    {LEGEND_ITEMS.map((item, i) => (
      <View key={i} style={s.legendItem}>
        <View style={[
          s.legendDot,
          item.type === 'fill'
            ? { backgroundColor: item.color }
            : { backgroundColor: 'transparent', borderWidth: 2, borderColor: item.color },
        ]} />
        <Text style={s.legendText}>{item.label}</Text>
      </View>
    ))}
  </View>
);

// ─── Main component ───────────────────────────────────────────────────────────

const CycleScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const today = new Date();
  const todayStr = todayISO();

  const {
    records,
    activeRecord,
    cycleDay,
    phase,
    averageCycleLength,
    averagePeriodLength,
    nextPeriodDate,
    daysUntilNext,
    loading,
    startPeriod,
    endPeriod,
  } = useCycleData();

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [menuVisible, setMenuVisible] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Modo de seleção no calendário
  const [selectionMode, setSelectionMode] = useState<SelectionMode>(null);

  const phaseInfo = PHASE_INFO[phase];

  const days = useMemo(
    () => buildMonth(viewYear, viewMonth, records, todayStr),
    [viewYear, viewMonth, records, todayStr]
  );

  const prevMonth = useCallback(() => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }, [viewMonth]);

  const nextMonth = useCallback(() => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }, [viewMonth]);

  // ── Calendar tap handler ────────────────────────────────────────────────────

  const handleDayPress = useCallback(async (info: DayInfo) => {
    // Ignora se não está em modo seleção, dia de outro mês ou dia futuro
    if (selectionMode === null) return;
    if (!info.isCurrentMonth) return;
    if (info.isFuture) {
      Alert.alert('Data inválida', 'Não é possível selecionar uma data futura.');
      return;
    }

    // Validação extra para fim: não pode ser antes do início
    if (selectionMode === 'end' && activeRecord) {
      if (info.dateISO < activeRecord.startDate) {
        Alert.alert('Data inválida', 'O término não pode ser antes do início da menstruação.');
        return;
      }
    }

    const dateStr = formatDateBR(info.dateISO);
    const actionLabel = selectionMode === 'start'
      ? `Iniciar menstruação em ${dateStr}?`
      : `Finalizar menstruação em ${dateStr}?`;

    Alert.alert(
      selectionMode === 'start' ? 'Confirmar Início' : 'Confirmar Término',
      actionLabel,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            setActionLoading(true);
            try {
              if (selectionMode === 'start') {
                await startPeriod(info.dateISO);
              } else {
                await endPeriod(info.dateISO);
              }
            } catch {
              Alert.alert('Erro', 'Não foi possível salvar o registro.');
            } finally {
              setActionLoading(false);
              setSelectionMode(null);
            }
          },
        },
      ],
    );
  }, [selectionMode, activeRecord, startPeriod, endPeriod]);

  const handleMenuPress = () => setMenuVisible(true);

  // ── Loading ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <SafeAreaView style={s.container} edges={['bottom']}>
        <Header onMenuPress={handleMenuPress} />
        <View style={s.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={s.loadingText}>Carregando dados...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────

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
              <Text style={s.bannerDayNumber}>{cycleDay ?? '—'}</Text>
            </View>
            <View style={s.bannerDivider} />
            <View style={s.bannerPhaseBlock}>
              <Text style={s.bannerPhaseLabel}>FASE ATUAL</Text>
              <Text style={s.bannerPhase}>{phase}</Text>
              <Text style={s.bannerCycleLen}>Ciclo médio de {averageCycleLength} dias</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── Phase tip card ───────────────────────────────────────── */}
        {phaseInfo && (
          <View style={s.tipCard}>
            <View style={[s.tipIconWrap, { backgroundColor: phaseInfo.color + '25' }]}>
              <Ionicons name={phaseInfo.icon} size={22} color={phaseInfo.color} />
            </View>
            <View style={s.tipBody}>
              <Text style={s.tipTitle}>{phaseInfo.title}</Text>
              <Text style={s.tipText}>{phaseInfo.tip}</Text>
            </View>
          </View>
        )}

        {/* ── Action buttons ───────────────────────────────────────── */}
        <View style={s.actionCard}>
          {activeRecord ? (
            <>
              <View style={s.activeIndicator}>
                <View style={s.activeDot} />
                <Text style={s.activeText}>
                  Menstruação em andamento (desde {formatDateBR(activeRecord.startDate)})
                </Text>
              </View>
              <TouchableOpacity
                style={[s.endBtn, selectionMode === 'end' && s.btnActive]}
                onPress={() => setSelectionMode(selectionMode === 'end' ? null : 'end')}
                disabled={actionLoading}
                accessibilityRole="button"
                accessibilityLabel="Finalizar menstruação"
                activeOpacity={0.8}
              >
                {actionLoading ? (
                  <ActivityIndicator size="small" color={Colors.textOnPrimary} />
                ) : (
                  <>
                    <Ionicons
                      name={selectionMode === 'end' ? 'close-circle' : 'checkmark-circle'}
                      size={20}
                      color={Colors.textOnPrimary}
                    />
                    <Text style={s.endBtnText}>
                      {selectionMode === 'end' ? 'Cancelar Seleção' : 'Finalizar Menstruação'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[s.startBtn, selectionMode === 'start' && s.btnActive]}
              onPress={() => setSelectionMode(selectionMode === 'start' ? null : 'start')}
              disabled={actionLoading}
              accessibilityRole="button"
              accessibilityLabel="Iniciar menstruação"
              activeOpacity={0.8}
            >
              {actionLoading ? (
                <ActivityIndicator size="small" color={Colors.textOnPrimary} />
              ) : (
                <>
                  <Ionicons
                    name={selectionMode === 'start' ? 'close-circle' : 'add-circle'}
                    size={20}
                    color={Colors.textOnPrimary}
                  />
                  <Text style={s.startBtnText}>
                    {selectionMode === 'start' ? 'Cancelar Seleção' : 'Iniciar Menstruação'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* ── Selection mode hint ──────────────────────────────────── */}
        {selectionMode !== null && (
          <View style={s.selectionHint}>
            <Ionicons name="hand-left-outline" size={18} color={Colors.primary} />
            <Text style={s.selectionHintText}>
              {selectionMode === 'start'
                ? 'Toque no dia em que sua menstruação começou'
                : 'Toque no dia em que sua menstruação terminou'}
            </Text>
          </View>
        )}

        {/* ── Prediction card ──────────────────────────────────────── */}
        {nextPeriodDate && !activeRecord && selectionMode === null && (
          <View style={s.predictionCard}>
            <View style={s.predictionHeader}>
              <Ionicons name="calendar" size={20} color={Colors.primary} />
              <Text style={s.predictionTitle}>Previsão do Próximo Ciclo</Text>
            </View>
            <View style={s.predictionBody}>
              <Text style={s.predictionDate}>{formatDateBR(nextPeriodDate)}</Text>
              {daysUntilNext !== null && (
                <Text style={s.predictionDays}>
                  {daysUntilNext > 0
                    ? `Faltam ${daysUntilNext} dias`
                    : daysUntilNext === 0
                    ? 'Previsto para hoje!'
                    : `${Math.abs(daysUntilNext)} dias de atraso`}
                </Text>
              )}
            </View>
            <View style={s.predictionStats}>
              <View style={s.statItem}>
                <Text style={s.statValue}>{averageCycleLength}</Text>
                <Text style={s.statLabel}>dias de ciclo</Text>
              </View>
              <View style={s.statDivider} />
              <View style={s.statItem}>
                <Text style={s.statValue}>{averagePeriodLength}</Text>
                <Text style={s.statLabel}>dias de período</Text>
              </View>
              <View style={s.statDivider} />
              <View style={s.statItem}>
                <Text style={s.statValue}>{records.length}</Text>
                <Text style={s.statLabel}>registros</Text>
              </View>
            </View>
          </View>
        )}

        {/* ── Calendar card ────────────────────────────────────────── */}
        <View style={[s.calCard, selectionMode !== null && s.calCardActive]}>

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

          {/* Weekday headers */}
          <View style={s.weekRow}>
            {WEEKDAYS.map((wd, i) => (
              <Text key={i} style={s.weekDay}>{wd}</Text>
            ))}
          </View>

          {/* Day grid */}
          <View style={s.grid}>
            {days.map((info, idx) => {
              const isPeriod = info.marking === 'period' && info.isCurrentMonth;
              const isPrediction = info.marking === 'prediction' && info.isCurrentMonth;
              const isMarked = isPeriod || isPrediction;
              const showTodayRing = info.isToday && info.isCurrentMonth;
              const isSelectable = selectionMode !== null && info.isCurrentMonth && !info.isFuture;

              return (
                <TouchableOpacity
                  key={idx}
                  style={s.cell}
                  onPress={() => handleDayPress(info)}
                  activeOpacity={isSelectable ? 0.5 : 1}
                  disabled={!isSelectable}
                  accessibilityRole={isSelectable ? 'button' : 'text'}
                  accessibilityLabel={`${info.day} de ${MONTHS[info.date.getMonth()]}`}
                >
                  <View style={[
                    s.dayCircle,
                    isPeriod && s.periodCircle,
                    isPrediction && s.predictionCircle,
                    showTodayRing && !isMarked && s.todayCircle,
                    showTodayRing && isMarked && s.todayMarkedRing,
                    !info.isCurrentMonth && s.otherMonth,
                    // Modo seleção: dias futuros ficam opacos
                    isSelectable && s.selectableDay,
                    selectionMode !== null && info.isFuture && info.isCurrentMonth && s.futureDay,
                  ]}>
                    <Text style={[
                      s.dayText,
                      isPeriod && { color: CalColors.periodText },
                      isPrediction && { color: CalColors.predictionText },
                      showTodayRing && !isMarked && { color: CalColors.todayText, fontWeight: Typography.fontWeightBold },
                      !info.isCurrentMonth && s.otherMonthText,
                      selectionMode !== null && info.isFuture && info.isCurrentMonth && { opacity: 0.3 },
                    ]}>
                      {info.day}
                    </Text>
                  </View>
                  {/* Small dot under today */}
                  {showTodayRing && !isMarked && <View style={s.todayDot} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Legend ───────────────────────────────────────────────── */}
        <View style={s.legendCard}>
          <Text style={s.legendTitle}>Legenda</Text>
          <LegendRow />
        </View>

        {/* ── History link ─────────────────────────────────────────── */}
        {records.length > 0 && (
          <TouchableOpacity
            style={s.historyBtn}
            onPress={() => navigation.navigate('History')}
            accessibilityRole="button"
            accessibilityLabel="Ver histórico de registros"
            activeOpacity={0.8}
          >
            <View style={s.historyBtnLeft}>
              <Ionicons name="time-outline" size={22} color={Colors.primary} />
              <View>
                <Text style={s.historyBtnTitle}>Histórico de Registros</Text>
                <Text style={s.historyBtnSub}>
                  {records.length} ciclo{records.length > 1 ? 's' : ''} registrado{records.length > 1 ? 's' : ''}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}

        {/* ── Info card ────────────────────────────────────────────── */}
        <View style={s.infoCard}>
          <View style={s.infoRow}>
            <Ionicons name="sync-outline" size={16} color={Colors.primary} />
            <Text style={s.infoText}>
              Duração média do ciclo:{' '}
              <Text style={s.infoValue}>{averageCycleLength} dias</Text>
            </Text>
          </View>
          <View style={s.infoRow}>
            <Ionicons name="water-outline" size={16} color={CalColors.period} />
            <Text style={s.infoText}>
              Duração média da menstruação:{' '}
              <Text style={s.infoValue}>{averagePeriodLength} dias</Text>
            </Text>
          </View>
          <View style={[s.infoRow, s.warningRow]}>
            <Ionicons name="warning-outline" size={14} color={Colors.warning} />
            <Text style={s.warningText}>
              As previsões são estimativas. Consulte sempre sua UBS para acompanhamento.
            </Text>
          </View>
        </View>

        {/* ── Empty state ──────────────────────────────────────────── */}
        {records.length === 0 && selectionMode === null && (
          <View style={s.emptyCard}>
            <Ionicons name="calendar-outline" size={48} color={Colors.textDisabled} />
            <Text style={s.emptyTitle}>Nenhum registro ainda</Text>
            <Text style={s.emptyText}>
              Toque em "Iniciar Menstruação" e depois selecione o dia no calendário.
            </Text>
          </View>
        )}

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

  // Loading
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.md },
  loadingText: { fontSize: Typography.fontSizeBody, color: Colors.textSecondary },

  // Banner
  banner: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg },
  bannerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  bannerDayBlock: {},
  bannerDayLabel: {
    fontSize: Typography.fontSizeCaption, fontWeight: Typography.fontWeightSemiBold,
    color: '#fff', opacity: 0.8, letterSpacing: 0.5,
  },
  bannerDayNumber: { fontSize: 52, fontWeight: Typography.fontWeightBold, color: '#fff', lineHeight: 60 },
  bannerDivider: { width: 1, height: 52, backgroundColor: 'rgba(255,255,255,0.35)' },
  bannerPhaseBlock: { flex: 1 },
  bannerPhaseLabel: {
    fontSize: Typography.fontSizeCaption, fontWeight: Typography.fontWeightSemiBold,
    color: '#fff', opacity: 0.8, letterSpacing: 0.5, marginBottom: 2,
  },
  bannerPhase: {
    fontSize: Typography.fontSizeMediumTitle, fontWeight: Typography.fontWeightBold,
    color: '#fff', lineHeight: Typography.lineHeightMediumTitle,
  },
  bannerCycleLen: { fontSize: Typography.fontSizeCaption, color: '#fff', opacity: 0.75, marginTop: 2 },

  // Tip card
  tipCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md,
    backgroundColor: Colors.surface, marginHorizontal: Spacing.base, marginTop: Spacing.base,
    borderRadius: BorderRadius.card, padding: Spacing.base,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  tipIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  tipBody: { flex: 1 },
  tipTitle: {
    fontSize: Typography.fontSizeBody, fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textPrimary, marginBottom: 4,
  },
  tipText: {
    fontSize: Typography.fontSizeCaption, fontWeight: Typography.fontWeightRegular,
    color: Colors.textSecondary, lineHeight: Typography.lineHeightCaption + 2,
  },

  // Action card
  actionCard: {
    backgroundColor: Colors.surface, marginHorizontal: Spacing.base, marginTop: Spacing.base,
    borderRadius: BorderRadius.card, padding: Spacing.base,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  activeIndicator: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  activeDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: CalColors.period,
  },
  activeText: {
    flex: 1, fontSize: Typography.fontSizeCaption,
    color: Colors.primary, fontWeight: Typography.fontWeightMedium,
  },
  startBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    backgroundColor: Colors.primary, borderRadius: BorderRadius.button,
    paddingVertical: Spacing.md, minHeight: 48,
  },
  startBtnText: {
    fontSize: Typography.fontSizeBody, fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textOnPrimary,
  },
  endBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    backgroundColor: '#7BC4A8', borderRadius: BorderRadius.button,
    paddingVertical: Spacing.md, minHeight: 48,
  },
  endBtnText: {
    fontSize: Typography.fontSizeBody, fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textOnPrimary,
  },
  btnActive: {
    backgroundColor: Colors.textSecondary,
  },

  // Selection mode hint
  selectionHint: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.surfacePink, marginHorizontal: Spacing.base, marginTop: Spacing.base,
    borderRadius: BorderRadius.button, paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
  },
  selectionHintText: {
    flex: 1, fontSize: Typography.fontSizeCaption,
    color: Colors.primary, fontWeight: Typography.fontWeightMedium,
    lineHeight: Typography.lineHeightCaption + 2,
  },

  // Prediction card
  predictionCard: {
    backgroundColor: Colors.surface, marginHorizontal: Spacing.base, marginTop: Spacing.base,
    borderRadius: BorderRadius.card, padding: Spacing.base,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
    borderLeftWidth: 4, borderLeftColor: Colors.primary,
  },
  predictionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md,
  },
  predictionTitle: {
    fontSize: Typography.fontSizeBody, fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textPrimary,
  },
  predictionBody: { marginBottom: Spacing.md },
  predictionDate: {
    fontSize: Typography.fontSizeLargeTitle, fontWeight: Typography.fontWeightBold,
    color: Colors.primary,
  },
  predictionDays: {
    fontSize: Typography.fontSizeCaption, color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  predictionStats: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.background, borderRadius: BorderRadius.button,
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.sm,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: {
    fontSize: Typography.fontSizeMediumTitle, fontWeight: Typography.fontWeightBold,
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 10, color: Colors.textSecondary, marginTop: 2, textAlign: 'center',
  },
  statDivider: {
    width: 1, height: 28, backgroundColor: Colors.border,
  },

  // Calendar card
  calCard: {
    backgroundColor: Colors.surface, marginHorizontal: Spacing.base, marginTop: Spacing.base,
    borderRadius: BorderRadius.card, padding: Spacing.base,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  calCardActive: {
    borderWidth: 2, borderColor: Colors.primary + '40',
  },

  // Month nav
  monthNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: Spacing.base,
  },
  navBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  monthTitle: {
    fontSize: Typography.fontSizeMediumTitle, fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textPrimary,
  },

  // Weekday row
  weekRow: { flexDirection: 'row', marginBottom: Spacing.xs },
  weekDay: {
    width: CELL_SIZE, textAlign: 'center',
    fontSize: Typography.fontSizeCaption, fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textSecondary,
  },

  // Day grid — marcações circulares
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: CELL_SIZE, height: CELL_SIZE,
    alignItems: 'center', justifyContent: 'center',
  },
  dayCircle: {
    width: CIRCLE_SIZE, height: CIRCLE_SIZE,
    borderRadius: 999,
    overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
  },
  dayText: {
    fontSize: 13, fontWeight: Typography.fontWeightMedium, color: Colors.textPrimary,
  },

  // Marcações circulares com cores amigáveis
  periodCircle: {
    backgroundColor: CalColors.period,
  },
  predictionCircle: {
    backgroundColor: CalColors.prediction,
  },
  todayCircle: {
    backgroundColor: CalColors.todayBg,
    borderWidth: 2,
    borderColor: CalColors.todayBorder,
  },
  todayMarkedRing: {
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15, shadowRadius: 2, elevation: 2,
  },
  selectableDay: {
    // Sutil para indicar que o dia é clicável
  },
  futureDay: {
    opacity: 0.3,
  },
  otherMonth: { opacity: 0 },
  otherMonthText: { color: Colors.textDisabled },
  todayDot: {
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: CalColors.todayBorder,
    position: 'absolute', bottom: 2,
  },

  // Legend
  legendCard: {
    backgroundColor: Colors.surface, marginHorizontal: Spacing.base, marginTop: Spacing.base,
    borderRadius: BorderRadius.card, padding: Spacing.base,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  legendTitle: {
    fontSize: Typography.fontSizeBody, fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textPrimary, marginBottom: Spacing.md,
  },
  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  legendDot: { width: 14, height: 14, borderRadius: 999, overflow: 'hidden' },
  legendText: { fontSize: Typography.fontSizeCaption, color: Colors.textSecondary },

  // History button
  historyBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.surface, marginHorizontal: Spacing.base, marginTop: Spacing.base,
    borderRadius: BorderRadius.card, padding: Spacing.base,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  historyBtnLeft: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
  },
  historyBtnTitle: {
    fontSize: Typography.fontSizeBody, fontWeight: Typography.fontWeightSemiBold,
    color: Colors.textPrimary,
  },
  historyBtnSub: {
    fontSize: Typography.fontSizeCaption, color: Colors.textSecondary, marginTop: 2,
  },

  // Info card
  infoCard: {
    backgroundColor: Colors.surface, marginHorizontal: Spacing.base, marginTop: Spacing.base,
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.card, padding: Spacing.base,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  infoText: { fontSize: Typography.fontSizeBody, color: Colors.textPrimary },
  infoValue: { fontWeight: Typography.fontWeightSemiBold, color: Colors.primary },
  warningRow: { marginTop: Spacing.xs, alignItems: 'flex-start' },
  warningText: {
    flex: 1, fontSize: Typography.fontSizeCaption, color: Colors.textSecondary,
    lineHeight: Typography.lineHeightCaption + 2,
  },

  // Empty state
  emptyCard: {
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.surface, marginHorizontal: Spacing.base, marginTop: Spacing.base,
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.card, padding: Spacing.xxl,
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

export default CycleScreen;
