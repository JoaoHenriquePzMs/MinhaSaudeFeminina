/**
 * useTodaySummary — Hook de dados do Resumo de Hoje
 *
 * Fornece os dados do resumo diário para o componente TodaySummary.
 * Estado inicial populado com MOCK_SUMMARY_DATA, permitindo evolução
 * futura para integração com APIs reais.
 *
 * Requisitos: 4.3, 4.4, 4.5, 4.6
 */

import { useState } from 'react';
import { TodaySummaryData } from '../data/types';
import { MOCK_SUMMARY_DATA } from '../data/mockData';

export const useTodaySummary = () => {
  const [summaryData] = useState<TodaySummaryData>(MOCK_SUMMARY_DATA);
  return { summaryData };
};
