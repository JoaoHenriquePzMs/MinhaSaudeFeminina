/**
 * useCycleData — Hook de dados do ciclo menstrual
 * Minha Saúde Feminina
 *
 * Fornece o estado do ciclo menstrual da usuária com persistência real
 * via AsyncStorage. Carrega registros ao montar e expõe funções de CRUD.
 *
 * Requisitos: 3.1, 3.2, 3.3
 */

import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { CyclePhase } from '../data/types';
import {
  CycleRecord,
  getAllCycleRecords,
  createCycleRecord,
  endCycleRecord,
  deleteCycleRecord as deleteRecord,
  getActiveCycleRecord,
  calculateAverageCycleLength,
  calculateAveragePeriodLength,
  predictNextPeriod,
  daysUntilNextPeriod,
  todayISO,
} from '../data/cycleStorage';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface CycleDataState {
  /** Todos os registros de ciclo */
  records: CycleRecord[];
  /** Registro ativo (menstruação em andamento, sem endDate) */
  activeRecord: CycleRecord | null;
  /** Dia atual do ciclo (1-indexed), null se sem registros */
  cycleDay: number | null;
  /** Fase atual do ciclo */
  phase: CyclePhase;
  /** Duração média do ciclo em dias */
  averageCycleLength: number;
  /** Duração média da menstruação em dias */
  averagePeriodLength: number;
  /** Data prevista do próximo ciclo (ISO) */
  nextPeriodDate: string | null;
  /** Dias até a próxima menstruação */
  daysUntilNext: number | null;
  /** Se está carregando os dados do storage */
  loading: boolean;
}

export interface CycleDataActions {
  /** Inicia um novo período menstrual */
  startPeriod: (date?: string) => Promise<void>;
  /** Finaliza o período menstrual ativo */
  endPeriod: (date?: string) => Promise<void>;
  /** Remove um registro de ciclo */
  deleteCycle: (id: string) => Promise<void>;
  /** Recarrega os dados do storage */
  refresh: () => Promise<void>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCurrentPhase(
  records: CycleRecord[],
  averageCycleLength: number
): { phase: CyclePhase; cycleDay: number | null } {
  if (records.length === 0) {
    return { phase: 'FASE FOLICULAR', cycleDay: null };
  }

  const sorted = [...records].sort((a, b) => b.startDate.localeCompare(a.startDate));
  const latest = sorted[0];

  const today = todayISO();
  const startParts = latest.startDate.split('-').map(Number);
  const todayParts = today.split('-').map(Number);

  const startDate = new Date(startParts[0], startParts[1] - 1, startParts[2]);
  const todayDate = new Date(todayParts[0], todayParts[1] - 1, todayParts[2]);

  const diffMs = todayDate.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);

  // Posição no ciclo (1-indexed)
  const pos = ((diffDays % averageCycleLength) + averageCycleLength) % averageCycleLength + 1;
  const cycleDay = pos;

  // Se há um registro ativo (menstruação em andamento)
  if (latest.endDate === null) {
    return { phase: 'FASE MENSTRUAL', cycleDay };
  }

  // Determinar fase com base na posição
  const avgPeriod = calculateAveragePeriodLength(records);
  const ovulationDay = averageCycleLength - 14;

  if (pos <= avgPeriod) {
    return { phase: 'FASE MENSTRUAL', cycleDay };
  } else if (pos < ovulationDay - 2) {
    return { phase: 'FASE FOLICULAR', cycleDay };
  } else if (pos <= ovulationDay + 1) {
    return { phase: 'FASE OVULATÓRIA', cycleDay };
  } else {
    return { phase: 'FASE LÚTEA', cycleDay };
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useCycleData = (): CycleDataState & CycleDataActions => {
  const [records, setRecords] = useState<CycleRecord[]>([]);
  const [activeRecord, setActiveRecord] = useState<CycleRecord | null>(null);
  const [loading, setLoading] = useState(true);

  // Carrega dados do storage
  const loadData = useCallback(async () => {
    try {
      const allRecords = await getAllCycleRecords();
      const active = await getActiveCycleRecord();
      setRecords(allRecords);
      setActiveRecord(active);
    } catch (error) {
      console.error('Erro ao carregar dados do ciclo:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Recarrega dados sempre que a tela ganha foco
  // (resolve o problema de deletar no histórico e não atualizar o calendário)
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // Valores calculados
  const averageCycleLength = calculateAverageCycleLength(records);
  const averagePeriodLength = calculateAveragePeriodLength(records);
  const nextPeriodDate = predictNextPeriod(records);
  const daysUntilNext = daysUntilNextPeriod(records);
  const { phase, cycleDay } = getCurrentPhase(records, averageCycleLength);

  // ── Actions ─────────────────────────────────────────────────────────────────

  const startPeriod = useCallback(async (date?: string) => {
    const startDate = date ?? todayISO();
    await createCycleRecord(startDate);
    await loadData();
  }, [loadData]);

  const endPeriod = useCallback(async (date?: string) => {
    if (!activeRecord) return;
    const endDate = date ?? todayISO();
    await endCycleRecord(activeRecord.id, endDate);
    await loadData();
  }, [activeRecord, loadData]);

  const deleteCycle = useCallback(async (id: string) => {
    await deleteRecord(id);
    await loadData();
  }, [loadData]);

  const refresh = useCallback(async () => {
    setLoading(true);
    await loadData();
  }, [loadData]);

  return {
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
    deleteCycle,
    refresh,
  };
};
