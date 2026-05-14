import { ImageSourcePropType } from 'react-native';

// Requisitos: 3.3 — Fases válidas do ciclo menstrual
export type CyclePhase =
  | 'FASE MENSTRUAL'
  | 'FASE FOLICULAR'
  | 'FASE OVULATÓRIA'
  | 'FASE LÚTEA';

// Requisito: 1.2 — Dados do ciclo menstrual da usuária
export interface CycleData {
  day: number;         // 1–35
  phase: CyclePhase;
  cycleLength: number; // Duração total do ciclo em dias
  startDate: string;   // ISO 8601
}

// Requisito: 4.3, 4.4, 4.5, 4.6 — Dados do resumo diário
export interface TodaySummaryData {
  nextPeriodDays?: number;
  mood?: string;
  dailyTip?: string;
}

// Requisito: 6.1 — Conteúdo de saúde exibido no card
export interface HealthContent {
  id: string;
  title: string;                    // max 60 chars
  description: string;
  imageSource?: ImageSourcePropType;
  imageAlt: string;
  articleUrl?: string;
}

// Requisito: 2.2 — Perfil da usuária exibido no Header
export interface UserProfile {
  name: string;
  avatarUrl?: string;
  notificationCount: number;
}

// Requisito: 5.2, 5.3 — Item de acesso rápido na grade 2×2
export interface QuickAccessItem {
  id: string;
  label: 'Sintomas' | 'Ciclo' | 'Prevenção' | 'Bem-Estar';
  icon: string;
  route: string;
  accessibilityLabel: string;
}
