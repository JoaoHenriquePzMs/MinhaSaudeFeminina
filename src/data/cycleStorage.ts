/**
 * Cycle Storage — Serviço de Persistência Local
 * Minha Saúde Feminina
 *
 * CRUD de registros de ciclo menstrual via AsyncStorage.
 * Cada registro representa um ciclo com data de início e fim da menstruação.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Chave de armazenamento ───────────────────────────────────────────────────

const STORAGE_KEY = '@minha_saude_feminina/cycle_records';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface CycleRecord {
  /** UUID gerado no momento da criação */
  id: string;
  /** Data de início da menstruação (ISO 8601 YYYY-MM-DD) */
  startDate: string;
  /** Data de término da menstruação (ISO 8601 YYYY-MM-DD), null se ainda ativo */
  endDate: string | null;
  /** Timestamp ISO 8601 da criação do registro */
  createdAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Gera um ID único simples (sem dependência de uuid) */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/** Converte string ISO para Date normalizada (sem horas) */
function toDateOnly(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Retorna data de hoje no formato YYYY-MM-DD */
export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Diferença em dias entre duas datas ISO */
function daysBetween(a: string, b: string): number {
  const msDay = 86_400_000;
  return Math.round((toDateOnly(b).getTime() - toDateOnly(a).getTime()) / msDay);
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

/** Retorna todos os registros ordenados por startDate (mais recente primeiro) */
export async function getAllCycleRecords(): Promise<CycleRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const records: CycleRecord[] = JSON.parse(raw);
    return records.sort((a, b) => b.startDate.localeCompare(a.startDate));
  } catch {
    return [];
  }
}

/** Salva a lista completa de registros */
async function saveAll(records: CycleRecord[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

/** Cria um novo registro de ciclo (início da menstruação) */
export async function createCycleRecord(startDate: string): Promise<CycleRecord> {
  const record: CycleRecord = {
    id: generateId(),
    startDate,
    endDate: null,
    createdAt: new Date().toISOString(),
  };
  const all = await getAllCycleRecords();
  all.push(record);
  await saveAll(all);
  return record;
}

/** Finaliza um ciclo ativo (define endDate) */
export async function endCycleRecord(id: string, endDate: string): Promise<CycleRecord | null> {
  const all = await getAllCycleRecords();
  const idx = all.findIndex(r => r.id === id);
  if (idx === -1) return null;
  all[idx].endDate = endDate;
  await saveAll(all);
  return all[idx];
}

/** Remove um registro */
export async function deleteCycleRecord(id: string): Promise<void> {
  const all = await getAllCycleRecords();
  const filtered = all.filter(r => r.id !== id);
  await saveAll(filtered);
}

/** Retorna o registro mais recente (pode ser o ativo) */
export async function getLatestCycleRecord(): Promise<CycleRecord | null> {
  const all = await getAllCycleRecords();
  return all.length > 0 ? all[0] : null;
}

/** Retorna o registro ativo (sem endDate) se existir */
export async function getActiveCycleRecord(): Promise<CycleRecord | null> {
  const all = await getAllCycleRecords();
  return all.find(r => r.endDate === null) ?? null;
}

// ─── Cálculos ─────────────────────────────────────────────────────────────────

/**
 * Calcula a duração média do ciclo (dias entre startDate de ciclos consecutivos).
 * Precisa de pelo menos 2 registros finalizados.
 * Retorna 28 como fallback.
 */
export function calculateAverageCycleLength(records: CycleRecord[]): number {
  const completed = records
    .filter(r => r.endDate !== null)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  if (completed.length < 2) return 28; // padrão

  let totalDays = 0;
  let count = 0;

  for (let i = 1; i < completed.length; i++) {
    const diff = daysBetween(completed[i - 1].startDate, completed[i].startDate);
    if (diff > 0 && diff <= 60) { // ignorar outliers > 60 dias
      totalDays += diff;
      count++;
    }
  }

  return count > 0 ? Math.round(totalDays / count) : 28;
}

/**
 * Calcula a duração média da menstruação (dias entre startDate e endDate).
 * Retorna 5 como fallback.
 */
export function calculateAveragePeriodLength(records: CycleRecord[]): number {
  const completed = records.filter(r => r.endDate !== null);

  if (completed.length === 0) return 5;

  let totalDays = 0;
  for (const r of completed) {
    totalDays += daysBetween(r.startDate, r.endDate!) + 1; // +1 inclui o dia de início
  }

  return Math.round(totalDays / completed.length);
}

/**
 * Prevê a data do próximo ciclo baseado no último registro e na média.
 * Retorna null se não houver registros.
 */
export function predictNextPeriod(records: CycleRecord[]): string | null {
  const sorted = [...records].sort((a, b) => b.startDate.localeCompare(a.startDate));
  if (sorted.length === 0) return null;

  const latest = sorted[0];
  const avgLength = calculateAverageCycleLength(records);

  const startDate = toDateOnly(latest.startDate);
  const nextDate = new Date(startDate);
  nextDate.setDate(nextDate.getDate() + avgLength);

  const y = nextDate.getFullYear();
  const m = String(nextDate.getMonth() + 1).padStart(2, '0');
  const d = String(nextDate.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Retorna o número de dias até a próxima menstruação.
 * Negativo se já passou da data prevista.
 */
export function daysUntilNextPeriod(records: CycleRecord[]): number | null {
  const nextDate = predictNextPeriod(records);
  if (!nextDate) return null;
  return daysBetween(todayISO(), nextDate);
}

/**
 * Verifica se uma data ISO está dentro de algum período menstrual registrado.
 */
export function isDateInPeriod(dateISO: string, records: CycleRecord[]): boolean {
  for (const r of records) {
    const start = r.startDate;
    const end = r.endDate ?? r.startDate; // se ativo, só o dia de início
    if (dateISO >= start && dateISO <= end) return true;
  }
  return false;
}

/**
 * Verifica se uma data ISO está dentro do período de previsão da próxima menstruação.
 */
export function isDateInPrediction(dateISO: string, records: CycleRecord[]): boolean {
  const nextStart = predictNextPeriod(records);
  if (!nextStart) return false;

  const avgPeriod = calculateAveragePeriodLength(records);
  const startDate = toDateOnly(nextStart);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + avgPeriod - 1);

  const y = endDate.getFullYear();
  const m = String(endDate.getMonth() + 1).padStart(2, '0');
  const d = String(endDate.getDate()).padStart(2, '0');
  const nextEnd = `${y}-${m}-${d}`;

  return dateISO >= nextStart && dateISO <= nextEnd;
}
