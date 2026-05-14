/**
 * Mock Data — Minha Saúde Feminina
 *
 * Dados mock para o estado inicial da aplicação.
 * Garante que todos os componentes da Home Screen sejam exibidos
 * com conteúdo no primeiro carregamento, sem depender de APIs externas.
 *
 * Requisitos: 8.7
 */

import { CycleData, TodaySummaryData, HealthContent, UserProfile, QuickAccessItem } from './types';

// Requisito: 1.2 — Dados do ciclo menstrual da usuária
export const MOCK_CYCLE_DATA: CycleData = {
  day: 14,
  phase: 'FASE OVULATÓRIA',
  cycleLength: 28,
  startDate: '2025-07-01',
};

// Requisito: 4.3, 4.4, 4.5 — Dados do resumo diário
export const MOCK_SUMMARY_DATA: TodaySummaryData = {
  nextPeriodDays: 14,
  mood: 'Bem-disposta',
  dailyTip: 'Beba pelo menos 2 litros de água hoje para manter a hidratação.',
};

// Requisito: 6.1 — Conteúdo de saúde exibido no card
export const MOCK_HEALTH_CONTENT: HealthContent = {
  id: '1',
  title: 'Entendendo as fases do ciclo menstrual',
  description: 'Conheça cada fase do seu ciclo e como elas afetam seu corpo e emoções ao longo do mês.',
  imageAlt: 'Ilustração do ciclo menstrual com as quatro fases representadas em cores',
};

// Requisito: 2.2 — Perfil da usuária exibido no Header
export const MOCK_USER_PROFILE: UserProfile = {
  name: 'Maria',
  notificationCount: 3,
};

// Requisito: 5.2, 5.3 — Itens de acesso rápido na grade 2×2
export const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  {
    id: '1',
    label: 'Sintomas',
    icon: 'medical-outline',
    route: 'Sintomas',
    accessibilityLabel: 'Ir para Sintomas',
  },
  {
    id: '2',
    label: 'Ciclo',
    icon: 'sync-outline',
    route: 'Ciclo',
    accessibilityLabel: 'Ir para Ciclo',
  },
  {
    id: '3',
    label: 'Prevenção',
    icon: 'shield-checkmark-outline',
    route: 'Prevencao',
    accessibilityLabel: 'Ir para Prevenção',
  },
  {
    id: '4',
    label: 'Bem-Estar',
    icon: 'leaf-outline',
    route: 'BemEstar',
    accessibilityLabel: 'Ir para Bem-Estar',
  },
];
